/* eslint-disable max-classes-per-file */
import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Assertions, Waiter } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/editor/editor.component';
import { eachVersionContext, editorHook } from '../alien/TestHooks';
import { fakeTypeInEditor } from '../alien/TestHelpers';

describe('NgModelTest', () => {
  const assertNgModelState = (prop: 'valid' | 'pristine' | 'touched', expected: boolean, ngModel: NgModel) => {
    Assertions.assertEq('assert ngModel ' + prop + ' state', expected, ngModel[prop]);
  };

  eachVersionContext([ '4', '5', '6', '7' ], () => {
    @Component({
      standalone: true,
      imports: [ EditorComponent, FormsModule ],
      template: `<editor [(ngModel)]="content" />`,
    })
    class EditorWithNgModel {
      public content = '';
    }
    const createFixture = editorHook(EditorWithNgModel);

    it('should be pristine, untouched, and valid initially', async () => {
      const fixture = await createFixture();
      const ngModel = fixture.ngModel.getOrDie('NgModel not found');
      await Waiter.pTryUntil('Waited too long for ngModel states', () => {
        assertNgModelState('valid', true, ngModel);
        assertNgModelState('pristine', true, ngModel);
        assertNgModelState('touched', false, ngModel);
      });
    });

    it('should be pristine, untouched, and valid after writeValue', async () => {
      const fixture = await createFixture();
      fixture.editorComponent.writeValue('<p>X</p>');
      fixture.detectChanges();
      await Waiter.pTryUntil('Waited too long for writeValue', () => {
        Assertions.assertEq('Value should have been written to the editor', '<p>X</p>', fixture.editor.getContent());
      });
      const ngModel = fixture.ngModel.getOrDie('NgModel not found');
      assertNgModelState('valid', true, ngModel);
      assertNgModelState('pristine', true, ngModel);
      assertNgModelState('touched', false, ngModel);
    });

    it('should have correct control flags after interaction', async () => {
      const fixture = await createFixture();
      const ngModel = fixture.ngModel.getOrDie('NgModel not found');
      fakeTypeInEditor(fixture, 'X');
      // Should be dirty after user input but remain untouched
      assertNgModelState('pristine', false, ngModel);
      assertNgModelState('touched', false, ngModel);
      fixture.editor.fire('blur');
      fixture.detectChanges();
      // If the editor loses focus, it should should remain dirty but should also turn touched
      assertNgModelState('pristine', false, ngModel);
      assertNgModelState('touched', true, ngModel);
    });

    it('Test outputFormat="text"', async () => {
      const fixture = await createFixture({ outputFormat: 'text' });
      fakeTypeInEditor(fixture, 'X');
      Assertions.assertEq(
        'Value bound to content via ngModel should be plain text',
        'X',
        fixture.componentInstance.content
      );
    });

    it('Test outputFormat="html"', async () => {
      const fixture = await createFixture({ outputFormat: 'html' });
      fakeTypeInEditor(fixture, 'X');
      Assertions.assertEq(
        'Value bound to content via ngModel should be html',
        '<p>X</p>',
        fixture.componentInstance.content
      );
    });
  });
});
