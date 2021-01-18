/* eslint-disable no-console */
import { Component } from '@angular/core';
import { apiKey, modelEvents, sampleContent } from '../Settings';

@Component({
  templateUrl: './DataBinding.component.html'
})
export class BindingComponent {
  public isEditingContent = true;
  public content = sampleContent;
  public apiKey = apiKey;
  public modelEvents = modelEvents;

  public editContent() {
    this.isEditingContent = !this.isEditingContent;
  }

  public log({ event, editor }: any) {
    console.log(event);
    console.log(editor.getContent());
  }
}
