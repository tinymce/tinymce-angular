import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { apiKey } from '../Settings';

@Component({
  selector: 'material-tabs',
  templateUrl: './MaterialTabs.component.html'
})
export class MaterialTabs implements AfterViewInit {
  @ViewChild('tabGroup', { static: false }) public tabGroup: any;
  public apiKey = apiKey;
  public activeTabIndex: number | undefined = undefined;
  public firstEditorValue = '';
  public secondEditorValue = '';

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
  }

  public ngAfterViewInit() {
    this.activeTabIndex = this.tabGroup.selectedIndex;
  }
}
