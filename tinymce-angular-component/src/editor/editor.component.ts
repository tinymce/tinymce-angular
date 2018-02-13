import { Component, AfterViewInit, Input, ElementRef, OnDestroy, forwardRef, NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as ScriptLoader from '../utils/ScriptLoader';
import { uuid, isTextarea, bindHandlers, mergePlugins } from '../utils/Utils';
import { getTinymce } from '../TinyMCE';
import { Events } from './Events';

const scriptState = ScriptLoader.create();

const EDITOR_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditorComponent),
  multi: true
};

@Component({
  selector: 'editor',
  template: '<ng-template></ng-template>',
  styles: [':host { display: block; }'],
  providers: [EDITOR_COMPONENT_VALUE_ACCESSOR]
})
export class EditorComponent extends Events implements AfterViewInit, ControlValueAccessor, OnDestroy {
  private elementRef: ElementRef;
  private element: Element | undefined = undefined;
  private editor: any;

  ngZone: NgZone;

  @Input() cloudChannel: string | undefined;
  @Input() apiKey: string | undefined;
  @Input() init: any;
  @Input() id = '';
  @Input() initialValue: string | undefined;
  @Input() inline: boolean | undefined;
  @Input() tagName: string | undefined;
  @Input() plugins: string | undefined;
  @Input() toolbar: string | string[] | null = null;

  private onTouchedCallback = () => {};
  private onChangeCallback = (x: any) => {};

  constructor(elementRef: ElementRef, ngZone: NgZone) {
    super();
    this.elementRef = elementRef;
    this.ngZone = ngZone;
    this.initialise = this.initialise.bind(this);
  }

  writeValue(value: any): void {
    if (this.editor && typeof value === 'string') {
      this.editor.setContent(value);
    } else if (value) {
      this.initialValue = this.initialValue || value;
    }
  }
  registerOnChange = (fn: any) => (this.onChangeCallback = fn);
  registerOnTouched = (fn: any) => (this.onTouchedCallback = fn);
  setDisabledState(isDisabled: boolean) {
    if (this.editor) {
      this.editor.setMode(isDisabled ? 'readonly' : 'design');
    } else if (isDisabled) {
      this.init = { ...this.init, readonly: true };
    }
  }

  ngAfterViewInit() {
    this.id = this.id || uuid('tiny-react');
    this.createElement();
    if (getTinymce() !== null) {
      this.initialise();
    } else if (this.element) {
      const doc = this.element.ownerDocument;
      const channel = this.cloudChannel || 'stable';
      const apiKey = this.apiKey || '';

      ScriptLoader.load(scriptState, doc, `https://cloud.tinymce.com/${channel}/tinymce.min.js?apiKey=${apiKey}`, this.initialise);
    }
  }

  ngOnDestroy() {
    getTinymce().remove(this.editor);
  }

  createElement() {
    const tagName = typeof this.tagName === 'string' ? this.tagName : 'div';
    this.element = document.createElement(this.inline ? tagName : 'textarea');
    if (this.element) {
      this.element.id = this.id;
      if (isTextarea(this.element)) {
        this.element.style.visibility = 'hidden';
      }
      this.elementRef.nativeElement.appendChild(this.element);
    }
  }

  initialise() {
    const initialValue = typeof this.initialValue === 'string' ? this.initialValue : '';
    const finalInit = {
      ...this.init,
      selector: `#${this.id}`,
      inline: this.inline,
      plugins: mergePlugins(this.init && this.init.plugins, this.plugins),
      toolbar: this.toolbar || (this.init && this.init.toolbar),
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('init', () => {
          editor.setContent(initialValue);
          this.ngZone.run(() => this.onChangeCallback(editor.getContent()));
        });
        editor.once('blur', () => this.ngZone.run(() => this.onTouchedCallback()));
        editor.on('change keyup', () => this.ngZone.run(() => this.onChangeCallback(editor.getContent())));

        bindHandlers(this, editor);

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
