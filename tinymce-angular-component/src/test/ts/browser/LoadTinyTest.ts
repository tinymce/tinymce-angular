import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Chain, Log, Pipeline, Assertions } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Arr, Strings } from '@ephox/katamari';
import { SelectorFilter, Attr, Element, Remove } from '@ephox/sugar';

import { EditorModule, EditorComponent, TINYMCE_SCRIPT_SRC } from '../../../main/ts/public_api';
import { ScriptLoader } from '../../../main/ts/utils/ScriptLoader';

UnitTest.asynctest('LoadTinyTest', (success, failure) => {
  const cSetupEditor = (attributes: string[], providers: any[]) => Chain.async<void, void>((_, next) => {
    @Component({
      template: `<editor ${attributes.join(' ')}></editor>`
    })
    class EditorLoad { }

    TestBed.configureTestingModule({
      imports: [EditorModule, FormsModule],
      declarations: [EditorLoad],
      providers
    }).compileComponents();

    const fixture = TestBed.createComponent(EditorLoad);
    fixture.detectChanges();

    const editorDebugElement = fixture.debugElement.query(By.directive(EditorComponent));
    const editorComponent = editorDebugElement.componentInstance;

    editorComponent.onInit.subscribe(() => {
      editorComponent.editor.on('SkinLoaded', () => {
        setTimeout(() => {
          next();
        }, 0);
      });
    });
  });

  const cDeleteTinymce = Chain.op(() => {
    ScriptLoader.reinitialize();

    delete (window as any).tinymce;
    delete (window as any).tinyMCE;

    const hasTinymceUri = (attrName: string) => (elm: Element) => {
      return Attr.getOpt(elm, attrName).exists((src) => Strings.contains(src, 'tinymce'));
    };

    const elements = Arr.flatten([
      Arr.filter(SelectorFilter.all('script'), hasTinymceUri('src')),
      Arr.filter(SelectorFilter.all('link'), hasTinymceUri('href')),
    ]);

    Arr.each(elements, Remove.remove);
  });

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const cAssertTinymceVersion = (version: '4' | '5') => Chain.op(() => {
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, (window as any).tinymce.majorVersion);
  });

  Pipeline.async({}, [
    Log.chainsAsStep('Should be able to load local version of TinyMCE specified via depdendency injection', '', [
      cDeleteTinymce,

      cSetupEditor([], [ { provide: TINYMCE_SCRIPT_SRC, useValue: '/project/node_modules/tinymce-5/tinymce.min.js' } ]),
      cAssertTinymceVersion('5'),
      cTeardown,
      cDeleteTinymce,

      cSetupEditor([], [ { provide: TINYMCE_SCRIPT_SRC, useValue: '/project/node_modules/tinymce-4/tinymce.min.js' } ]),
      cAssertTinymceVersion('4'),
      cTeardown,
      cDeleteTinymce,
    ]),
    Log.chainsAsStep('Should be able to load TinyMCE from Cloud', '', [
      cSetupEditor(['apiKey="a-fake-api-key"', 'cloudChannel="5-dev"'], []),
      cAssertTinymceVersion('5'),
      Chain.op(() => {
        Assertions.assertEq(
          'TinyMCE should have been loaded from Cloud',
          'https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/5-dev',
          (window as any).tinymce.baseURI.source
        );
      }),
      cTeardown,
      cDeleteTinymce
    ]),
  ], success, failure);
});