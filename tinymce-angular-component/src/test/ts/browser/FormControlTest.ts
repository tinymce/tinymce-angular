import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Assertions } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { eachVersionContext, editorHookStandalone } from '../alien/TestHooks';

describe('FormControlTest', () => {
  eachVersionContext([ '4', '5', '6', '7' ], () => {
    @Component({
      standalone: true,
      imports: [ EditorComponent, ReactiveFormsModule ],
      template: `<editor [formControl]="control" />`,
    })
    class EditorWithFormControl {
      public control = new FormControl();
    }
    const createFixture = editorHookStandalone(EditorWithFormControl);

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
});
