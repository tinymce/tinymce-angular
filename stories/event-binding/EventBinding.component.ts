/* eslint-disable no-console */
import { Component } from '@angular/core';
import { apiKey } from '../Settings';

@Component({
  selector: 'event-binding',
  templateUrl: './EventBinding.component.html',
})
export class EventBindingComponent {
  public apiKey = apiKey;
  public fieldValue = 'some value';
  public initObject = {
    height: 500,
    setup: (editor: any) => {
      editor.on('SetContent', (_e: any) => this.tinySetContent());
      editor.on('Init', () => this.tinyInit());
    }
  };

  public tinySetContent() {
    console.log('set by tiny');
  }

  public angularSetContent() {
    console.log('set by angular');
  }

  public tinyInit() {
    console.log('init by tiny');
  }

  public angularInit() {
    console.log('init by angular');
  }

  public realAngularInit(e1: any) {
    console.log('Ready NgModel', e1);
  }
}
