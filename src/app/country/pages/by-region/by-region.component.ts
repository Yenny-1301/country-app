import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { firstValueFrom } from 'rxjs';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { Region } from '../../interfaces/region.type';
import { ActivatedRoute, Router } from '@angular/router';


function validateQueryParam(queryParam:string): Region{
  queryParam = queryParam.toLowerCase();
  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic',
  };
  return validRegions[queryParam] ?? 'Africa';
}

@Component({
  selector: 'app-by-region',
  templateUrl: './by-region.component.html',
  imports: [CountryListComponent],
})
export class ByRegionComponent {
  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';
  selectedRegion = linkedSignal<Region | null>(()=> validateQueryParam(this.queryParam));

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];
  countryResource = resource({
  params: () => ({region: this.selectedRegion()}),
  loader: async ({params}) => {
      if(!params.region) return [];

      this.router.navigate(['/country/by-region'], {
         queryParams: { region: params.region }
      });

      return await firstValueFrom(
        this.countryService.searchCountryByRegion(params.region)
      );
    },
  });
 }
