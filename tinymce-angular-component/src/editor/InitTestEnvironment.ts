import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'tinymce';

import { getTinymce } from '../TinyMCE';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

const setTinymceBaseUrl = (baseUrl: string) => {
  const tinymce = getTinymce();
  const prefix = document.location.protocol + '//' + document.location.host;
  tinymce.baseURL = baseUrl.indexOf('://') === -1 ? prefix + baseUrl : baseUrl;
  tinymce.baseURI = new tinymce.util.URI(tinymce.baseURL);
};

setTinymceBaseUrl(`/project/node_modules/tinymce`);