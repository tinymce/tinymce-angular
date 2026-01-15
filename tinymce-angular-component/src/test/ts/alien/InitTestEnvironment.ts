import 'core-js/features/reflect';
import 'zone.js';
import 'zone.js/plugins/fake-async-test';

import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { NgModule, provideZoneChangeDetection } from '@angular/core';

@NgModule({
  providers: [ provideZoneChangeDetection() ],
})
class AppTestingModule {}

TestBed.initTestEnvironment(
  [ BrowserTestingModule, AppTestingModule ], platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);
