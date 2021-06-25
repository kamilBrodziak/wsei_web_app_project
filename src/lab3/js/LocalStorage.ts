type TWeatherAppLS = string[];
class LocalStorage {
    static key: 'weatherApp'
    static saveCity(name:string) {
        let cities = this.getCities();
        if(!cities.includes(name)) {
            cities.push(name);
        }
        localStorage.setItem(this.key, JSON.stringify(cities));
    }

    static getCities():TWeatherAppLS {
        const str = localStorage.getItem(this.key);
        return !str ? [] : JSON.parse(str);
    }

    getCity(name:string) {
        localStorage.getItem(name);
    }
}

export default LocalStorage;