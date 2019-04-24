import { Component } from '@angular/core';

@Component({
  selector: 'binding',
  templateUrl: './binding.component.html'
})
export class BindingComponent {
  isEditingContent = false;
  content = '<p>Initial Content</p>';

  editContent() {
    this.isEditingContent = !this.isEditingContent;
  }

  log({ event, editor }: any) {
    console.log(event);
    console.log(editor.getContent());
  }
}
