import { Component } from '@angular/core';
import { apiKey, sampleContent } from '../Settings';

@Component({
  selector: 'disabling',
  templateUrl: './Disabling.component.html',
  standalone: false
})
export class DisablingComponent {
  public isDisabled = false;
  public apiKey = apiKey;
  public initialValue = sampleContent;
  public toggleDisabled = () => (this.isDisabled = !this.isDisabled);
}
