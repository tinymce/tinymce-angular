import '../alien/InitTestEnvironment';

import { Assertions } from '@ephox/agar';
import { describe, it, context, before } from '@ephox/bedrock-client';
import { Global } from '@ephox/katamari';

import { EditorComponent, TINYMCE_SCRIPT_SRC } from '../../../main/ts/public_api';
import { Version } from '../../../main/ts/editor/editor.component';
import { editorHook, tinymceVersionHook } from '../alien/TestHooks';
import type { Editor } from 'tinymce';
import { deleteTinymce } from '../alien/TestHelpers';

describe('LoadTinyTest', () => {
  const assertTinymceVersion = (version: Version, editor: Editor) => {
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, editor.editorManager.majorVersion);
    Assertions.assertEq(`Loaded version of TinyMCE should be ${version}`, version, Global.tinymce.majorVersion);
  };

  for (const version of [ '4', '5', '6', '7', '8' ] as Version[]) {
    context(`With local version ${version}`, () => {
      const createFixture = editorHook(EditorComponent, {
        providers: [
          {
            provide: TINYMCE_SCRIPT_SRC,
            useValue: `/project/node_modules/tinymce-${version}/tinymce.min.js`,
          },
        ],
      });

      before(deleteTinymce);

      it('Should be able to load local version of TinyMCE specified via dependency injection', async () => {
        const { editor } = await createFixture();
        assertTinymceVersion(version, editor);
      });
    });

    context(`With version ${version} loaded from miniature`, () => {
      const createFixture = editorHook(EditorComponent);
      tinymceVersionHook(version);

      it('Should be able to load with miniature', async () => {
        const { editor } = await createFixture();
        assertTinymceVersion(version, editor);
      });
    });
  }

  for (const version of [ '5', '6', '7', '8' ] as Version[]) {
    context(`With cloud version ${version}`, () => {
      const createFixture = editorHook(EditorComponent);

      before(deleteTinymce);

      it(`Should be able to load TinyMCE ${version} from Cloud`, async () => {
        const apiKey = 'fake-api-key';
        const { editor } = await createFixture({ cloudChannel: version, apiKey });
        assertTinymceVersion(version, editor);
        Assertions.assertEq(
          'TinyMCE should have been loaded from Cloud',
          `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${version}`,
          Global.tinymce.baseURI.source
        );
      });
    });
  }
});
