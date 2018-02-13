import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EditorModule } from '../../tinymce-angular-component/src/editor/editor.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, EditorModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
