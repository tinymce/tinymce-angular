import { Component, DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EditorComponent } from './editor.component';
import { EditorModule } from './editor.module';

describe('EditorComponent', () => {
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

  describe('with ngModel', () => {
    let fixture: ComponentFixture<any>;
    let editorDebugElement: DebugElement;
    let editorComponent: EditorComponent;
    let ngModel: NgModel;

    beforeEach((done) => {
      fixture = createComponent(EditorWithNgModelComponent);
      fixture.detectChanges();

      editorDebugElement = fixture.debugElement.query(By.directive(EditorComponent));
      editorComponent = editorDebugElement.componentInstance;
      ngModel = editorDebugElement.injector.get<NgModel>(NgModel);

      editorComponent.onInit.subscribe(() => {
        editorComponent.editor.on('SkinLoaded', () => {
          setTimeout(() => {
            done();
          }, 0);
        });
      });
    });

    it('should be pristine, untouched, and valid initially', () => {
      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
    });

    it('should be pristine, untouched, and valid after writeValue', () => {
      editorComponent.writeValue('New Value');
      fixture.detectChanges();

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
      expect(editorComponent.editor.getContent({ format: 'text' })).toEqual('New Value');
    });

    it('should have correct control flags after interaction', () => {
      // Should be dirty after user input but remain untouched
      fakeKeyUp(editorComponent.editor, 'X');
      fixture.detectChanges();

      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(false);

      // If the editor loses focus, it should should remain dirty but should also turn touched
      editorComponent.editor.fire('blur');
      fixture.detectChanges();

      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(true);
    });
  });
});

@Component({
  template: '<editor [(ngModel)]="content"></editor>'
})
class EditorWithNgModelComponent {
  public content = '';
}
