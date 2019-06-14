import { Component } from '@angular/core';

// tslint:disable:no-console
@Component({
  selector: 'binding',
  templateUrl: './binding.component.html'
})
export class BindingComponent {
  public isEditingContent = false;
  public content = '<p>Initial Content</p>';

  public editContent() {
    this.isEditingContent = !this.isEditingContent;
  }

  public log({ event, editor }: any) {
    console.log(event);
    console.log(editor.getContent());
  }
}
