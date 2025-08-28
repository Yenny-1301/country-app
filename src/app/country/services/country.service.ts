import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mappers';
import { catchError, delay, map, throwError } from 'rxjs';
// https://restcountries.com/v3.1/capital/{capital}

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query:string){
    query = query.toLowerCase();

    return this.http
      .get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRESTCountriesToCountries(resp)),
        // delay(3000),
        catchError((error) => {
          console.log('Error fetching',error);
          return throwError(()=> new Error(`No se puedo obtener paises con ese query ${query}`));
        })
      )
  }

  searchByCountry(query: string) {
    query = query.toLowerCase();

    return this.http
      .get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRESTCountriesToCountries(resp)),
        // delay(2000),
        catchError((error) => {
          console.log('Error fetching',error);
          return throwError(()=> new Error(`No se puedo obtener paises con ese query ${query}`));
        })
      )
  }

  searchCountryByAlphaCode(query: string) {
    query = query.toLowerCase();
    return this.http
      .get<RESTCountry[]>(`${API_URL}/alpha/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRESTCountriesToCountries(resp)),
        map(countries => countries.at(0)),
        catchError((error) => {
          console.log('Error fetching',error);
          return throwError(()=> new Error(`No se puedo encontrar un pais con ese codigo: ${query}`));
        })
      )
  }
}
