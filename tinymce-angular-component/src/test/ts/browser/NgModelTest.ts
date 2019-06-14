import '../alien/InitTestEnvironment';

import { Component, DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Assertions, Chain, Log, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { EditorComponent } from '../../../main/ts/editor/editor.component';
import { EditorModule } from '../../../main/ts/editor/editor.module';

@Component({
  template: '<editor [(ngModel)]="content"></editor>'
})
class EditorWithNgModelComponent {
  public content = '';
}

interface NgModelTestContext {
  editorComponent: EditorComponent;
  editorDebugElement: DebugElement;
  fixture: ComponentFixture<EditorWithNgModelComponent>;
  ngModel: NgModel;
}

UnitTest.asynctest('NgModelTest', (success, failure) => {
  const createComponent = <T>(componentType: Type<T>) => {
    TestBed.configureTestingModule({
      imports: [EditorModule, FormsModule],
      declarations: [componentType]
    }).compileComponents();
    return TestBed.createComponent<T>(componentType);
  };

  const fakeKeyUp = (editor: any, char: string) => {
    editor.selection.setContent(char);
    editor.fire('keyup');
  };

  const cSetupEditorWithNgModel = Chain.async<void, NgModelTestContext>((_, next) => {
    const fixture = createComponent(EditorWithNgModelComponent);
    fixture.detectChanges();
    const editorDebugElement = fixture.debugElement.query(By.directive(EditorComponent));
    const ngModel = editorDebugElement.injector.get<NgModel>(NgModel);
    const editorComponent = editorDebugElement.componentInstance;

    editorComponent.onInit.subscribe(() => {
      editorComponent.editor.on('SkinLoaded', () => {
        setTimeout(() => {
          next({ fixture, editorDebugElement, editorComponent, ngModel });
        }, 0);
      });
    });
  });

  const cTeardown = Chain.op(() => {
    TestBed.resetTestingModule();
  });

  Pipeline.async({}, [
    Log.chainsAsStep('', 'should be pristine, untouched, and valid initially', [
      cSetupEditorWithNgModel,
      Chain.op((context: NgModelTestContext) => {
        Assertions.assertEq('ngModel should be valid', true, context.ngModel.valid);
        Assertions.assertEq('ngModel should be pristine', true, context.ngModel.pristine);
        Assertions.assertEq('ngModel should not be touched', false, context.ngModel.touched);
      }),
      cTeardown
    ]),

    Log.chainsAsStep('', 'should be pristine, untouched, and valid after writeValue', [
      cSetupEditorWithNgModel,
      Chain.op((context: NgModelTestContext) => {
        context.editorComponent.writeValue('New Value');
        context.fixture.detectChanges();

        Assertions.assertEq('ngModel should be valid', true, context.ngModel.valid);
        Assertions.assertEq('ngModel should be pristine', true, context.ngModel.pristine);
        Assertions.assertEq('ngModel should not be touched', false, context.ngModel.touched);

        Assertions.assertEq(
          'Value should have been written to the editor',
          context.editorComponent.editor.getContent({ format: 'text' }),
          'New Value'
        );
      }),
      cTeardown
    ]),

    Log.chainsAsStep('', 'should be pristine, untouched, and valid initially', [
      cSetupEditorWithNgModel,
      Chain.op((context: NgModelTestContext) => {
        // Should be dirty after user input but remain untouched
        fakeKeyUp(context.editorComponent.editor, 'X');
        context.fixture.detectChanges();

        Assertions.assertEq('ngModel should not be pristine', false, context.ngModel.pristine);
        Assertions.assertEq('ngModel should not be touched', false, context.ngModel.touched);

        // If the editor loses focus, it should should remain dirty but should also turn touched
        context.editorComponent.editor.fire('blur');
        context.fixture.detectChanges();

        Assertions.assertEq('ngModel should not be pristine', false, context.ngModel.pristine);
        Assertions.assertEq('ngModel should be touched', true, context.ngModel.touched);
      }),
      cTeardown
    ]),
  ], success, failure);
});