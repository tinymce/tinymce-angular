import { Component, OnInit } from '@angular/core';

import * as ScriptLoader from '../../../utils/ScriptLoader';
import {} from '../../../utils/Utils';
import { getTinymce } from '../../../TinyMCE';

const scriptState = ScriptLoader.create();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
