import { Assertions } from '@ephox/agar';
import '../alien/InitTestEnvironment';

import { EditorComponent } from '../../../main/ts/public_api';
import { after, before, context, describe, it } from '@ephox/bedrock-client';
import { eachVersionContext, editorHook } from '../alien/TestHooks';
import { Editor } from 'tinymce';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VersionLoader } from '@tinymce/miniature';
import { deleteTinymce } from '../alien/TestHelpers';

describe('DisabledPropertyTest', () => {
  const getMode = (editor: Editor) => {
    if (typeof editor.mode?.get === 'function') {
      return editor.mode.get();
    }
    return editor.readonly ? 'readonly' : 'design';
  };
  const assertDesignMode = (editor: Editor) => Assertions.assertEq('TinyMCE should be in design mode', 'design', getMode(editor));
  const assertReadonlyMode = (editor: Editor) => Assertions.assertEq('TinyMCE should be in readonly mode', 'readonly', getMode(editor));
  const assertDisabledOption = (editor: Editor, expected: boolean) =>
    Assertions.assertEq(`TinyMCE should have disabled option set to ${expected}`, expected, editor.options.get('disabled'));

  eachVersionContext([ '5', '6', '7.5.0' ], () => {
    const createFixture = editorHook(EditorComponent);

    it(`Component 'disabled' property is mapped to editor 'readonly' mode`, async () => {
      const { editor } = await createFixture({ disabled: true });
      assertReadonlyMode(editor);
    });

    it(`Toggling component's 'disabled' property is mapped to editor 'readonly' mode`, async () => {
      const fixture = await createFixture();
      const { editor } = fixture;

      assertDesignMode(editor);

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      assertReadonlyMode(editor);

      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      assertDesignMode(editor);
    });

    it(`Setting the 'readonly' property causing readonly mode`, async () => {
      const { editor } = await createFixture({ readonly: true });
      assertReadonlyMode(editor);
    });

    it(`Toggling component's 'readonly' property is mapped to editor 'readonly' mode`, async () => {
      const fixture = await createFixture();
      const { editor } = fixture;

      assertDesignMode(editor);

      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      assertReadonlyMode(editor);

      fixture.componentRef.setInput('readonly', false);
      fixture.detectChanges();
      assertDesignMode(editor);
    });

    it(`[disabled]=true [readonly]=false triggers readonly mode`, async () => {
      const { editor } = await createFixture({ disabled: true, readonly: false });
      assertReadonlyMode(editor);
    });

    it(`[disabled]=false [readonly]=true triggers readonly mode`, async () => {
      const { editor } = await createFixture({ disabled: false, readonly: true });
      assertReadonlyMode(editor);
    });
  });

  eachVersionContext([ '7', '8' ], () => {
    const createFixture = editorHook(EditorComponent);

    it(`Component 'disabled' property is mapped to editor 'disabled' property`, async () => {
      const { editor } = await createFixture({ disabled: true });

      Assertions.assertEq('TinyMCE should have disabled option set to true', true, editor.options.get('disabled'));
      assertDesignMode(editor);
    });

    it(`Toggling component's 'disabled' property is mapped to editor 'disabled' option`, async () => {
      const fixture = await createFixture();
      const { editor } = fixture;

      assertDesignMode(editor);
      assertDisabledOption(editor, false);

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      assertDesignMode(editor);
      assertDisabledOption(editor, true);

      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      assertDesignMode(editor);
      assertDisabledOption(editor, false);
    });
  });

  context('With version 7', () => {
    @Component({
      imports: [ FormsModule, EditorComponent ],
      template: `<editor [(ngModel)]="text" [disabled]="true" />`,
      standalone: true,
      selector: 'test-host-component'
    })
    class TestHostComponent {
      public text = '<h1>Hello World</h1>';
      @ViewChild(EditorComponent) public editorRef!: EditorComponent;
    }

    const waitForEditorInitialized = (editor: Editor) => new Promise<void>((resolve) => {
      if (editor.initialized) {
        resolve();
      }
      editor.once('init', () => resolve());
    });

    let fixture: ComponentFixture<TestHostComponent>;
    let testHost: TestHostComponent;
    let tinyEditor: Editor;

    before(async () => {
      await VersionLoader.pLoadVersion('7');

      await TestBed.configureTestingModule({
        imports: [ TestHostComponent ]
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      testHost = fixture.componentInstance;
      fixture.detectChanges();
      tinyEditor = testHost.editorRef.editor!;
    });

    after(() => {
      deleteTinymce();
    });

    it('INT-3328: disabled property should work with [ngModel] when TinyMCE has been loaded before editor component has been created', async () => {
      assertDisabledOption(tinyEditor!, true);
      /*
        I have to wait until the editor is fully initialized before using deleteTinymce() in after block.
        There's for example theme.js script that starts to load after editor instance has been created.
        If I remove tinymce from window too soon the theme.js will fail alongside with this test case.
      */
      await waitForEditorInitialized(tinyEditor!);
    });
  });
});
