import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// tslint:disable:no-console
@Component({
  templateUrl: './FormControl.component.html'
})
export class FormControlComponent {
  formControl = this.formBuilder.control(null);

  constructor(private readonly formBuilder: FormBuilder) {
    this.formControl.valueChanges.subscribe(console.log);
    this.formControl.setValue('<p>Initial value</p>');
    // Console log should be triggered just once
  }
}
