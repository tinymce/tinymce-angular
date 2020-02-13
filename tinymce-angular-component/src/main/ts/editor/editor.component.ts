import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Input, NgZone, OnDestroy, PLATFORM_ID, InjectionToken, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getTinymce } from '../TinyMCE';
import { bindHandlers, isTextarea, mergePlugins, uuid, noop, isNullOrUndefined } from '../utils/Utils';
import { Events } from './Events';
import { ScriptLoader } from '../utils/ScriptLoader';

export const TINYMCE_SCRIPT_SRC = new InjectionToken<string>('TINYMCE_SCRIPT_SRC');

const EDITOR_COMPONENT_VALUE_ACCESSOR = {
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

  @Input()
  set disabled(val) {
    this._disabled = val;
    if (this._editor && this._editor.initialized) {
      this._editor.setMode(val ? 'readonly' : 'design');
    }
  }

  get disabled() {
    return this._disabled;
  }

  get editor() {
    return this._editor;
  }

  public ngZone: NgZone;

  @Input() public cloudChannel = '5';
  @Input() public apiKey = 'no-api-key';
  @Input() public init: Record<string, any> | undefined;
  @Input() public id = '';
  @Input() public initialValue: string | undefined;
  @Input() public outputFormat: 'html' | 'text' | undefined;
  @Input() public inline: boolean | undefined;
  @Input() public tagName: string | undefined;
  @Input() public plugins: string | undefined;
  @Input() public toolbar: string | string[] | undefined;

  private _elementRef: ElementRef;
  private _element: Element | undefined;
  private _disabled: boolean | undefined;
  private _editor: any;

  private onTouchedCallback = noop;
  private onChangeCallback = noop;

constructor(
  elementRef: ElementRef,
  ngZone: NgZone,
  @Inject(PLATFORM_ID) private platformId: Object,
  @Optional() @Inject(TINYMCE_SCRIPT_SRC) private tinymceScriptSrc?: string
  ) {
    super();
    this._elementRef = elementRef;
    this.ngZone = ngZone;
    this.initialise = this.initialise.bind(this);
  }

  public writeValue(value: string | null): void {
    if (this._editor && this._editor.initialized) {
      this._editor.setContent(isNullOrUndefined(value) ? '' : value);
    } else {
      this.initialValue = value === null ? undefined : value;
    }
  }

  public registerOnChange(fn: (_: any) => void): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    if (this._editor) {
      this._editor.setMode(isDisabled ? 'readonly' : 'design');
    } else if (isDisabled) {
      this.init = { ...this.init, readonly: true };
    }
  }

  public ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.id = this.id || uuid('tiny-angular');
      this.inline =
        typeof this.inline !== 'undefined' ? (typeof this.inline === 'boolean' ? this.inline : true) : this.init && this.init.inline;
      this.createElement();
      if (getTinymce() !== null) {
        this.initialise();
      } else if (this._element && this._element.ownerDocument) {
        ScriptLoader.load(
          this._element.ownerDocument,
          this.getScriptSrc(),
          this.initialise
        );
      }
    }
  }

  public ngOnDestroy() {
    if (getTinymce() !== null) {
      getTinymce().remove(this._editor);
    }
  }

  public createElement() {
    const tagName = typeof this.tagName === 'string' ? this.tagName : 'div';
    this._element = document.createElement(this.inline ? tagName : 'textarea');
    if (this._element) {
      this._element.id = this.id;
      if (isTextarea(this._element)) {
        this._element.style.visibility = 'hidden';
      }
      this._elementRef.nativeElement.appendChild(this._element);
    }
  }

  public initialise() {
    const finalInit = {
      ...this.init,
      target: this._element,
      inline: this.inline,
      readonly: this.disabled,
      plugins: mergePlugins(this.init && this.init.plugins, this.plugins),
      toolbar: this.toolbar || (this.init && this.init.toolbar),
      setup: (editor: any) => {
        this._editor = editor;
        editor.on('init', (e: Event) => {
          this.initEditor(e, editor);
        });

        if (this.init && typeof this.init.setup === 'function') {
          this.init.setup(editor);
        }
      }
    };

    if (isTextarea(this._element)) {
      this._element.style.visibility = '';
    }

    this.ngZone.runOutsideAngular(() => {
      getTinymce().init(finalInit);
    });
  }

  private getScriptSrc() {
    return isNullOrUndefined(this.tinymceScriptSrc) ?
      `https://cdn.tiny.cloud/1/${this.apiKey}/tinymce/${this.cloudChannel}/tinymce.min.js` :
      this.tinymceScriptSrc;
  }

  private initEditor(initEvent: Event, editor: any) {
    if (typeof this.initialValue === 'string') {
      this.ngZone.run(() => editor.setContent(this.initialValue));
    }
    editor.on('blur', () => this.ngZone.run(() => this.onTouchedCallback()));
    editor.on('change keyup undo redo', () => {
      this.ngZone.run(() => this.onChangeCallback(editor.getContent({ format: this.outputFormat })));
    });
    bindHandlers(this, editor, initEvent);
  }
}
