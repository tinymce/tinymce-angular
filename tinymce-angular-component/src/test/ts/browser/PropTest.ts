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
import { expect } from 'chai';
import { Fun } from '@ephox/katamari';
import { Waiter } from '@ephox/agar';

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

  eachVersionContext([ '4', '5', '6', '7' ], () => {
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
          expect(ed.id).to.equal('my-id');
        });
        expect(containsIDWarning(warnings), 'Should not contain an ID warning').to.be.false;
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
          expect(ed1.id).to.equal('my-id-0');
          expect(ed1.getContent()).to.equal('<p>text1</p>');
          expect(ed2).to.be.undefined;
        });
        expect(containsIDWarning(warnings), 'Should contain an ID warning').to.be.true;
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
            expect(ed1.id).to.equal('my-id-0');
            expect(ed1.editor?.getContent()).to.equal('<p>text0</p>');
            expect(ed2.id).to.equal('my-id-1');
            expect(ed2.editor?.getContent()).to.equal('<p>text1</p>');
            expect(ed3.id).to.equal('my-id-2');
            expect(ed3.editor?.getContent()).to.equal('<p>text2</p>');
            expect(ed4?.editor).to.be.undefined;
          }, 1000, 10000);
        });
        expect(containsIDWarning(warnings), 'Should not contain an ID warning').to.be.false;
      });
    });
  });
});
