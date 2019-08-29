import { Component } from '@angular/core';
import { apiKey } from '../Settings';

// tslint:disable:no-console
@Component({
  selector: 'binding',
  templateUrl: './DataBinding.component.html'
})
export class BindingComponent {
  public isEditingContent = false;
  public content = '<p>Initial Content</p>';
  public apiKey = apiKey;

  public editContent() {
    this.isEditingContent = !this.isEditingContent;
  }

  public log({ event, editor }: any) {
    console.log(event);
    console.log(editor.getContent());
  }
}
