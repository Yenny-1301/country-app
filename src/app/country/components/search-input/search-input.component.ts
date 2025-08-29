import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  value = output<string>();
  placeholder = input<string>('Buscar');
  initialValue = input<string>('');
  inputValue = linkedSignal(() => this.initialValue() ?? '');

  // Efecto para manejar el debounce
  debounceEffect = effect((onCleanup)=>{
    const value = this.inputValue();
    const timeoutId = setTimeout(() => {
      this.value.emit(value);
    }, 500);
    //resetea el timeout en cada cambio de input
    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  });
}
