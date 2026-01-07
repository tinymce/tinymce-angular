import { Component } from '@angular/core';
import { apiKey, sampleContent } from '../Settings';

@Component({
  selector: 'readonly',
  templateUrl: './Readonly.component.html',
  standalone: false
})
export class ReadonlyComponent {
  public isReadonly = false;
  public apiKey = apiKey;
  public initialValue = sampleContent;
  public toggleReadonly = () => (this.isReadonly = !this.isReadonly);
}
