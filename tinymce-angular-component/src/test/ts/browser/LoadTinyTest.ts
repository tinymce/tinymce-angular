import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Chain, Log, Pipeline, Assertions } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { Arr, Strings, Global } from '@ephox/katamari';
import { SelectorFilter, Attribute, SugarElement, Remove } from '@ephox/sugar';

import { EditorModule, EditorComponent, TINYMCE_SCRIPT_SRC } from '../../../main/ts/public_api';
import { ScriptLoader } from '../../../main/ts/utils/ScriptLoader';

UnitTest.asynctest('LoadTinyTest', (success, failure) => {
  const cSetupEditor = (attributes: string[], providers: any[]) => Chain.async<void, void>((_, next) => {
    @Component({
      template: `<editor ${attributes.join(' ')}></editor>`
    })
    class EditorLoad { }

    TestBed.configureTestingModule({
      imports: [ EditorModule, FormsModule ],
      declarations: [ EditorLoad ],
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

    delete Global.tinymce;
    delete Global.tinyMCE;

    const hasTinyUri = (attrName: string) => (elm: SugarElement<Element>) => Attribute.getOpt(elm, attrName).exists((src) => Strings.contains(src, 'tinymce'));

    const elements = Arr.flatten([
      Arr.filter(SelectorFilter.all('script'), hasTinyUri('src')),
      Arr.filter(SelectorFilter.all('link'), hasTinyUri('href')),
    ]);

    Arr.each(elements, Remove.remove);
  });

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const cAssertTinymceVersion = (version: '4' | '5' | '6' | '7') => Chain.op(() => {
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, Global.tinymce.majorVersion);
  });

  Pipeline.async({}, [
    Log.chainsAsStep('Should be able to load local version of TinyMCE specified via depdendency injection', '', [
      cDeleteTinymce,

      cSetupEditor([], [{ provide: TINYMCE_SCRIPT_SRC, useValue: '/project/node_modules/tinymce-6/tinymce.min.js' }]),
      cAssertTinymceVersion('6'),
      cTeardown,
      cDeleteTinymce,

      cSetupEditor([], [{ provide: TINYMCE_SCRIPT_SRC, useValue: '/project/node_modules/tinymce-5/tinymce.min.js' }]),
      cAssertTinymceVersion('5'),
      cTeardown,
      cDeleteTinymce,

      cSetupEditor([], [{ provide: TINYMCE_SCRIPT_SRC, useValue: '/project/node_modules/tinymce-4/tinymce.min.js' }]),
      cAssertTinymceVersion('4'),
      cTeardown,
      cDeleteTinymce,
    ]),
    Log.chainsAsStep('Should be able to load TinyMCE from Cloud', '', [
      cSetupEditor([ 'apiKey="a-fake-api-key"', 'cloudChannel="6-dev"' ], []),
      cAssertTinymceVersion('7'),
      Chain.op(() => {
        Assertions.assertEq(
          'TinyMCE should have been loaded from Cloud',
          'https://cdn.tiny.cloud/1/a-fake-api-key/tinymce/6-dev',
          Global.tinymce.baseURI.source
        );
      }),
      cTeardown,
      cDeleteTinymce
    ]),
  ], success, failure);
});