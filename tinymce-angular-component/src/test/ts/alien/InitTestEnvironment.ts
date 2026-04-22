import 'core-js/features/reflect';

import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [],
})
class AppTestingModule {}

TestBed.initTestEnvironment(
  [ BrowserTestingModule, AppTestingModule ], platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);
