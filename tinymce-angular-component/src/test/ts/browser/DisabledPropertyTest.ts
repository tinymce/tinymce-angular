import { Assertions } from '@ephox/agar';
import '../alien/InitTestEnvironment';

import { EditorComponent } from '../../../main/ts/public_api';
import { describe, it } from '@ephox/bedrock-client';
import { eachVersionContext, editorHook } from '../alien/TestHooks';
import { Editor } from 'tinymce';

describe('DisabledPropertyTest', () => {
  const assertDesignMode = (editor: Editor) => Assertions.assertEq('TinyMCE should be in design mode', 'design', editor.mode.get());
  const assertReadonlyMode = (editor: Editor) => Assertions.assertEq('TinyMCE should be in readonly mode', 'readonly', editor.mode.get());
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
  });

  eachVersionContext([ '7.6.0' ], () => {
    const createFixture = editorHook(EditorComponent);

    it(`Component 'disabled' property is mapped to editor 'disabled' property`, async () => {
      const { editor } = await createFixture({ cloudChannel: '7.6.0', disabled: true });

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
});