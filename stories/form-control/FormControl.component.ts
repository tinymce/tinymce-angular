/* eslint-disable no-console */
import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'form-control',
  templateUrl: './FormControl.component.html',
})
export class FormControlComponent {
  public formControl: FormControl<string | null>;

  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  public constructor(private readonly formBuilder: FormBuilder) {
    this.formControl = this.formBuilder.control<string | null>(null);
    this.formControl.valueChanges.subscribe(console.log);
    this.formControl.setValue('<p>Initial value</p>');
    // Console log should be triggered just once
  }
}
