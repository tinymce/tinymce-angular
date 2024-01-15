import { NgModule } from '@angular/core';

import { EditorComponent } from './editor.component';
import { EditorDirective } from "./editor.directive";

@NgModule({
  imports: [ EditorDirective, EditorComponent ],
  exports: [ EditorDirective, EditorComponent ]
})
export class EditorModule {}
