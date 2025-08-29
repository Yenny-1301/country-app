import { Country } from "../interfaces/country.interface";
import { RESTCountry } from "../interfaces/rest-countries.interface";

export class CountryMapper{

  static mapRESTCountryToCountry(value: RESTCountry): Country{
    return {
      cca2: value.cca2,
      flag: value.flag,
      flagSvg: value.flags.svg,
      name: value.translations['spa'].common ?? 'No Spanish Name',
      capital: value.capital?.join(','),
      population: value.population,
      currencies: value.currencies ? Object.values(value.currencies).map(c => c.name).join(', ') : 'No Currency',
      region: value.region,
      subRegion: value.subregion,
      map: value.maps.googleMaps
    };
  }

  static mapRESTCountriesToCountries(restCountries: RESTCountry[]){
    return  restCountries.map(this.mapRESTCountryToCountry);
  }
}
