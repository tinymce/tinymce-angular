import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
// tslint:disable:max-classes-per-file

@Component({
  selector: 'container',
  template: `
    <ng-container *ngIf="show" [ngTemplateOutlet]="templateRef"></ng-container>
  `
})
export class MenuComponent {
  @Input() public show: boolean = true;
  @ContentChild(TemplateRef) public templateRef: TemplateRef<any>;
}

@Component({
  styleUrls: ['./Transclusion.component.css'],
  template: `
  <div>
    <editor-count></editor-count>
    <button [innerText]="show ? 'Hide' : 'Show'" (click)="handleToggle()"></button>

    <container [show]="show" [ngClass]="'container'">
      <ng-template #templateRef>
        <editor [(ngModel)]="editorValue"></editor>
      </ng-template>
    </container>
  <div>
  `
})
export class TransclusionComponent {
  public editorValue = '';
  public show = true;

  public handleToggle() {
    this.show = !this.show;
  }
}