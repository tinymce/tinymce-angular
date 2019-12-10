import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { apiKey } from '../Settings';
// tslint:disable:max-classes-per-file

@Component({
  selector: 'container',
  template: `
    <ng-container *ngIf="show" [ngTemplateOutlet]="templateRef"></ng-container>
  `
})
export class MenuComponent {
  @Input() public show: boolean = true;
  @ContentChild(TemplateRef, { static: false }) public templateRef!: TemplateRef<any>;
}

@Component({
  styles: [`
    .container {
      border: 1px solid blue;
      display: block;
      padding: 15px;
    }
  `],
  template: `
  <div>
    <editor-count></editor-count>
    <button [innerText]="show ? 'Hide' : 'Show'" (click)="handleToggle()"></button>

    <container [show]="show" [ngClass]="'container'">
      <ng-template #templateRef>
        <editor [apiKey]="apiKey" [(ngModel)]="editorValue"></editor>
      </ng-template>
    </container>
  <div>
  `
})
export class TransclusionComponent {
  public apiKey = apiKey;
  public editorValue = '';
  public show = true;

  public handleToggle() {
    this.show = !this.show;
  }
}