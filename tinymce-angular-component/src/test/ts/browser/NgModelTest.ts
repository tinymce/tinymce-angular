/* eslint-disable max-classes-per-file */
import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Assertions, Waiter, Keyboard, Keys } from '@ephox/agar';
import { describe, it, context } from '@ephox/bedrock-client';
import { SugarElement } from '@ephox/sugar';

import { Version, EditorComponent } from '../../../main/ts/editor/editor.component';
import { EditorFixture, editorHook } from '../alien/TestHooks';
import { Optional } from '@ephox/katamari';

describe('NgModelTest', () => {
  const assertNgModelState = (prop: 'valid' | 'pristine' | 'touched', expected: boolean, ngModel: NgModel) => {
    Assertions.assertEq(
      'assert ngModel ' + prop + ' state',
      expected,
      ngModel[prop]
    );
  };

  const fakeType = ({ editor: editorComponent, fixture }: EditorFixture<unknown>, str: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const editor = editorComponent.editor!;
    editor.getBody().innerHTML = '<p>' + str + '</p>';
    Keyboard.keystroke(Keys.space(), {}, SugarElement.fromDom(editor.getBody()));
    fixture.detectChanges();
  };

  const getNgModel = (fixture: ComponentFixture<unknown>): NgModel =>
    Optional.from(fixture.debugElement.query(By.directive(EditorComponent)))
      .map((debugEl) => debugEl.injector.get<NgModel>(NgModel))
      .getOrDie('NgModel not found');

  for (const version of [ '4', '5', '6', '7' ] as Version[]) {
    context(`With version ${version}`, () => {
      @Component({
        standalone: true,
        imports: [ EditorComponent, FormsModule ],
        template: `<editor [(ngModel)]="content" />`
      })
      class EditorWithNgModel {
        public content = '';
      }
      const createFixture = editorHook(EditorWithNgModel, { imports: [ EditorWithNgModel ] }, { version });

      it('should be pristine, untouched, and valid initially', async () => {
        const { fixture } = await createFixture();
        const ngModel = getNgModel(fixture);
        await Waiter.pTryUntil('Waited too long for ngModel states', () => {
          assertNgModelState('valid', true, ngModel);
          assertNgModelState('pristine', true, ngModel);
          assertNgModelState('touched', false, ngModel);
        });
      });

      it('should be pristine, untouched, and valid after writeValue', async () => {
        const { fixture, editor } = await createFixture();
        editor.writeValue('<p>X</p>');
        fixture.detectChanges();
        await Waiter.pTryUntil('Waited too long for writeValue', () => {
          Assertions.assertEq(
            'Value should have been written to the editor',
            '<p>X</p>',
            editor.editor?.getContent()
          );
        });
        const ngModel = getNgModel(fixture);
        assertNgModelState('valid', true, ngModel);
        assertNgModelState('pristine', true, ngModel);
        assertNgModelState('touched', false, ngModel);
      });

      it.skip('should have correct control flags after interaction', async () => {
        const { fixture, editor } = await createFixture();
        const ngModel = getNgModel(fixture);
        fakeType({ editor, fixture }, 'X');
        // Should be dirty after user input but remain untouched
        assertNgModelState('pristine', false, ngModel);
        assertNgModelState('touched', false, ngModel);
        editor.editor?.fire('blur');
        fixture.detectChanges();
        // If the editor loses focus, it should should remain dirty but should also turn touched
        assertNgModelState('pristine', false, ngModel);
        assertNgModelState('touched', true, ngModel);
      });

      it.skip('Test outputFormat="text"', async () => {
        const editorFixture = await createFixture({ outputFormat: 'text' });
        fakeType(editorFixture, 'X');
        Assertions.assertEq(
          'Value bound to content via ngModel should be plain text',
          'X',
          editorFixture.fixture.componentInstance.content
        );
      });

      it.skip('Test outputFormat="html"', async () => {
        const editorFixture = await createFixture({ outputFormat: 'html' });
        fakeType(editorFixture, 'X');
        Assertions.assertEq(
          'Value bound to content via ngModel should be html',
          '<p>X</p>',
          editorFixture.fixture.componentInstance.content
        );
      });
    });
  }
});

