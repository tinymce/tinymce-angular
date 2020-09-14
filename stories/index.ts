import { moduleMetadata, storiesOf } from '@storybook/angular';
import { EditorComponent } from '../tinymce-angular-component/src/main/ts/editor/editor.component';
import { BindingComponent } from './data-binding/DataBinding.component';
import { FormControlComponent } from './form-control/FormControl.component';
import { BlogComponent } from './formvalidation/FormValidation.component';
import { SafePipe } from './pipes/Safe.pipe';
import { DisablingComponent } from './disable/Disable.component';
import { ViewQueryComponent } from './viewquery/Viewquery.component';
import { MaterialTabs } from './materialtabs/MaterialTabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent, ContentProjectionComponent } from './contentprojection/ContentProjection.component';
import { apiKey, sampleContent } from './Settings';

import '@angular/material/prebuilt-themes/indigo-pink.css';
import { EventBindingComponent } from './event-binding/EventBinding.component';
import { EventForwardingComponent } from './event-forwarding/EventForwarding.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

storiesOf('Editor', module)
  .addDecorator(
    moduleMetadata({
      declarations: [
        EditorComponent,
        SafePipe
      ]
    })
  )
  .add('Iframe editor', () => ({
    component: EditorComponent,
    props: {
      apiKey,
      initialValue: sampleContent,
      init: {
        height: 300
      }
    }
  }))
  .add('Inline editor', () => ({
    component: EditorComponent,
    template: `
      <div style="padding-top: 100px;">
        <editor apiKey="${apiKey}" inline initialValue='${sampleContent}'></editor>
      </div>
    `
  }))
  .add('Event binding', () => ({
    component: EventBindingComponent,
  }))
  .add('Event forwarding', () => ({
    component: EventForwardingComponent,
  }))
  .add(
    'Data Binding',
    () => ({
      component: BindingComponent
    }),
    {
      notes: 'Simple example of data binding with ngModel'
    }
  )
  .add(
    'Form Control',
    () => ({
      component: FormControlComponent,
      moduleMetadata: {
        imports: [ReactiveFormsModule, FormsModule]
      }
    }),
    {
      notes: 'Simple example of subscribing to valueChanges'
    }
  )
  .add(
    'Form Validation',
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
      notes: 'Example of disabling/enabling the editor component'
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
    'Material Tabs',
    () => ({
      component: MaterialTabs,
      moduleMetadata: {
        declarations: [MaterialTabs],
        imports: [BrowserAnimationsModule, MatTabsModule]
      }
    })
  )
  .add(
    'Content Projection',
    () => ({
      component: ContentProjectionComponent,
      moduleMetadata: {
        declarations: [ContainerComponent]
      }
    }),
    {
      notes: 'Content projection workaround.'
    }
  )
  .add(
    'CloudChannel: 5-dev',
    () => ({
      component: EditorComponent,
      props: {
        apiKey,
        cloudChannel: '5-dev'
      }
    }),
    {
      notes: 'Editor with cloudChannel set to 5-dev, please make sure to reload page to load TinyMCE 5.'
    }
  );
