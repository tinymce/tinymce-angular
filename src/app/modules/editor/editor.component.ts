import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

import * as ScriptLoader from '../../../utils/ScriptLoader';
import { uuid, isTextarea } from '../../../utils/Utils';
import { getTinymce } from '../../../TinyMCE';

const scriptState = ScriptLoader.create();

@Component({
  selector: 'editor',
  template: '<ng-template></ng-template>'
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  private elementRef: ElementRef;
  private element: Element;
  // private element: any;
  private editor: any;

  @Input() cloudChannel: string;
  @Input() apiKey: string;
  @Input() init: any;
  @Input() id: string;
  @Input() initialValue: string;
  @Input() inline: boolean;
  @Input() tagName: string;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
    this.initialise = this.initialise.bind(this);
  }

  ngAfterViewInit() {
    this.id = this.id || uuid('tiny-react');
    this.createElement();
    if (getTinymce() !== null) {
      this.initialise();
    } else {
      const doc = this.element.ownerDocument;
      const channel = this.cloudChannel || 'stable';
      const apiKey = this.apiKey || '';

      ScriptLoader.load(
        scriptState, doc, `https://cloud.tinymce.com/${channel}/tinymce.min.js?apiKey=${apiKey}`, this.initialise
      );
    }
  }

  ngOnDestroy() {
    getTinymce().remove(this.editor);
  }

  createElement() {
    const tagName = typeof this.tagName === 'string' ? this.tagName : 'div';
    this.element = document.createElement(this.inline ? tagName : 'textarea');
    this.element.id = this.id;
    if (isTextarea(this.element)) {
      this.element.style.visibility = 'hidden';
    }
    this.elementRef.nativeElement.appendChild(this.element);
  }

  initialise() {
    const initialValue = typeof this.initialValue === 'string' ? this.initialValue : '';
    const finalInit = {
      ...this.init,
      selector: `#${this.id}`,
      inline: this.inline,
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('init', () => editor.setContent(initialValue));
        // bindHandlers(this.props, editor);

        editor.on('change', () => this.onChange.emit(editor.getContent()));

        if (this.init && typeof this.init.setup === 'function') {
          this.init.setup(editor);
        }
      }
    };

    if (isTextarea(this.element)) {
      this.element.style.visibility = '';
    }

    getTinymce().init(finalInit);
  }

}
