import '../alien/InitTestEnvironment';

import { Assertions } from '@ephox/agar';
import { describe, it, context, before } from '@ephox/bedrock-client';
import { Global } from '@ephox/katamari';
import { SugarElement, Attribute } from '@ephox/sugar';

import { EditorComponent, TINYMCE_SCRIPT_SRC } from '../../../main/ts/public_api';
import { Version } from '../../../main/ts/editor/editor.component';
import { editorHook } from '../alien/TestHooks';
import type { Editor } from 'tinymce';
import { deleteTinymce, supportedTinymceVersions } from '../alien/TestHelpers';

/*
  This test requires the targeted Angular version provided via custom route
*/
describe('VerifyIntegrationTest', () => {
  interface IntegrationInfo {
    version: string;
  }

  const assertTinymceVersion = (version: Version, editor: Editor) => {
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, editor.editorManager.majorVersion);
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, Global.tinymce.majorVersion);
  };

  for (const version of supportedTinymceVersions()) {
    context(`With local Tinymce version ${version}`, () => {
      const createFixture = editorHook(EditorComponent, {
        providers: [
          {
            provide: TINYMCE_SCRIPT_SRC,
            useValue: `/project/node_modules/tinymce-${version}/tinymce.min.js`,
          },
        ],
      });

      before(deleteTinymce);

      it('Should be able to load with the specified Angular version', async () => {
        const { editor } = await createFixture();
        const integrationInfo = await window.fetch('/custom/integration/info').then((resp) => resp.json()) as IntegrationInfo;
        const container = editor.getContainer();

        Assertions.assertEq(`Angular version should be ${integrationInfo.version}`,
          true,
          Attribute.get(SugarElement.fromDom(container), 'data-framework-version') === integrationInfo.version
        );

        assertTinymceVersion(version, editor);
      });
    });
  }
});
