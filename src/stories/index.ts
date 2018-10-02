import { storiesOf } from '@storybook/angular';
import { EditorComponent } from '../../tinymce-angular-component/src/editor/editor.component';

storiesOf('Editor', module).add('with some emoji initialValue', () => ({
  component: EditorComponent,
  props: {
    initialValue: '😀 😎 👍 💯'
  }
}));
