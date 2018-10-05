import { storiesOf, moduleMetadata } from '@storybook/angular';
import { EditorComponent } from '../../tinymce-angular-component/src/editor/editor.component';
import { Component } from '@angular/core';

@Component({
  selector: 'testing-disabling',
  template: `
    <editor [disabled]="isDisabled" initialValue="<p>hello world</p>"></editor>
    <button (click)="toggleDisabled()">{{isDisabled ? 'enable' : 'disable'}}</button>`
})
class DisablingTestComponent {
  isDisabled = false;
  toggleDisabled = () => (this.isDisabled = !this.isDisabled);
}

storiesOf('Editor', module)
  .addDecorator(
    moduleMetadata({
      declarations: [EditorComponent]
    })
  )
  .add('with some emoji initialValue', () => ({
    component: EditorComponent,
    props: {
      initialValue: '😀 😎 👍 💯'
    }
  }))
  .add('disabling', () => ({
    component: DisablingTestComponent
  }));
