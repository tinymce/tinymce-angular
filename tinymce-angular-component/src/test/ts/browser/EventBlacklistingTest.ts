import '../alien/InitTestEnvironment';

import { after, describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { eachVersionContext, editorHook } from '../alien/TestHooks';
import { map, merge, timer, first, buffer, firstValueFrom } from 'rxjs';
import { Assertions } from '@ephox/agar';
import { Fun } from '@ephox/katamari';
import { deleteTinymce, supportedTinymceVersions, throwTimeout } from '../alien/TestHelpers';

describe('EventBlacklistingTest', () => {
  eachVersionContext(supportedTinymceVersions(), () => {
    after(() => {
      deleteTinymce();
    });

    const createFixture = editorHook(EditorComponent);

    it('Events should be bound when allowed', async () => {
      const fixture = await createFixture({
        allowedEvents: 'onKeyUp,onClick,onInit',
        ignoreEvents: 'onClick',
      });

      const pEventsCompleted = firstValueFrom(
        merge(
          fixture.editorComponent.onKeyUp.pipe(map(Fun.constant('onKeyUp'))),
          fixture.editorComponent.onKeyDown.pipe(map(Fun.constant('onKeyDown'))),
          fixture.editorComponent.onClick.pipe(map(Fun.constant('onClick')))
        ).pipe(throwTimeout(10000, 'Timed out waiting for some event to fire'), buffer(timer(100)), first())
      );
      fixture.editor.fire('keydown');
      fixture.editor.fire('keyclick');
      fixture.editor.fire('keyup');
      const eventsCompleted = await pEventsCompleted;
      Assertions.assertEq('Only one event should have fired', 1, eventsCompleted.length);
      Assertions.assertEq('Only keyup should fire', 'onKeyUp', eventsCompleted[0]);
    });
  });
});
