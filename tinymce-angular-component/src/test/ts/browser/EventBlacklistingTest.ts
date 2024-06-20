import '../alien/InitTestEnvironment';

import { describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { eachVersionContext, editorHook } from '../alien/TestHooks';
import { map, merge, timer, first, buffer, Observable, tap, firstValueFrom } from 'rxjs';
import { NgZone } from '@angular/core';
import { Assertions } from '@ephox/agar';
import { Fun } from '@ephox/katamari';
import { throwTimeout } from '../alien/TestHelpers';

describe('EventBlacklistingTest', () => {
  const shouldRunInAngularZone = <T>(source: Observable<T>) =>
    source.pipe(
      tap(() => Assertions.assertEq('Subscribers to events should run within NgZone', true, NgZone.isInAngularZone()))
    );

  eachVersionContext([ '4', '5', '6', '7' ], () => {
    const createFixture = editorHook(EditorComponent);

    it('Events should be bound when allowed', async () => {
      const fixture = await createFixture({
        allowedEvents: 'onKeyUp,onClick,onInit',
        ignoreEvents: 'onClick',
      });

      const pEventsCompleted = firstValueFrom(
        merge(
          fixture.editorComponent.onKeyUp.pipe(map(Fun.constant('onKeyUp')), shouldRunInAngularZone),
          fixture.editorComponent.onKeyDown.pipe(map(Fun.constant('onKeyDown')), shouldRunInAngularZone),
          fixture.editorComponent.onClick.pipe(map(Fun.constant('onClick')), shouldRunInAngularZone)
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
