import { Component } from '@angular/core';
import { apiKey } from '../Settings';

@Component({
  selector: 'testing-disabling',
  template: `
    <button (click)="toggleDisabled()">{{ isDisabled ? 'enable' : 'disable' }}</button>
    <editor [apiKey]="apiKey" [disabled]="isDisabled" initialValue="<p>hello world</p>"></editor>
  `
})
export class DisablingComponent {
  public isDisabled = false;
  public apiKey = apiKey;
  public toggleDisabled = () => (this.isDisabled = !this.isDisabled);
}
