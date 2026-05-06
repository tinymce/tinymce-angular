import 'core-js/features/reflect';

// zone.js is imported here because our test suite needs to cover both zoneless and
// zone.js-based Angular applications. As a component library, our users may run
// either mode, so we must ensure compatibility with both. Since Angular 21, zoneless
// is the default, but zone.js remains supported. Once Angular drops zone.js support
// entirely, this import, ng-zone specific tests and the zone.js devDependency can be removed.
//
// Note: importing zone.js patches native browser APIs (addEventListener, setTimeout,
// setInterval, etc.), but Angular does not use these patches for change detection by
// default. Change detection only relies on zone.js in tests that explicitly configure
// `provideZoneChangeDetection`.
import 'zone.js';
import 'zone.js/plugins/fake-async-test';

import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

TestBed.initTestEnvironment(
  [ BrowserTestingModule ],
  platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: true }
  }
);
