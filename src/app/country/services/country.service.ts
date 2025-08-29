import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mappers';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>(); // es un mapa vacio
  private queryCacheCountry = new Map<string, Country[]>(); // es un mapa vacio
  private queryCacheRegion = new Map<string, Country[]>(); // es un mapa vacio

  searchByCapital(query:string):Observable<Country[]>{
    query = query.toLowerCase();

    //Verifica si la busqueda ya fue realizada
    if(this.queryCacheCapital.has(query)){
      return of(this.queryCacheCapital.get(query)!);
    }

    return this.http
      .get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRESTCountriesToCountries(resp)),
        tap(countries => this.queryCacheCapital.set(query,countries)), //almacena en cache la busqueda
        catchError((error) => {
          console.log('Error fetching',error);
          return throwError(()=> new Error(`No se puedo obtener paises con ese query ${query}`));
        })
      )
  }

  searchByCountry(query: string):Observable<Country[]> {
    query = query.toLowerCase();

    if(this.queryCacheCountry.has(query)){
      return of(this.queryCacheCountry.get(query)!);
    }
    console.log('No cache found for country search');

    return this.http
      .get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map((resp) => CountryMapper.mapRESTCountriesToCountries(resp)),
        tap(countries => this.queryCacheCountry.set(query,countries)), //almacena en cache la busqueda
        delay(3000),
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

  searchCountryByRegion(region: Region) {
    if(this.queryCacheRegion.has(region)){
      return of(this.queryCacheRegion.get(region)!);
    }

    return this.http
      .get<RESTCountry[]>(`${API_URL}/region/${region}`)
      .pipe(
        map((resp) => CountryMapper.mapRESTCountriesToCountries(resp)),
        tap(countries => this.queryCacheRegion.set(region,countries)), //almacena en cache la busqueda
        catchError((error) => {
          console.log('Error fetching',error);
          return throwError(()=> new Error(`No se puedo encontrar un pais en esta region: ${region}`));
        })
      )
  }
}