/* UnitTest.asynctest('NgModelTestOLD', (success, failure) => {
  class Base {
    public content: string | undefined;
  }

  interface TestContext {
    fixture: ComponentFixture<Base>;
    editorComponent: EditorComponent;
    ngModel: NgModel;
  }

  const cSetupEditorWithNgModel = (attributes: string[] = []) => Chain.async<void, TestContext>((_, next) => {
    @Component({
      template: `<editor [(ngModel)]="content" ${attributes.join(' ')}></editor>`
    })
    class EditorWithNgModel extends Base { }

    TestBed.configureTestingModule({
      imports: [ EditorModule, FormsModule ],
      declarations: [ EditorWithNgModel ]
    }).compileComponents();

    const fixture = TestBed.createComponent(EditorWithNgModel);
    fixture.detectChanges();

    const editorDebugElement = fixture.debugElement.query(By.directive(EditorComponent));
    const ngModel = editorDebugElement.injector.get<NgModel>(NgModel);
    const editorComponent = editorDebugElement.componentInstance;

    editorComponent.onInit.subscribe(() => {
      editorComponent.editor.on('SkinLoaded', () => {
        setTimeout(() => {
          next({ fixture, editorComponent, ngModel });
        }, 0);
      });
    });
  });

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  const cAssertNgModelState = (prop: 'valid' | 'pristine' | 'touched', expected: boolean) => Chain.op((context: TestContext) => {
    Assertions.assertEq(
      'assert ngModel ' + prop + ' state',
      expected,
      context.ngModel[prop]
    );
  });

  const cFakeType = (str: string) => Chain.op((context: TestContext) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const editor = context.editorComponent.editor!;
    editor.getBody().innerHTML = '<p>' + str + '</p>';
    Keyboard.keystroke(Keys.space(), {}, SugarElement.fromDom(editor.getBody()));
    context.fixture.detectChanges();
  });

  const sTestVersion = (version: Version) => VersionLoader.sWithVersion(version, GeneralSteps.sequence([
    Log.chainsAsStep('', 'should be pristine, untouched, and valid initially', [
      cSetupEditorWithNgModel(),
      cAssertNgModelState('valid', true),
      cAssertNgModelState('pristine', true),
      cAssertNgModelState('touched', false),
      cTeardown
    ]),

    Log.chainsAsStep('', 'should be pristine, untouched, and valid after writeValue', [
      cSetupEditorWithNgModel(),
      Chain.op((context: TestContext) => {
        context.editorComponent.writeValue('<p>X</p>');
        context.fixture.detectChanges();
      }),
      Waiter.cTryUntil('', Chain.op((context: TestContext) => {
        Assertions.assertEq(
          'Value should have been written to the editor',
          '<p>X</p>',
          context.editorComponent.editor?.getContent()
        );
      })),
      cAssertNgModelState('valid', true),
      cAssertNgModelState('pristine', true),
      cAssertNgModelState('touched', false),
      cTeardown
    ]),

    Log.chainsAsStep('', 'should have correct control flags after interaction', [
      cSetupEditorWithNgModel(),
      cFakeType('X'),
      // Should be dirty after user input but remain untouched
      cAssertNgModelState('pristine', false),
      cAssertNgModelState('touched', false),
      Chain.op((context: TestContext) => {
        context.editorComponent.editor?.fire('blur');
        context.fixture.detectChanges();
      }),
      // If the editor loses focus, it should should remain dirty but should also turn touched
      cAssertNgModelState('pristine', false),
      cAssertNgModelState('touched', true),
      cTeardown
    ]),

    Log.chainsAsStep('', 'Test outputFormat="text"', [
      cSetupEditorWithNgModel([ 'outputFormat="text"' ]),
      cFakeType('X'),
      Chain.op((context: TestContext) => {
        Assertions.assertEq(
          'Value bound to content via ngModel should be plain text',
          'X',
          context.fixture.componentInstance.content
        );
      }),
      cTeardown
    ]),

    Log.chainsAsStep('', 'Test outputFormat="html"', [
      cSetupEditorWithNgModel([ 'outputFormat="html"' ]),
      cFakeType('X'),
      Chain.op((context: TestContext) => {
        Assertions.assertEq(
          'Value bound to content via ngModel should be html',
          '<p>X</p>',
          context.fixture.componentInstance.content
        );
      }),
      cTeardown
    ]),
  ]));

  Pipeline.async({}, [
    sTestVersion('4'),
    sTestVersion('5'),
    sTestVersion('6'),
    sTestVersion('7')
  ], success, failure);
}); */
