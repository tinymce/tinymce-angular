import { Component, ViewChild } from '@angular/core';
import { EditorComponent } from '../../tinymce-angular-component/src/main/ts/editor/editor.component';
import { apiKey } from '../Settings';

@Component({
  selector: 'view-query',
  templateUrl: './Viewquery.component.html',
  standalone: false
})
export class ViewQueryComponent {
  @ViewChild(EditorComponent, { static: true }) public editorComponent!: EditorComponent;
  public apiKey = apiKey;

  public undo() {
    this.editorComponent.editor?.undoManager.undo();
  }

  public redo() {
    this.editorComponent.editor?.undoManager.redo();
  }
}
