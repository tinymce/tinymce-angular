import '../alien/InitTestEnvironment';

import { NgZone, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Assertions, Chain } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { EditorComponent } from '../../../main/ts/editor/editor.component';

UnitTest.asynctest('NgZoneTest', (success, failure) => {
  const createComponent = <T>(componentType: Type<T>) => {
    TestBed.configureTestingModule({
      declarations: [componentType]
    }).compileComponents();
    return TestBed.createComponent<T>(componentType);
  };

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  Chain.pipeline([
    Chain.async<void, ComponentFixture<EditorComponent>>((_, next) => {
      const fixture = createComponent(EditorComponent);
      fixture.detectChanges();
      next(fixture);
    }),

    Chain.async<ComponentFixture<EditorComponent>, ComponentFixture<EditorComponent>>((fixture, next) => {
      fixture.componentInstance.onInit.subscribe(() => {
        Assertions.assertEq('Subscribers to onInit should run within NgZone', true, NgZone.isInAngularZone());
        fixture.componentInstance.editor.on('SkinLoaded', () => {
          setTimeout(() => {
            next(fixture);
          }, 0);
        });
      });
    }),

    // Lets just test one EventEmitter, if one works all should work
    Chain.async<ComponentFixture<EditorComponent>, ComponentFixture<EditorComponent>>((fixture, done) => {
      fixture.componentInstance.onKeyUp.subscribe(() => {
        Assertions.assertEq('Subscribers to onKeyUp should run within NgZone', true, NgZone.isInAngularZone());
        done(fixture);
      });
      fixture.componentInstance.editor.fire('keyup');
    }),

    cTeardown
  ], success, failure);
});