import '../alien/InitTestEnvironment';

import { context, describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { eachVersionContext, EditorFixture, editorHook } from '../alien/TestHooks';
import { map, merge, timer, first, buffer, Observable, tap, firstValueFrom, identity } from 'rxjs';
import { NgZone, provideZoneChangeDetection } from '@angular/core';
import { Assertions } from '@ephox/agar';
import { Fun } from '@ephox/katamari';
import { throwTimeout } from '../alien/TestHelpers';

describe('EventBlacklistingTest', () => {
  const shouldRunInAngularZone = <T>(source: Observable<T>) =>
    source.pipe(
      tap(() => Assertions.assertEq('Subscribers to events should run within NgZone', true, NgZone.isInAngularZone()))
    );

  const testEventsShouldBeBoundWhenAllowed = async (fixture: EditorFixture<EditorComponent>, isZoneless: boolean) => {
    const pEventsCompleted = firstValueFrom(
      merge(
        fixture.editorComponent.onKeyUp.pipe(map(Fun.constant('onKeyUp')), isZoneless ? identity : shouldRunInAngularZone),
        fixture.editorComponent.onKeyDown.pipe(map(Fun.constant('onKeyDown')), isZoneless ? identity : shouldRunInAngularZone),
        fixture.editorComponent.onClick.pipe(map(Fun.constant('onClick')), isZoneless ? identity : shouldRunInAngularZone)
      ).pipe(throwTimeout(10000, 'Timed out waiting for some event to fire'), buffer(timer(100)), first())
    );
    fixture.editor.fire('keydown');
    fixture.editor.fire('keyclick');
    fixture.editor.fire('keyup');
    const eventsCompleted = await pEventsCompleted;
    Assertions.assertEq('Only one event should have fired', 1, eventsCompleted.length);
    Assertions.assertEq('Only keyup should fire', 'onKeyUp', eventsCompleted[0]);
  };

  eachVersionContext([ '4', '5', '6', '7', '8' ], () => {
    context('zoneless', () => {
      const createFixture = editorHook(EditorComponent);
      const isZoneless = true;

      it('Events should be bound when allowed', async () => {
        const fixture = await createFixture({
          allowedEvents: 'onKeyUp,onClick,onInit',
          ignoreEvents: 'onClick',
        });
        await testEventsShouldBeBoundWhenAllowed(fixture, isZoneless);
      });
    });

    context('with zone.js', () => {
      const createFixture = editorHook(EditorComponent, { providers: [ provideZoneChangeDetection() ] });
      const isZoneless = false;

      it('Events should be bound when allowed', async () => {
        const fixture = await createFixture({
          allowedEvents: 'onKeyUp,onClick,onInit',
          ignoreEvents: 'onClick',
        });
        await testEventsShouldBeBoundWhenAllowed(fixture, isZoneless);
      });
    });
  });
});
