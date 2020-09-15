import { Component } from '@angular/core';
import { apiKey } from '../Settings';

@Component({
  templateUrl: './EventForwarding.component.html'
})
export class EventForwardingComponent {
  public apiKey = apiKey;
  public allowed = ['onMouseLeave', 'onMouseEnter'];
  public ignore = ['onMouseLeave'];
  public fieldValue = 'some value';
  public initObject = {
    height: 260,
  };

  public logMouseEnter() {
    console.log('Log mouse enter');
  }

  public logMouseLeave() {
    console.log('Log mouse leave')
  }
}