import { Component, input } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';

@Component({
  selector: 'app-country-information-page',
  imports: [],
  templateUrl: './country-information-page.component.html',
})
export class CountryInformationPageComponent {
  country = input.required<Country>();
}
