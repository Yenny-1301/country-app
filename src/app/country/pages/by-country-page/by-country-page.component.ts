import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { firstValueFrom } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal(() => this.queryParam);

  countryResource = resource({
  params: () => ({query: this.query()}),
  loader: async ({params}) => {
      if(!params.query) return [];
      this.router.navigate(['/country/by-country'], {
         queryParams: { query: params.query }
        });
      return await firstValueFrom(
        this.countryService.searchByCountry(params.query)
      );
    },
  });
}
