import { Output, EventEmitter, Directive } from '@angular/core';
import type { Editor as TinyMCEEditor } from 'tinymce';

export interface EventObj<T> {
  event: T;
  editor: TinyMCEEditor;
}

@Directive()
export class Events {
  @Output() public onBeforePaste: EventEmitter<EventObj<ClipboardEvent>> = new EventEmitter();
  @Output() public onBlur: EventEmitter<EventObj<FocusEvent>> = new EventEmitter();
  @Output() public onClick: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onCompositionEnd: EventEmitter<EventObj<CompositionEvent>> = new EventEmitter();
  @Output() public onCompositionStart: EventEmitter<EventObj<CompositionEvent>> = new EventEmitter();
  @Output() public onCompositionUpdate: EventEmitter<EventObj<CompositionEvent>> = new EventEmitter();
  @Output() public onContextMenu: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onCopy: EventEmitter<EventObj<ClipboardEvent>> = new EventEmitter();
  @Output() public onCut: EventEmitter<EventObj<ClipboardEvent>> = new EventEmitter();
  @Output() public onDblclick: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onDrag: EventEmitter<EventObj<DragEvent>> = new EventEmitter();
  @Output() public onDragDrop: EventEmitter<EventObj<DragEvent>> = new EventEmitter();
  @Output() public onDragEnd: EventEmitter<EventObj<DragEvent>> = new EventEmitter();
  @Output() public onDragGesture: EventEmitter<EventObj<DragEvent>> = new EventEmitter();
  @Output() public onDragOver: EventEmitter<EventObj<DragEvent>> = new EventEmitter();
  @Output() public onDrop: EventEmitter<EventObj<DragEvent>> = new EventEmitter();
  @Output() public onFocus: EventEmitter<EventObj<FocusEvent>> = new EventEmitter();
  @Output() public onFocusIn: EventEmitter<EventObj<FocusEvent>> = new EventEmitter();
  @Output() public onFocusOut: EventEmitter<EventObj<FocusEvent>> = new EventEmitter();
  @Output() public onKeyDown: EventEmitter<EventObj<KeyboardEvent>> = new EventEmitter();
  @Output() public onKeyPress: EventEmitter<EventObj<KeyboardEvent>> = new EventEmitter();
  @Output() public onKeyUp: EventEmitter<EventObj<KeyboardEvent>> = new EventEmitter();
  @Output() public onMouseDown: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onMouseEnter: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onMouseLeave: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onMouseMove: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onMouseOut: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onMouseOver: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onMouseUp: EventEmitter<EventObj<MouseEvent>> = new EventEmitter();
  @Output() public onPaste: EventEmitter<EventObj<ClipboardEvent>> = new EventEmitter();
  @Output() public onSelectionChange: EventEmitter<EventObj<Event>> = new EventEmitter();
  @Output() public onActivate: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onAddUndo: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onBeforeAddUndo: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onBeforeExecCommand: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onBeforeGetContent: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onBeforeRenderUI: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onBeforeSetContent: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onChange: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onClearUndos: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onDeactivate: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onDirty: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onExecCommand: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onGetContent: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onHide: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onInit: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onInput: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onInitNgModel: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onLoadContent: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onNodeChange: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onPostProcess: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onPostRender: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onPreInit: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onPreProcess: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onProgressState: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onRedo: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onRemove: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onReset: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onResizeEditor: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onSaveContent: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onSetAttrib: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onObjectResizeStart: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onObjectResized: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onObjectSelected: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onSetContent: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onShow: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onSubmit: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onUndo: EventEmitter<EventObj<any>> = new EventEmitter();
  @Output() public onVisualAid: EventEmitter<EventObj<any>> = new EventEmitter();
}

export const validEvents: (keyof Events)[] = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onInput',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onResizeEditor',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid'
];
