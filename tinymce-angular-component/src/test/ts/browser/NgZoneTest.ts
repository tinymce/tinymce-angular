import '../alien/InitTestEnvironment';

import { NgZone } from '@angular/core';
import { Assertions } from '@ephox/agar';
import { context, describe, it } from '@ephox/bedrock-client';

import { EditorComponent, Version } from '../../../main/ts/editor/editor.component';
import { fixtureHook, tinymceVersionHook } from '../alien/TestHooks';
import { first } from 'rxjs';
import { throwTimeout } from '../alien/TestHelpers';

describe('NgZoneTest', () => {
  for (const version of [ '4', '5', '6', '7' ] as Version[]) {
    context(`With version ${version}`, () => {
      const createFixture = fixtureHook(EditorComponent, { imports: [ EditorComponent ] });
      tinymceVersionHook(version);

      it('Subscribers to events should run within NgZone', async () => {
        const fixture = createFixture();
        const editor = fixture.componentInstance;
        fixture.detectChanges();
        await new Promise<void>((resolve) => {
          editor.onInit.pipe(first(), throwTimeout(10000, 'Timed out waiting for init event')).subscribe(() => {
            Assertions.assertEq('Subscribers to onInit should run within NgZone', true, NgZone.isInAngularZone());
            resolve();
          });
        });
      });

      // Lets just test one EventEmitter, if one works all should work
      it('Subscribers to onKeyUp should run within NgZone', async () => {
        const fixture = createFixture();
        const editor = fixture.componentInstance;
        fixture.detectChanges();
        await new Promise<void>((resolve) => {
          editor.onKeyUp.pipe(first(), throwTimeout(10000, 'Timed out waiting for key up event')).subscribe(() => {
            Assertions.assertEq('Subscribers to onKeyUp should run within NgZone', true, NgZone.isInAngularZone());
            resolve();
          });
          editor.editor?.fire('keyup');
        });
      });
    });
  }
});
