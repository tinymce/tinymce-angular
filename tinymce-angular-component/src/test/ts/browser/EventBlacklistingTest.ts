import '../alien/InitTestEnvironment';

import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Chain, Pipeline, Log, Waiter } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { VersionLoader } from '@tinymce/miniature';

import { EditorComponent } from '../../../main/ts/public_api';
import { TestStore } from '../alien/TestStore';

UnitTest.asynctest('EventBlacklistingTest', (success, failure) => {

  const store = TestStore();

  const cSetupEnv = () => Chain.async((_, next, die) => {
    TestBed.configureTestingModule({
      declarations: [ EditorComponent ]
    }).compileComponents().then(next, die);
  });

  const cTeardownEnv = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const cSetupEditorComponent = Chain.async<void, any>((_, next) => {
    const fixture = TestBed.createComponent(EditorComponent);
    fixture.componentInstance.allowedEvents = 'onKeyUp,onClick,onInit';
    fixture.componentInstance.ignoreEvents = 'onClick';
    fixture.detectChanges();
    fixture.componentInstance.onInit.subscribe(() => {
      fixture.componentInstance.editor?.on('SkinLoaded', () => {
        setTimeout(() => {
          next(fixture);
        }, 0);
      });
    });
  });

  const sTestVersion = (version: '4' | '5') => VersionLoader.sWithVersion(
    version,
    Log.chainsAsStep('', 'Events should be bound when allowed',
      [
        store.cClear,
        cSetupEnv(),
        cSetupEditorComponent,
        Chain.op((fixture) => {
          fixture.componentInstance.onKeyUp.subscribe(() => {
            const inZone = NgZone.isInAngularZone();
            store.adder('keyup.zone=' + inZone)();
          });
          fixture.componentInstance.onKeyDown.subscribe(store.adder('keydown'));
          fixture.componentInstance.onClick.subscribe(store.adder('click'));
        }),
        Chain.op((fixture) => {
          fixture.componentInstance.editor.fire('keydown');
          fixture.componentInstance.editor.fire('keyclick');
          fixture.componentInstance.editor.fire('keyup');
        }),
        Waiter.cTryUntil(
          'Waiting for events to fire',
          store.cAssertEq('Only keyup should fire', [ 'keyup.zone=true' ]),
          1000
        ),
        // cTest,
        cTeardownEnv
      ])
  );

  Pipeline.async({}, [
    sTestVersion('4'),
    sTestVersion('5')
  ], success, failure);
});