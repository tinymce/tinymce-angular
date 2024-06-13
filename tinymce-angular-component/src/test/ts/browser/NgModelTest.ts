/* eslint-disable max-classes-per-file */
import '../alien/InitTestEnvironment';

import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Assertions, Waiter, Keyboard, Keys } from '@ephox/agar';
import { describe, it, context } from '@ephox/bedrock-client';
import { SugarElement } from '@ephox/sugar';

import { Version, EditorComponent } from '../../../main/ts/editor/editor.component';
import { EditorFixture, editorHook } from '../alien/TestHooks';

describe('NgModelTest', () => {
  const assertNgModelState = (prop: 'valid' | 'pristine' | 'touched', expected: boolean, ngModel: NgModel) => {
    Assertions.assertEq(
      'assert ngModel ' + prop + ' state',
      expected,
      ngModel[prop]
    );
  };

  const fakeType = (fixture: EditorFixture<unknown>, str: string) => {
    fixture.editor.getBody().innerHTML = '<p>' + str + '</p>';
    Keyboard.keystroke(Keys.space(), {}, SugarElement.fromDom(fixture.editor.getBody()));
    fixture.detectChanges();
  };

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
        const fixture = await createFixture();
        const ngModel = fixture.ngModel.getOrDie('NgModel not found');
        await Waiter.pTryUntil('Waited too long for ngModel states', () => {
          assertNgModelState('valid', true, ngModel);
          assertNgModelState('pristine', true, ngModel);
          assertNgModelState('touched', false, ngModel);
        });
      });

      it('should be pristine, untouched, and valid after writeValue', async () => {
        const fixture = await createFixture();
        fixture.editorComponent.writeValue('<p>X</p>');
        fixture.detectChanges();
        await Waiter.pTryUntil('Waited too long for writeValue', () => {
          Assertions.assertEq(
            'Value should have been written to the editor',
            '<p>X</p>',
            fixture.editor.getContent()
          );
        });
        const ngModel = fixture.ngModel.getOrDie('NgModel not found');
        assertNgModelState('valid', true, ngModel);
        assertNgModelState('pristine', true, ngModel);
        assertNgModelState('touched', false, ngModel);
      });

      it('should have correct control flags after interaction', async () => {
        const fixture = await createFixture();
        const ngModel = fixture.ngModel.getOrDie('NgModel not found');
        fakeType(fixture, 'X');
        // Should be dirty after user input but remain untouched
        assertNgModelState('pristine', false, ngModel);
        assertNgModelState('touched', false, ngModel);
        fixture.editor.fire('blur');
        fixture.detectChanges();
        // If the editor loses focus, it should should remain dirty but should also turn touched
        assertNgModelState('pristine', false, ngModel);
        assertNgModelState('touched', true, ngModel);
      });

      it('Test outputFormat="text"', async () => {
        const fixture = await createFixture({ outputFormat: 'text' });
        fakeType(fixture, 'X');
        Assertions.assertEq(
          'Value bound to content via ngModel should be plain text',
          'X',
          fixture.componentInstance.content
        );
      });

      it('Test outputFormat="html"', async () => {
        const fixture = await createFixture({ outputFormat: 'html' });
        fakeType(fixture, 'X');
        Assertions.assertEq(
          'Value bound to content via ngModel should be html',
          '<p>X</p>',
          fixture.componentInstance.content
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
