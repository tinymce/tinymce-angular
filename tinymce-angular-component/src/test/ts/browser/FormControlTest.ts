import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Assertions, Chain, Log, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { VersionLoader } from '@tinymce/miniature';

import { Editor } from 'tinymce';
import { EditorComponent, EditorModule } from '../../../main/ts/public_api';

UnitTest.asynctest('FormControlTest', (success, failure) => {
  @Component({
    template: `<editor [formControl]="control"></editor>`,
  })
  class EditorWithFormControl {
    public control = new FormControl();
  }

  interface TestContext {
    testComponent: EditorWithFormControl;
    fixture: ComponentFixture<EditorWithFormControl>;
    editor: Editor;
  }

  const cSetupEditorWithFormControl = Chain.async<void, TestContext>((_, next) => {
    TestBed.configureTestingModule({
      imports: [ EditorModule, ReactiveFormsModule ],
      declarations: [ EditorWithFormControl ]
    }).compileComponents();

    const fixture = TestBed.createComponent(EditorWithFormControl);
    fixture.detectChanges();

    const editorDebugElement = fixture.debugElement.query(By.directive(EditorComponent));
    const editorComponent = editorDebugElement.componentInstance;

    editorComponent.onInit.subscribe(() => {
      editorComponent.editor.on('SkinLoaded', () => {
        setTimeout(() => {
          next({
            fixture,
            testComponent: fixture.componentInstance,
            editor: editorComponent.editor
          });
        }, 0);
      });
    });
  });

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const setFormValueAndReset = Chain.op((context: TestContext) => {
    Assertions.assertEq('Expect editor to have no initial value', '', context.editor.getContent());

    context.testComponent.control.setValue('<p>Some Value</p>');
    context.fixture.detectChanges();

    Assertions.assertEq(
      'Expect editor to have a value',
      '<p>Some Value</p>',
      context.editor.getContent()
    );

    context.testComponent.control.reset();
    context.fixture.detectChanges();

    Assertions.assertEq('Expect editor to be empty after reset', '', context.editor.getContent());
  });

  /** Sets content and set cursor at the end, just like when a real user types */
  const doFakeType = (str: string) =>
    Chain.op((context: TestContext) => {
      context.testComponent.control.patchValue(`${str}`);
      context.fixture.detectChanges();

      const rng = context.editor.dom.createRng();
      const firstChild = context.editor.getBody().firstChild?.firstChild as Text;
      rng.setStart(firstChild, str.length);
      rng.setEnd(firstChild, str.length);

      context.editor.selection.setRng(rng);
      context.fixture.detectChanges();
    });

  const checkCursor = Chain.op((context: TestContext) => {
    const cursorStartPosition = context.editor.selection.getRng().startOffset;
    const cursorEndPosition = context.editor.selection.getRng().endOffset;
    const content = context.editor.getContent();
    const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, '');
    Assertions.assertEq(
      'Expect cursor start position to be at the end of the content',
      cursorStartPosition,
      strippedContent.length
    );

    Assertions.assertEq(
      'Expect cursor end position to be at the end of the content',
      cursorEndPosition,
      strippedContent.length
    );
  });

  const sTestVersion = (version: '4' | '5' | '6') =>
    VersionLoader.sWithVersion(
      version,
      Log.chainsAsStep('', 'FormControl interaction ', [
        cSetupEditorWithFormControl,
        setFormValueAndReset,
        doFakeType('test'),
        checkCursor,
        cTeardown,
      ])
    );

  Pipeline.async(
    {},
    [
      sTestVersion('4'),
      sTestVersion('5'),
      sTestVersion('6'),
    ],
    success,
    failure
  );
});
