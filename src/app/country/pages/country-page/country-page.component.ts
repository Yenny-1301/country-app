import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { CountryInformationPageComponent } from "./country-information-page/country-information-page.component";

@Component({
  selector: 'app-country-page',
  imports: [NotFoundComponent, CountryInformationPageComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent implements OnInit{
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryService = inject(CountryService);
  isLoading = signal(false);
  isError = signal<string | null>(null);
  country = signal<Country|undefined>(undefined);

  ngOnInit(): void {
    if(this.isLoading()) return
    this.isLoading.set(true);
    this.isError.set(null)

    this.countryService.searchCountryByAlphaCode(this.countryCode).subscribe({
      next: (country)=>{
        this.isLoading.set(false);
        this.country.set(country);
      },
      error:(err)=>{
        this.isLoading.set(false);
        this.country.set(undefined);
        this.isError.set(err)
      }
     });
  }
}
