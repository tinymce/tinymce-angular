import { Component } from '@angular/core';

@Component({
  selector: 'testing-disabling',
  template: `
    <button (click)="toggleDisabled()">{{ isDisabled ? 'enable' : 'disable' }}</button>
    <editor [disabled]="isDisabled" initialValue="<p>hello world</p>"></editor>
  `
})
export class DisablingComponent {
  public isDisabled = false;
  public toggleDisabled = () => (this.isDisabled = !this.isDisabled);
}
