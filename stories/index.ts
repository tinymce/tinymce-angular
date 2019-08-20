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
      initialValue: '<p>Initial Content</p>'
    }
  }))
  // Simple example of data binding with ngModel
  .add(
    'Data Binding',
    () => ({
      component: BindingComponent
    }),
  )
  // Example of form validation and data binding with ngModel
  .add(
    'Form Validation',
    () => ({
      component: BlogComponent
    }),
  )
  // Example of disabling/enabling the editor component
  .add(
    'Disabling',
    () => ({
      component: DisablingComponent
    }),
  )
  // Example of obtaining a reference to the editor with a view query'
  .add(
    'ViewQuery',
    () => ({
      component: ViewQueryComponent
    }),
  )
  // Make sure to do a full refresh of this page to load Tinymce 5.
  .add(
    'CloudChannel: 5-dev',
    () => ({
      component: EditorComponent,
      props: {
        cloudChannel: '5-dev'
      }
    }),
  )
  .add(
    'Material Tabs',
    () => ({
      component: MaterialTabs,
      moduleMetadata: {
        declarations: [MaterialTabs],
        imports: [BrowserAnimationsModule, MatTabsModule]
      }
    })
  )
  // Alternative to using ng-content for transclusion.
  .add(
    'Transclusion',
    () => ({
      component: TransclusionComponent,
      moduleMetadata: {
        declarations: [MenuComponent]
      }
    })
  );
