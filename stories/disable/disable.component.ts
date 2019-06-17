import { Component } from '@angular/core';

@Component({
  selector: 'testing-disabling',
  template: `
    <editor [disabled]="isDisabled" initialValue="<p>hello world</p>"></editor>
    <button (click)="toggleDisabled()">{{ isDisabled ? 'enable' : 'disable' }}</button>
  `
})
export class DisablingComponent {
  public isDisabled = false;
  public toggleDisabled = () => (this.isDisabled = !this.isDisabled);
}
