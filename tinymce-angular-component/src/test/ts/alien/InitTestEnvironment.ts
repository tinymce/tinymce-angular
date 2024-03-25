import 'core-js/features/reflect';
import 'zone.js-11';
// Angular 17 uses 0.14.x of Zone.js, but that version no longer exports these two modules. So this is a workaround for now.
import 'zone.js-11/dist/fake-async-test.js';
import 'zone.js-11/dist/zone';

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
