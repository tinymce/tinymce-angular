import { moduleMetadata, storiesOf } from '@storybook/angular';
import { EditorComponent } from '../tinymce-angular-component/src/main/ts/editor/editor.component';
import { BindingComponent } from './data-binding/DataBinding.component';
import { BlogComponent } from './formvalidation/FormValidation.component';
import { SafePipe } from './pipes/safe.pipe';
import { DisablingComponent } from './disable/disable.component';
import { ViewQueryComponent } from './viewquery/viewquery.component';
import { MaterialTabs } from './materialtabs/MaterialTabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransclusionComponent, MenuComponent } from './transclusion/Transclusion.component';
import { EditorCountComponent } from './helpers/EditorCount.component';

import '!style-loader!css-loader!@angular/material/prebuilt-themes/indigo-pink.css';

const defaultProps = { apiKey: 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc' };

storiesOf('Editor', module)
  .addDecorator(
    moduleMetadata({
      declarations: [
        EditorComponent,
        SafePipe,
        EditorCountComponent
      ]
    })
  )
  .add('Stand-alone', () => ({
    component: EditorComponent,
    props: {
      ...defaultProps,
      initialValue: '<p>Initial Content</p>'
    }
  }))
  .add(
    'Data Binding',
    () => ({
      component: BindingComponent,
      props: defaultProps
    }),
    {
      notes: 'Simple example of data binding with ngModel'
    }
  )
  .add(
    'Form Validation',
    () => ({
      component: BlogComponent,
      props: defaultProps
    }),
    {
      notes: 'Example of form validation and data binding with ngModel'
    }
  )
  .add(
    'Disabling',
    () => ({
      component: DisablingComponent,
      props: defaultProps
    }),
    {
      notes: 'Example of disabling/enabling the editor component'
    }
  )
  .add(
    'ViewQuery',
    () => ({
      component: ViewQueryComponent,
      props: defaultProps
    }),
    {
      notes: 'Example of obtaining a reference to the editor with a view query'
    }
  )
  .add(
    'CloudChannel: 5-dev',
    () => ({
      component: EditorComponent,
      props: {
        ...defaultProps,
        cloudChannel: '5-dev'
      }
    }),
    {
      notes: 'Make sure to do a full refresh of this page to load Tinymce 5.'
    }
  )
  .add(
    'Material Tabs',
    () => ({
      component: MaterialTabs,
      props: defaultProps,
      moduleMetadata: {
        declarations: [MaterialTabs],
        imports: [BrowserAnimationsModule, MatTabsModule]
      }
    })
  )
  .add(
    'Transclusion',
    () => ({
      component: TransclusionComponent,
      props: defaultProps,
      moduleMetadata: {
        declarations: [MenuComponent]
      }
    }),
    {
      notes: 'Alternative to using ng-content for transclusion.'
    }
  );
