import '../alien/InitTestEnvironment';

import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Assertions, Chain, Pipeline, Log } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { VersionLoader } from '@tinymce/miniature';

import { EditorComponent } from '../../../main/ts/public_api';

UnitTest.asynctest('EventBlacklistingTest', (success, failure) => {

  const createEditor = (): ComponentFixture<EditorComponent> => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(EditorComponent);
    fixture.componentInstance.allowedEvents = 'onKeyUp,onClick';
    fixture.componentInstance.ignoreEvents = 'onClick';
    return fixture;
  };

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const sTestVersion = (version: '4' | '5') => VersionLoader.sWithVersion(
    version,
    Log.chainsAsStep('', 'Events should be bound when allowed', [
      Chain.async<void, ComponentFixture<EditorComponent>>((_, next) => {
        const fixture = createEditor();
        fixture.detectChanges();
        next(fixture);
      }),
      Chain.async<ComponentFixture<EditorComponent>, ComponentFixture<EditorComponent>>((fixture, done) => {
        fixture.componentInstance.onKeyUp.subscribe(() => {
          Assertions.assertEq('Subscribers to onKeyUp should run within NgZone', true, NgZone.isInAngularZone());
          done(fixture);
        });
        fixture.componentInstance.editor.fire('keyup');
      }),

      Chain.async<ComponentFixture<EditorComponent>, ComponentFixture<EditorComponent>>((fixture, done) => {
        let keyDownFlag = false;
        fixture.componentInstance.onKeyDown.subscribe(() => {keyDownFlag = true;});
        fixture.componentInstance.editor.fire('keydown');
        Assertions.assertEq('Keydown is not allowed.', false, keyDownFlag);
        done(fixture);
      }),

      Chain.async<ComponentFixture<EditorComponent>, ComponentFixture<EditorComponent>>((fixture, done) => {
        let clickFlag = false;
        fixture.componentInstance.onClick.subscribe(() => clickFlag = true);
        fixture.componentInstance.editor.fire('click');
        Assertions.assertEq('Click must be ignored.', false, clickFlag);
        done(fixture);
      }),

      cTeardown
    ])
  );

  Pipeline.async({}, [
    sTestVersion('4'),
    sTestVersion('5')
  ], success, failure);
});