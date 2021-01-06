/* eslint-disable max-classes-per-file */
import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Assertions, Chain, Log, Pipeline, Waiter, GeneralSteps, Keyboard, Keys } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { VersionLoader } from '@tinymce/miniature';
import { Element } from '@ephox/sugar';

import { EditorModule, EditorComponent } from '../../../main/ts/public_api';

UnitTest.asynctest('NgModelTest', (success, failure) => {
  // tslint:disable:max-classes-per-file

  class Base {
    public content: string | undefined;
  }

  interface TestContext {
    fixture: ComponentFixture<Base>;
    editorComponent: EditorComponent;
    ngModel: NgModel;
  }

  const cSetupEditorWithNgModel = (attributes: string[] = []) => Chain.async<void, TestContext>((_, next) => {
    @Component({
      template: `<editor [(ngModel)]="content" ${attributes.join(' ')}></editor>`
    })
    class EditorWithNgModel extends Base { }

    TestBed.configureTestingModule({
      imports: [ EditorModule, FormsModule ],
      declarations: [ EditorWithNgModel ]
    }).compileComponents();

    const fixture = TestBed.createComponent(EditorWithNgModel);
    fixture.detectChanges();

    const editorDebugElement = fixture.debugElement.query(By.directive(EditorComponent));
    const ngModel = editorDebugElement.injector.get<NgModel>(NgModel);
    const editorComponent = editorDebugElement.componentInstance;

    editorComponent.onInit.subscribe(() => {
      editorComponent.editor.on('SkinLoaded', () => {
        setTimeout(() => {
          next({ fixture, editorComponent, ngModel });
        }, 0);
      });
    });
  });

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const cAssertNgModelState = (prop: 'valid' | 'pristine' | 'touched', expected: boolean) => Chain.op((context: TestContext) => {
    Assertions.assertEq(
      'assert ngModel ' + prop + ' state',
      expected,
      context.ngModel[prop]
    );
  });

  const cFakeType = (str: string) => Chain.op((context: TestContext) => {
    const editor = context.editorComponent.editor;
    editor.getBody().innerHTML = '<p>' + str + '</p>';
    Keyboard.keystroke(Keys.space(), {}, Element.fromDom(editor.getBody()));
    context.fixture.detectChanges();
  });

  const sTestVersion = (version: '4' | '5') => VersionLoader.sWithVersion(version, GeneralSteps.sequence([
    Log.chainsAsStep('', 'should be pristine, untouched, and valid initially', [
      cSetupEditorWithNgModel(),
      cAssertNgModelState('valid', true),
      cAssertNgModelState('pristine', true),
      cAssertNgModelState('touched', false),
      cTeardown
    ]),

    Log.chainsAsStep('', 'should be pristine, untouched, and valid after writeValue', [
      cSetupEditorWithNgModel(),
      Chain.op((context: TestContext) => {
        context.editorComponent.writeValue('<p>X</p>');
        context.fixture.detectChanges();
      }),
      Waiter.cTryUntil('', Chain.op((context: TestContext) => {
        Assertions.assertEq(
          'Value should have been written to the editor',
          '<p>X</p>',
          context.editorComponent.editor.getContent()
        );
      })),
      cAssertNgModelState('valid', true),
      cAssertNgModelState('pristine', true),
      cAssertNgModelState('touched', false),
      cTeardown
    ]),

    Log.chainsAsStep('', 'should have correct control flags after interaction', [
      cSetupEditorWithNgModel(),
      cFakeType('X'),
      // Should be dirty after user input but remain untouched
      cAssertNgModelState('pristine', false),
      cAssertNgModelState('touched', false),
      Chain.op((context: TestContext) => {
        context.editorComponent.editor.fire('blur');
        context.fixture.detectChanges();
      }),
      // If the editor loses focus, it should should remain dirty but should also turn touched
      cAssertNgModelState('pristine', false),
      cAssertNgModelState('touched', true),
      cTeardown
    ]),

    Log.chainsAsStep('', 'Test outputFormat="text"', [
      cSetupEditorWithNgModel([ 'outputFormat="text"' ]),
      cFakeType('X'),
      Chain.op((context: TestContext) => {
        Assertions.assertEq(
          'Value bound to content via ngModel should be plain text',
          'X',
          context.fixture.componentInstance.content
        );
      }),
      cTeardown
    ]),

    Log.chainsAsStep('', 'Test outputFormat="html"', [
      cSetupEditorWithNgModel([ 'outputFormat="html"' ]),
      cFakeType('X'),
      Chain.op((context: TestContext) => {
        Assertions.assertEq(
          'Value bound to content via ngModel should be html',
          '<p>X</p>',
          context.fixture.componentInstance.content
        );
      }),
      cTeardown
    ]),
  ]));

  Pipeline.async({}, [
    sTestVersion('4'),
    sTestVersion('5')
  ], success, failure);
});