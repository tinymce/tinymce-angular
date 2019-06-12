import { Component, ViewChild } from '@angular/core';
import { EditorComponent } from '../../tinymce-angular-component/src/editor/editor.component';

@Component({
  selector: 'viewquery',
  templateUrl: './viewquery.component.html'
})
export class ViewQueryComponent {
  @ViewChild(EditorComponent, { static: true }) editorComponent!: EditorComponent;
  constructor() {}

  undo() {
    this.editorComponent.editor.undoManager.undo();
  }

  redo() {
    this.editorComponent.editor.undoManager.redo();
  }
}
