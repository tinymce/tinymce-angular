import { Assertions } from '@ephox/agar';
import '../alien/InitTestEnvironment';

import { EditorComponent } from '../../../main/ts/public_api';
import { beforeEach, describe, it } from '@ephox/bedrock-client';
import { eachVersionContext, editorHook } from '../alien/TestHooks';
import { Editor } from 'tinymce';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

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

  eachVersionContext([ '7.5.0' ], () => {
    const createFixture = editorHook(EditorComponent);

    it(`Component 'disabled' property is mapped to editor 'readonly' property`, async () => {
      const { editor } = await createFixture({ disabled: true });
      assertReadonlyMode(editor);
    });

    it(`Toggling component's 'disabled' property is mapped to editor 'readonly' property`, async () => {
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

    it(`[disabled]=true [readonly]=false triggers readonly mode`, async () => {
      const { editor } = await createFixture({ disabled: true, readonly: false });
      assertReadonlyMode(editor);
    });

    it(`[disabled]=false [readonly]=true triggers readonly mode`, async () => {
      const { editor } = await createFixture({ disabled: false, readonly: true });
      assertReadonlyMode(editor);
    });
  });

  eachVersionContext([ '7' ], () => {
    const createFixture = editorHook(EditorComponent);

    it(`Component 'disabled' property is mapped to editor 'disabled' property`, async () => {
      const { editor } = await createFixture({ disabled: true });

      Assertions.assertEq('TinyMCE should have disabled option set to true', true, editor.options.get('disabled'));
      assertDesignMode(editor);
    });

    it(`Toggling component's 'disabled' property is mapped to editor 'disabled' property`, async () => {
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

  eachVersionContext([ '4', '5', '6', '7' ], () => {
    const createFixture = editorHook(EditorComponent);

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
  });

  eachVersionContext([ '7' ], () => {
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

    let fixture: ComponentFixture<TestHostComponent>;
    let testHost: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ TestHostComponent ]
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      testHost = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('INT-3328: disabled property should work with [ngModel] when TinyMCE has been loaded before editor component has been created', () => {
      const tinyEditor = testHost.editorRef.editor;
      assertDisabledOption(tinyEditor!, true);
    });
  });
});
