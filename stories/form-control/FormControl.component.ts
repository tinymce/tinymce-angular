/* eslint-disable no-console */
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  templateUrl: './FormControl.component.html'
})
export class FormControlComponent {
  public formControl = this.formBuilder.control<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  public constructor(private readonly formBuilder: FormBuilder) {
    this.formControl.valueChanges.subscribe(console.log);
    this.formControl.setValue('<p>Initial value</p>');
    // Console log should be triggered just once
  }
}
