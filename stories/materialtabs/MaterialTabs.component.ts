import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  templateUrl: './MaterialTabs.component.html'
})
export class MaterialTabs implements AfterViewInit {
  @ViewChild('tabGroup', { static: false }) public tabGroup: any;
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