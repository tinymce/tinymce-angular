import { moduleMetadata, storiesOf } from '@storybook/angular';
import { EditorComponent } from '../tinymce-angular-component/src/main/ts/editor/editor.component';
import { BindingComponent } from './binding/binding.component';
import { BlogComponent } from './blog/blog.component';
import { SafePipe } from './pipes/safe.pipe';
import { DisablingComponent } from './disable/disable.component';
import { ViewQueryComponent } from './viewquery/viewquery.component';

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
  .add(
    'Data binding',
    () => ({
      component: BindingComponent
    }),
    {
      notes: 'Simple example of data binding with ngModel'
    }
  )
  .add(
    'Form validation',
    () => ({
      component: BlogComponent
    }),
    {
      notes: 'Example of form validation and data binding with ngModel'
    }
  )
  .add(
    'Disabling',
    () => ({
      component: DisablingComponent
    }),
    {
      notes: 'Example of disabling the editor component'
    }
  )
  .add(
    'ViewQuery',
    () => ({
      component: ViewQueryComponent
    }),
    {
      notes: 'Example of obtaining a reference to the editor with a view query'
    }
  )
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
