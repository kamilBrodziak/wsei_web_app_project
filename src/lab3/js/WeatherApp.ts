import ElementBuilder, { EventType, TagName } from "../../utils/ElementBuilder";
import getEl from "../../utils/ElementGetter";
import LocalStorage from "./LocalStorage";
import WeatherApi, { IWeather } from "./WeatherApi";

class WeatherApp {
    weatherContainer: HTMLDivElement;
    cities: {
        weather:IWeather,
        timeUpdated: number;
        container: HTMLButtonElement;
    }[] = [];
    prognosisContainer: HTMLDivElement;
    cityInput: HTMLInputElement;
    form: HTMLFormElement;
    errorEl: HTMLDivElement;
    constructor() {
        this.weatherContainer = getEl('#weatherContainer');
        this.form = getEl("#weatherAppForm");
        this.prognosisContainer = getEl("#weatherPrognosis");
        this.cityInput = getEl("#weatherAppCityInput")
        this.errorEl = getEl("#weatherAppFormError");
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const city = this.cityInput.value;
            this.errorEl.innerHTML = "";
            if(city) {
                this.loadCity(city);
            }
        });
        LocalStorage.getCities().forEach(city => this.loadCity(city));
    }

    loadCity(name:string) {
        const load = (weather:IWeather) => {
            const isAlreadyAdded = this.cities.find((city) => city.weather.city === weather.city);
            if(isAlreadyAdded) {
                isAlreadyAdded.weather = weather;
                isAlreadyAdded.timeUpdated = Date.now();
                this.loadWeatherChildsIntoContainer(isAlreadyAdded.container, this.loadWeatherElements(weather));
            } else {
                LocalStorage.saveCity(name);
                const container = this.loadWeatherContainer(weather.city);
                this.weatherContainer.appendChild(container);
                this.loadWeatherChildsIntoContainer(container, this.loadWeatherElements(weather));
                this.cities.push({
                    weather: weather,
                    timeUpdated: Date.now(),
                    container: container
                })
            }
        }
        WeatherApi.getWeather(name).then(weather => {
            if(!weather) return;
            load(weather);
            setTimeout(() => this.loadCity(weather.city),  120 * 1000);
        }).catch(er => this.errorEl.innerText = "There is no such city");
    }

    loadWeatherElements(weather:IWeather) : HTMLElement[] {
        const title = new ElementBuilder<HTMLDivElement>(TagName.DIV)
            .addClass("cityName").innerHtml(weather.city).build();
        const temperature = new ElementBuilder<HTMLDivElement>(TagName.DIV)
            .addClass('temperature').innerHtml(`${Math.round(weather.temp)}${"&#8451;"}`).build();
        const humidityLabel = new ElementBuilder<HTMLSpanElement>(TagName.SPAN).innerText('Humidity:').build();
        const humiditySpan = new ElementBuilder<HTMLSpanElement>(TagName.SPAN).innerText(`${weather.humidity}%`).build();
        const humidity = new ElementBuilder<HTMLDivElement>(TagName.DIV)
            .addClass('humidity').appendChilds([humidityLabel, humiditySpan]).build();
        const pressureLabel = new ElementBuilder<HTMLSpanElement>(TagName.SPAN).innerText('Pressure:').build();
        const pressureSpan = new ElementBuilder<HTMLSpanElement>(TagName.SPAN).innerHtml(`${weather.pressure} hPa`).build();
        const pressure = new ElementBuilder<HTMLDivElement>(TagName.DIV)
            .addClass("pressure").appendChilds([pressureLabel, pressureSpan]).build();
        const icon = new ElementBuilder<HTMLImageElement>(TagName.IMG).build();
        icon.src = weather.iconUrl;
        const figure = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass('icon')
            .appendChild(icon).build();
        return [title, figure, temperature, humidity, pressure];
    }

    loadWeatherChildsIntoContainer(container:HTMLButtonElement, childs:HTMLElement[]) {
        container.innerHTML = "";
        childs.forEach(child => container.appendChild(child));
    }

    loadWeatherContainer(cityName:string) {
        const container = new ElementBuilder<HTMLButtonElement>(TagName.BUTTON)
            .addClass("weather").addEvent(EventType.ONCLICK, () => {
                WeatherApi.getWeatherForecast(cityName).then((weathers:IWeather[]) => {
                    this.loadWeatherPrognosis(cityName, weathers);
                })
            }).build();
        return container;
    }

    loadWeatherPrognosis(cityName:string, weathers:IWeather[]) {
        const parseDate = (date:Date) => {
            const prependZero = (n:number) => {
                return n > 10 ? `${n}` : `0${n}`
            }
            return `${prependZero(date.getDate())}/${prependZero(date.getMonth())} ` +
                `${prependZero(date.getHours())}:${prependZero(date.getMinutes())}`
        }
        this.prognosisContainer.innerHTML = "";
        const title = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass("title")
            .innerText(`Prognosis for ${cityName}`).build();
        
        const prognosisCont = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass('container')
            .build();
        weathers.forEach(weather => {
            const date = new ElementBuilder<HTMLDivElement>(TagName.DIV)
                .innerText(parseDate(weather.date)).addClass('date').build();
            const icon = new ElementBuilder<HTMLImageElement>(TagName.IMG).build();
            icon.src = weather.iconUrl;
            const temperature = new ElementBuilder<HTMLDivElement>(TagName.DIV)
                .addClass('temperature').innerHtml(`${Math.round(weather.temp)}${"&#8451;"}`).build();
            const figure = new ElementBuilder<HTMLDivElement>(TagName.DIV).addClass('icon')
                .appendChild(icon).build();
            const container = new ElementBuilder<HTMLDivElement>(TagName.DIV)
                .appendChilds([date,figure,temperature]).addClass("prognosis").build();
            prognosisCont.appendChild(container);
        });
        this.prognosisContainer.appendChild(title);
        this.prognosisContainer.appendChild(prognosisCont);
    }
}

export default WeatherApp;