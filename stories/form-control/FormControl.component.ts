import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { apiKey } from 'stories/Settings';

@Component({
  selector: 'form-control',
  templateUrl: './FormControl.component.html',
})
export class FormControlComponent {
  public apiKey = apiKey;
  public formControl: FormControl<string | null>;

  // eslint-disable-next-line @typescript-eslint/parameter-properties
  public constructor(private readonly formBuilder: FormBuilder) {
    this.formControl = this.formBuilder.control<string | null>(null);
    // eslint-disable-next-line no-console
    this.formControl.valueChanges.subscribe(console.log);
    this.formControl.setValue('<p>Initial value</p>');
    // Console log should be triggered just once
  }
}
