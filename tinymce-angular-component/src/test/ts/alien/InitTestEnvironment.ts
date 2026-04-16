import 'core-js/features/reflect';

import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { NgModule, provideZonelessChangeDetection } from '@angular/core';

@NgModule({
  providers: [ provideZonelessChangeDetection() ],
})
class AppTestingModule {}

TestBed.initTestEnvironment(
  [ BrowserTestingModule, AppTestingModule ], platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);
