import { Component,inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

// https://restcountries.com/v3.1/capital/{capital}
@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html'
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal(() => this.queryParam);

  countryResource = resource({
  params: () => ({query: this.query()}),
  loader: async ({params}) => {
    console.log('Loading countries for query:', params.query);
      if(!params.query) return [];
      this.router.navigate(['/country/by-capital'], {
         queryParams: { query: params.query }
        });
      return await firstValueFrom(
        this.countryService.searchByCapital(params.query)
      );
    },
  });

  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query:string){
  //   if(this.isLoading()) return
  //   this.isLoading.set(true);
  //   this.isError.set(null)

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries)=>{
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error:(err)=>{
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err)
  //     }
  //    });
  // }
 }

