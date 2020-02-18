import { Component } from '@angular/core';
import { apiKey, sampleContent } from '../Settings';

// tslint:disable:no-console
@Component({
  templateUrl: './DataBinding.component.html'
})
export class BindingComponent {
  public isEditingContent = true;
  public content = sampleContent;
  public apiKey = apiKey;

  public editContent() {
    this.isEditingContent = !this.isEditingContent;
  }

  public log({ event, editor }: any) {
    console.log(event);
    console.log(editor.getContent());
  }
}
