/* eslint-disable max-classes-per-file */
import { Component, TemplateRef, Input } from '@angular/core';
import { apiKey } from '../Settings';

/*
  Normally when projecting content you would use ng-content but this is not something that works
  with TinyMCE due to its usage of an iframe (when in iframe mode). The reason for this is that
  the lifecycle of ng-content is controlled by its parent view and not where it's consumed. In
  other words, the projected content can be initialized and destroyed when not actually being in
  the DOM. Iframes will re-render whenever they are detached/attached to the DOM and thus this
  breaks TinyMCE.

  A workaround is to use a template outlet instead of content projection. The result is what you
  would expect from content projection, but with the lifecycle being in sync to where the content
  is being consumed.
*/

@Component({
  selector: 'container',
  styles: [ `
    .container {
      border: 1px solid blue;
      display: block;
      padding: 15px;
    }
  ` ],
  template: `
    <ng-template #placeHolder>
      <p>I am a placeholder.</p>
    </ng-template>

    <div [ngClass]="'container'">
      <button [innerText]="show ? 'Hide' : 'Show'" (click)="handleToggle()"></button>
      <ng-container *ngTemplateOutlet="show ? editorTemplate : placeHolder"></ng-container>
    <div>
  `
})
export class ContainerComponent {
  @Input() public editorTemplate!: TemplateRef<any>;
  public show = true;

  public handleToggle() {
    this.show = !this.show;
  }
}

@Component({
  template: `
    <ng-template #editorTemplate>
      <editor [apiKey]="apiKey" [(ngModel)]="editorValue"></editor>
    </ng-template>

    <container [editorTemplate]="editorTemplate"></container>
  `
})
export class ContentProjectionComponent {
  public apiKey = apiKey;
  public editorValue = '';
}