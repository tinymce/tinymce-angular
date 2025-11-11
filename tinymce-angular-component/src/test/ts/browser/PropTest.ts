import '../alien/InitTestEnvironment';

import { Component, Type } from '@angular/core';
import { context, describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { eachVersionContext, fixtureHook } from '../alien/TestHooks';
import { captureLogs, throwTimeout } from '../alien/TestHelpers';
import { concatMap, distinct, firstValueFrom, mergeMap, of, toArray } from 'rxjs';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { Editor } from 'tinymce';
import { Fun } from '@ephox/katamari';
import { Waiter, Assertions } from '@ephox/agar';
import { TinyAssertions } from '@ephox/mcagar';

describe('PropTest', () => {
  const containsIDWarning = (logs: unknown[][]) =>
    logs.length > 0 &&
    logs.some((log) => {
      const [ message ] = log;
      return (
        typeof message === 'string' &&
        message.includes('TinyMCE-Angular: an element with id [') &&
        message.includes('Editors with duplicate Id will not be able to mount')
      );
    });
  const findAllComponents = <T>(fixture: ComponentFixture<unknown>, component: Type<T>): T[] =>
    fixture.debugElement.queryAll(By.directive(component)).map((v) => v.componentInstance as T);
  const waitForEditorsToLoad = (fixture: ComponentFixture<unknown>): Promise<Editor[]> =>
    firstValueFrom(
      of(
        findAllComponents(fixture, EditorComponent)
          .map((ed) => ed.editor)
          .filter((editor): editor is Editor => !!editor)
      ).pipe(
        mergeMap(Fun.identity),
        distinct((editor) => editor.id),
        concatMap((editor) => new Promise<Editor>((resolve) => editor.once('SkinLoaded', () => resolve(editor)))),
        toArray(),
        throwTimeout(20000, 'Timeout waiting for editor(s) to load')
      )
    );

  eachVersionContext([ '4', '5', '6', '7', '8' ], () => {
    context('Single editor with ID', () => {
      @Component({
        standalone: true,
        imports: [ EditorComponent ],
        template: `<editor id="my-id" />`,
      })
      class EditorWithID {}
      const createFixture = fixtureHook(EditorWithID, { imports: [ EditorWithID ] });

      it('INT-3299: setting an ID does not log a warning', async () => {
        const warnings = await captureLogs('warn', async () => {
          const fixture = createFixture();
          fixture.detectChanges();
          const [ ed ] = await waitForEditorsToLoad(fixture);
          Assertions.assertEq('Editor\'s id must match', ed.id, 'my-id');
        });

        Assertions.assertEq('Should not contain an ID warning', containsIDWarning(warnings), false);
      });
    });

    context('Multiple editors', () => {
      @Component({
        standalone: true,
        imports: [ EditorComponent ],
        template: `
          @for (props of editors; track props) {
            <editor [id]="props.id" [plugins]="props.plugins" [init]="props.init" [initialValue]="props.initialValue" />
          }
        `,
      })
      class MultipleEditors {
        public editors: Partial<Pick<EditorComponent, 'id' | 'init' | 'plugins' | 'initialValue'>>[] = [];
      }
      const createFixture = fixtureHook(MultipleEditors, { imports: [ MultipleEditors ] });

      it('INT-3299: creating more than one editor with the same ID logs a warning', async () => {
        const warnings = await captureLogs('warn', async () => {
          const fixture = createFixture();
          fixture.componentInstance.editors = [
            { id: 'my-id-0', initialValue: 'text1' },
            { id: 'my-id-0', initialValue: 'text2' },
          ];
          fixture.detectChanges();
          const [ ed1, ed2 ] = await waitForEditorsToLoad(fixture);
          Assertions.assertEq('Editor\'s id must match', 'my-id-0', ed1.id);
          TinyAssertions.assertContent(ed1, '<p>text1</p>');
          Assertions.assertEq('Editor 2 must be undefined', undefined, ed2);
        });
        Assertions.assertEq( 'Should contain an ID warning', true, containsIDWarning(warnings));
      });

      it('INT-3299: creating more than one editor with different IDs does not log a warning', async () => {
        const warnings = await captureLogs('warn', async () => {
          const fixture = createFixture();
          fixture.componentInstance.editors = Array.from({ length: 3 }, (_, i) => ({
            id: `my-id-${i}`,
            initialValue: `text${i}`,
          }));
          fixture.detectChanges();
          const [ ed1, ed2, ed3, ed4 ] = findAllComponents(fixture, EditorComponent);
          await Waiter.pTryUntil('All editors to have been initialised', () => {
            Assertions.assertEq('Editor 1\'s id must match', ed1.id, 'my-id-0');
            Assertions.assertEq('Content of editor 1', ed1.editor?.getContent(), '<p>text0</p>');
            Assertions.assertEq('Editor 2\'s id must match', ed2.id, 'my-id-1');
            Assertions.assertEq('Content of editor 2', ed2.editor?.getContent(), '<p>text1</p>');
            Assertions.assertEq('Editor 3\'s id must match', ed3.id, 'my-id-2');
            Assertions.assertEq('Content of editor 3', ed3.editor?.getContent(), '<p>text2</p>');
            Assertions.assertEq('Editor 4 should not exist', ed4?.editor, undefined);
          }, 1000, 10000);
        });
        Assertions.assertEq( 'Should not contain an ID warning', containsIDWarning(warnings), false);
      });
    });
  });
});
