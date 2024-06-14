import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Assertions } from '@ephox/agar';
import { context, describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { Version } from '../../../main/ts/editor/editor.component';
import { editorHook, tinymceVersionHook } from '../alien/TestHooks';

describe('FormControlTest', () => {
  for (const version of [ '4', '5', '6', '7' ] as Version[]) {
    context(`With version ${version}`, () => {
      tinymceVersionHook(version);
      @Component({
        standalone: true,
        imports: [ EditorComponent, ReactiveFormsModule ],
        template: `<editor [formControl]="control" />`,
      })
      class EditorWithFormControl {
        public control = new FormControl();
      }
      const createFixture = editorHook(EditorWithFormControl, { imports: [ EditorWithFormControl ] });

      it('FormControl interaction', async () => {
        const fixture = await createFixture();

        Assertions.assertEq('Expect editor to have no initial value', '', fixture.editor.getContent());

        fixture.componentInstance.control.setValue('<p>Some Value</p>');
        fixture.detectChanges();

        Assertions.assertEq('Expect editor to have a value', '<p>Some Value</p>', fixture.editor.getContent());

        fixture.componentInstance.control.reset();
        fixture.detectChanges();

        Assertions.assertEq('Expect editor to be empty after reset', '', fixture.editor.getContent());
      });
    });
  }
});
