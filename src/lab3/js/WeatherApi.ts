interface IWeatherApiObj {
    coord: {
        lon: number; // longitude
        lat: number; // latitude
    }
    weather: {
        id: number; // weather condition id
        main: string; // group (rain, snow, extreme etc.)
        description:string; // weather condition within the group
        icon: string; // icon id
    }[]
    base:string; // internal parameter
    main: {
        temp:number; // temperature
        feels_like: number; // human perception of weather
        pressure:number; // atmospheric pressure
        humidity:number;
        temp_min:number;
        temp_max:number;
        sea_level:number; // pressure on the sea level
        grnd_level:number; // pressure ond ground level
    }
    visibility:number;
    wind: {
        speed:number;
        deg:number; // direction in degrees
        gust: number;
    }
    clouds: {
        all: number; // cloudiness %
    }
    rain?: {
        '1h': number; // rain volume for the last 1 hour, mm
        '3h'?:number; // rain volume for the last 3 hour, mm
    }
    snow?: {
        '1h': number; // snow volume for the last 1 hour, mm
        '3h'?:number; // snow volume for the last 3 hour, mm
    }
    dt: number; // time of data calculation, unix, UTC
    dt_txt?:string;
    sys:{
        type:number; //internal parameter
        id: number; //internal parameter
        message: number; // internal parameter
        country: string; // country code
        sunrise: number; // sunrise time, unix, utc
        sunset: number; // sunset time, unix, utc
    }
    id: number; // city id
    name: string; // city name
    cod: number; // internal parameter
    timezone: number; // sifts in secods from utc;
}

export interface IWeather {
    city: string;
    temp:number;
    pressure: number;
    humidity: number;
    iconUrl: string;
    date?: Date;
}

class WeatherApi {
    static apiKey:string = "457d2b3ccc2d2ecdd7f7ce68f8425273";

    private static mapApiObjToWeather(json:IWeatherApiObj) : IWeather {
        const weather:IWeather = {
            city: json.name,
            temp: json.main.temp,
            humidity: json.main.humidity,
            pressure: json.main.pressure,
            iconUrl: `http://openweathermap.org/img/w/${json.weather[0].icon}.png`,
        }
        if(json.dt_txt) {
            const dateParts = json.dt_txt.replaceAll('-', ' ').replaceAll(':', ' ').split(' ').map(str => parseInt(str));
            weather.date = new Date(dateParts[0], dateParts[1], dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
        }
        return weather;
    }

    static async getWeather(city:string):Promise<IWeather> {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${this.apiKey}&units=metric`;
        return await fetch(url).then(response => response.json())
            .then((json:IWeatherApiObj) => this.mapApiObjToWeather(json))
    }

    static async getWeatherForecast(city:string):Promise<IWeather[]> {
        const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
        return await fetch(url).then(response => response.json()).then(json => json.list)
            .then((json:IWeatherApiObj[]) => json.map(w => this.mapApiObjToWeather(w)))
    }

}

export default WeatherApi;