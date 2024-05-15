/* eslint-disable @typescript-eslint/no-parameter-properties */
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  InjectionToken,
  Optional,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { getTinymce } from '../TinyMCE';
import { listenTinyMCEEvent, bindHandlers, isTextarea, mergePlugins, uuid, noop, isNullOrUndefined } from '../utils/Utils';
import { EventObj, Events } from './Events';
import { ScriptLoader } from '../utils/ScriptLoader';
import { Editor as TinyMCEEditor, TinyMCE } from 'tinymce';

type EditorOptions = Parameters<TinyMCE['init']>[0];

export const TINYMCE_SCRIPT_SRC = new InjectionToken<string>('TINYMCE_SCRIPT_SRC');

const EDITOR_COMPONENT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditorComponent),
  multi: true
};

export type Version = `${'4' | '5' | '6' | '7'}${'' | '-dev' | '-testing' | `.${number}` | `.${number}.${number}`}`;

@Component({
  selector: 'editor',
  template: '',
  styles: [ ':host { display: block; }' ],
  providers: [ EDITOR_COMPONENT_VALUE_ACCESSOR ],
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * @see {@link https://www.tiny.cloud/docs/tinymce/7/angular-ref/} for the TinyMCE Angular Technical Reference
 */
export class EditorComponent extends Events implements AfterViewInit, ControlValueAccessor, OnDestroy {

  @Input() public cloudChannel: Version = '7';
  @Input() public apiKey = 'no-api-key';
  @Input() public licenseKey?: string;
  @Input() public init?: EditorOptions;
  @Input() public id = '';
  @Input() public initialValue?: string;
  @Input() public outputFormat?: 'html' | 'text';
  @Input() public inline?: boolean;
  @Input() public tagName?: string;
  @Input() public plugins?: string;
  @Input() public toolbar?: string | string[];
  @Input() public modelEvents = 'change input undo redo';
  @Input() public allowedEvents?: string | string[];
  @Input() public ignoreEvents?: string | string[];
  @Input()
  public set disabled(val) {
    this._disabled = val;
    if (this._editor && this._editor.initialized) {
      if (typeof this._editor.mode?.set === 'function') {
        this._editor.mode.set(val ? 'readonly' : 'design');
      } else {
        this._editor.setMode(val ? 'readonly' : 'design');
      }
    }
  }

  public get disabled() {
    return this._disabled;
  }

  public get editor() {
    return this._editor;
  }

  public ngZone: NgZone;

  private _elementRef: ElementRef;
  private _element?: HTMLElement;
  private _disabled?: boolean;
  private _editor?: TinyMCEEditor;

  private onTouchedCallback = noop;
  private onChangeCallback: any;

  private destroy$ = new Subject<void>();

  public constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(TINYMCE_SCRIPT_SRC) private tinymceScriptSrc?: string
  ) {
    super();
    this._elementRef = elementRef;
    this.ngZone = ngZone;
  }

  public writeValue(value: string | null): void {
    if (this._editor && this._editor.initialized) {
      const cursor = this._editor.selection.getBookmark(3);
      this._editor.setContent(isNullOrUndefined(value) ? '' : value);
      try {
        this._editor.selection.moveToBookmark(cursor);
      } catch (e) {
        /* ignore */
      }
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

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.id = this.id || uuid('tiny-angular');
      this.inline = this.inline !== undefined ? this.inline !== false : !!(this.init?.inline);
      this.createElement();
      if (getTinymce() !== null) {
        this.initialise();
      } else if (this._element && this._element.ownerDocument) {
        // Caretaker note: the component might be destroyed before the script is loaded and its code is executed.
        // This will lead to runtime exceptions if `initialise` will be called when the component has been destroyed.
        ScriptLoader.load(this._element.ownerDocument, this.getScriptSrc())
          .pipe(takeUntil(this.destroy$))
          .subscribe(this.initialise);
      }
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();

    if (getTinymce() !== null) {
      getTinymce().remove(this._editor);
    }
  }

  public createElement() {
    const tagName = typeof this.tagName === 'string' ? this.tagName : 'div';
    this._element = document.createElement(this.inline ? tagName : 'textarea');
    if (this._element) {
      if (document.getElementById(this.id)) {
        /* eslint no-console: ["error", { allow: ["warn"] }] */
        console.warn(`TinyMCE-Angular: an element with id [${this.id}] already exists. Editors with duplicate Id will not be able to mount`);
      }
      this._element.id = this.id;
      if (isTextarea(this._element)) {
        this._element.style.visibility = 'hidden';
      }
      this._elementRef.nativeElement.appendChild(this._element);
    }
  }

  public initialise = (): void => {
    const finalInit: EditorOptions = {
      ...this.init,
      selector: undefined,
      target: this._element,
      inline: this.inline,
      readonly: this.disabled,
      license_key: this.licenseKey,
      plugins: mergePlugins((this.init && this.init.plugins) as string, this.plugins),
      toolbar: this.toolbar || (this.init && this.init.toolbar),
      setup: (editor: TinyMCEEditor) => {
        this._editor = editor;

        listenTinyMCEEvent(editor, 'init', this.destroy$).subscribe(() => {
          this.initEditor(editor);
        });

        bindHandlers(this, editor, this.destroy$);

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
  };

  private getScriptSrc() {
    return isNullOrUndefined(this.tinymceScriptSrc) ?
      `https://cdn.tiny.cloud/1/${this.apiKey}/tinymce/${this.cloudChannel}/tinymce.min.js` :
      this.tinymceScriptSrc;
  }

  private initEditor(editor: TinyMCEEditor) {
    listenTinyMCEEvent(editor, 'blur', this.destroy$).subscribe(() => {
      this.cdRef.markForCheck();
      this.ngZone.run(() => this.onTouchedCallback());
    });

    listenTinyMCEEvent(editor, this.modelEvents, this.destroy$).subscribe(() => {
      this.cdRef.markForCheck();
      this.ngZone.run(() => this.emitOnChange(editor));
    });

    if (typeof this.initialValue === 'string') {
      this.ngZone.run(() => {
        editor.setContent(this.initialValue as string);
        if (editor.getContent() !== this.initialValue) {
          this.emitOnChange(editor);
        }
        if (this.onInitNgModel !== undefined) {
          this.onInitNgModel.emit(editor as unknown as EventObj<any>);
        }
      });
    }
  }

  private emitOnChange(editor: TinyMCEEditor) {
    if (this.onChangeCallback) {
      this.onChangeCallback(editor.getContent({ format: this.outputFormat }));
    }
  }
}
