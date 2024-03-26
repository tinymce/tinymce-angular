import type { Meta, StoryObj } from '@storybook/angular';
import { EditorComponent } from 'tinymce-angular-component/src/main/ts/public_api';
import { apiKey, sampleContent } from './Settings';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventBindingComponent } from './event-binding/EventBinding.component';
import { EventForwardingComponent } from './event-forwarding/EventForwarding.component';
import { FormControlComponent } from './form-control/FormControl.component';
import { BlogComponent } from './formvalidation/FormValidation.component';
import { DisablingComponent } from './disable/Disable.component';
import { ViewQueryComponent } from './viewquery/Viewquery.component';
import { MaterialTabs } from './materialtabs/MaterialTabs.component';
import { SafePipe } from './pipes/Safe.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent, ContentProjectionComponent } from './contentprojection/ContentProjection.component';
import { BindingComponent } from './data-binding/DataBinding.component';

const meta: Meta = {
  component: EditorComponent,
  title: 'Editor',
};
export default meta;

export const IframeStory: StoryObj<EditorComponent> = {
  name: 'Iframe Editor',
  args: {
    apiKey,
    initialValue: sampleContent,
    init: {
      height: 300,
      plugins: 'help',
    },
    cloudChannel: '6-dev',
  }
};

export const InlineStory: StoryObj<EditorComponent> = {
  name: 'Inline Editor',
  render: () => ({
    template: `
      <div style="padding-top: 100px;">
        <editor apiKey="${apiKey}" inline initialValue='${sampleContent}'></editor>
      </div>
    `
  }),
};

export const EventBindingStory: StoryObj<EditorComponent> = {
  name: 'Event Binding',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ EventBindingComponent ],
    },
    template: `<event-binding/>`
  }),

};

export const EventForwardingStory: StoryObj<EditorComponent> = {
  name: 'Event Forwarding',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ EventForwardingComponent ],
    },
    template: `<event-forwarding/>`
  }),
};

export const DataBindingStory: StoryObj<EditorComponent> = {
  name: 'Data Binding',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ BindingComponent ],
    },
    template: `<binding/>`
  }),
  parameters: {
    // TODO: show notes, or remove, or show in a different way
    notes: 'Simple example of data binding with ngModel'
  }
};

export const FormControlStory: StoryObj<EditorComponent> = {
  name: 'Form Control',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ FormControlComponent ],
    },
    template: `<form-control/>`
  }),
  parameters: {
    notes: 'Simple example of subscribing to valueChanges'
  }
};

export const FormValidationStory: StoryObj<EditorComponent> = {
  name: 'Form Validation',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ BlogComponent, SafePipe ],
    },
    template: `<blog/>`
  }),
  parameters: {
    notes: 'Example of form validation and data binding with ngModel'
  }
};

export const DisablingStory: StoryObj<EditorComponent> = {
  name: 'Disabling',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ DisablingComponent ],
    },
    template: `<disabling/>`
  }),
  parameters: {
    notes: 'Example of disabling/enabling the editor component'
  }
};

export const ViewQueryStory: StoryObj<EditorComponent> = {
  name: 'View Query',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ ViewQueryComponent ],
    },
    template: `<view-query/>`
  }),
  parameters: {
    notes: 'Example of obtaining a reference to the editor with a view query'
  }
};

export const MaterialTabsStory: StoryObj<EditorComponent> = {
  name: 'Material Tabs',
  render: () => ({
    moduleMetadata: {
      imports: [ ReactiveFormsModule, FormsModule, BrowserAnimationsModule, MatTabsModule ],
      declarations: [ MaterialTabs ],
    },
    template: `<material-tabs/>`
  }),
};

export const ContentProjectionStory: StoryObj<EditorComponent> = {
  name: 'Content Projection',
  render: () => ({
    moduleMetadata: {
      declarations: [ ContentProjectionComponent, ContainerComponent ],
    },
    template: `<content-projection/>`
  }),
  parameters: {
    notes: 'Content projection workaround.'
  }
};
