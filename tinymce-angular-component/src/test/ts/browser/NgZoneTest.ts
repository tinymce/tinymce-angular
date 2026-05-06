import '../alien/InitTestEnvironment';

import { NgZone, provideZoneChangeDetection } from '@angular/core';
import { Assertions } from '@ephox/agar';
import { beforeEach, describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/editor/editor.component';
import { eachVersionContext } from '../alien/TestHooks';
import { first } from 'rxjs';
import { throwTimeout } from '../alien/TestHelpers';
import { TestBed } from '@angular/core/testing';

describe('NgZoneTest', () => {
  eachVersionContext([ '4', '5', '6', '7', '8' ], () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ EditorComponent ],
        providers: [ provideZoneChangeDetection() ]
      }).compileComponents();
    });

    it('Subscribers to events should run within NgZone', async () => {
      const fixture = TestBed.createComponent(EditorComponent);
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
      const fixture = TestBed.createComponent(EditorComponent);
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
});
