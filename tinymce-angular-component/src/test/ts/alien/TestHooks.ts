import { after, afterEach, before, beforeEach } from '@ephox/bedrock-client';
import {
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import { Type } from '@angular/core';
import {
  EditorComponent,
  Version,
} from '../../../main/ts/editor/editor.component';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  map,
  merge,
  switchMap,
  tap,
} from 'rxjs';
import { By } from '@angular/platform-browser';
import { Optional } from '@ephox/katamari';
import { VersionLoader } from '@tinymce/miniature';
import { deleteTinymce, throwTimeout } from './TestHelpers';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { Editor } from 'tinymce';

export type CreateFixture<T> = () => ComponentFixture<T>;

export const fixtureHook = <T = unknown>(
  component: Type<T>,
  moduleDef: TestModuleMetadata,
): CreateFixture<T> => {
  beforeEach(async () => {
    await TestBed.configureTestingModule(moduleDef).compileComponents();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  return () => TestBed.createComponent(component);
};

export const tinymceVersionHook = (version: Version) => {
  before(async () => {
    await VersionLoader.pLoadVersion(version);
  });
  after(() => {
    deleteTinymce();
  });
};

export interface EditorFixture<T> extends ComponentFixture<T> {
  editorComponent: EditorComponent;
  editor: Editor;
  ngModel: Optional<NgModel>;
}

export type CreateEditorFixture<T> = (
  props?: Partial<
  Omit<
  EditorComponent,
  | `${'on' | 'ng' | 'register' | 'set' | 'write'}${string}`
  | 'createElement'
  | 'initialise'
  >
  >,
) => Promise<EditorFixture<T>>;

interface EditorHookOptions {
  timeout?: number;
  version?: Version;
}

export const editorHook = <T = unknown>(
  component: Type<T>,
  moduleDef: TestModuleMetadata,
  { timeout = 5000, version }: EditorHookOptions = {},
): CreateEditorFixture<T> => {
  const createFixture = fixtureHook(component, moduleDef);
  const loadedEditor$ = new BehaviorSubject<Editor | null>(null);

  if (version) {
    tinymceVersionHook(version);
  }

  return async (props = {}) => {
    const fixture = createFixture();
    const editorComponent =
      fixture.componentInstance instanceof EditorComponent
        ? fixture.componentInstance
        : Optional.from(
          fixture.debugElement.query(By.directive(EditorComponent)),
        )
          .map((v): EditorComponent => v.componentInstance)
          .getOrDie('EditorComponent instance not found');

    for (const [ key, value ] of Object.entries(props)) {
      (editorComponent as any)[key] = value;
    }

    fixture.detectChanges();

    return firstValueFrom(
      merge(
        editorComponent.onInit.pipe(
          switchMap(
            ({ editor }) =>
              new Promise<Editor>((resolve) => editor.once('SkinLoaded', () => resolve(editor))),
          ),
          // switchMap(() => fixture.whenRenderingDone()),
          tap((editor) => loadedEditor$.next(editor)),
        ),
        loadedEditor$.pipe(filter(Boolean)),
      ).pipe(
        throwTimeout(
          timeout,
          `Timed out waiting for editor to load (${timeout}ms)`,
        ),
        map(
          (editor): EditorFixture<T> =>
            Object.assign(fixture, {
              editorComponent,
              editor,
              ngModel: Optional.from(fixture.debugElement.query(By.directive(EditorComponent)))
                .map((debugEl) => debugEl.injector.get<NgModel>(NgModel, undefined))
            }),
        ),
      ),
    );
  };
};

export const editorHookStandalone = (options?: EditorHookOptions) =>
  editorHook(
    EditorComponent,
    {
      imports: [ EditorComponent, FormsModule, ReactiveFormsModule ],
    },
    options,
  );
