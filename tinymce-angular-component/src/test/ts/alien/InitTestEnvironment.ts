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
import { NgModule, provideZonelessChangeDetection } from '@angular/core';

// According to Angular docs, TestBed uses zone-based change detection by default
// when zone.js is loaded via polyfills:
// https://angular.dev/guide/zoneless#testing-and-debugging
//
// In practice, this behaviour seems to be driven by Angular's built-in test runners
// (Karma, Vitest) rather than TestBed itself. Since we use Bedrock, we appear to be
// immune to this — zone-based detection does not kick in automatically even with
// zone.js loaded. Nonetheless, we explicitly opt into zoneless change detection here
// to stay aligned with the Angular documentation and to be safe. Zone.js-specific
// tests can override this with `provideZoneChangeDetection` on a per-test basis.
@NgModule({
  providers: [ provideZonelessChangeDetection() ],
})
class AppTestingModule {}

TestBed.initTestEnvironment(
  [ BrowserTestingModule, AppTestingModule ],
  platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: true }
  }
);
