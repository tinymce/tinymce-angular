import { moduleMetadata, storiesOf } from '@storybook/angular';
import { EditorComponent } from '../tinymce-angular-component/src/editor/editor.component';
import { BindingComponent } from './binding/binding.component';
import { BlogComponent } from './blog/blog.component';
import { SafePipe } from './pipes/safe.pipe';
import { DisablingComponent } from './disable/disable.component';

storiesOf('Editor', module)
  .addDecorator(
    moduleMetadata({
      declarations: [EditorComponent, SafePipe]
    })
  )
  .add('Stand-alone', () => ({
    component: EditorComponent,
    props: {
      initialValue: '<p>Initial Content</p>'
    }
  }))
  .add('Data binding', () => ({
    component: BindingComponent
  }))
  .add('Form validation', () => ({
    component: BlogComponent
  }))
  .add('Disabling', () => ({
    component: DisablingComponent
  }))
  .add(
    'cloudChannel: 5-dev',
    () => ({
      component: EditorComponent,
      props: {
        cloudChannel: '5-dev'
      }
    }),
    {
      notes: 'Make sure to do a full refresh of this page to load Tinymce 5.'
    }
  );
