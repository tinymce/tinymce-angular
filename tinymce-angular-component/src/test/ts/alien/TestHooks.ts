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
  tap
} from 'rxjs';
import { By } from '@angular/platform-browser';
import { Optional } from '@ephox/katamari';
import { VersionLoader } from '@tinymce/miniature';
import { deleteTinymce, throwTimeout } from './TestHelpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

export interface EditorFixture<T> {
  fixture: ComponentFixture<T>;
  editor: EditorComponent;
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
  const hasLoaded$ = new BehaviorSubject<boolean>(false);

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
            (ed) =>
              new Promise((resolve) => ed.editor.once('SkinLoaded', resolve)),
          ),
          switchMap(() => fixture.whenRenderingDone()),
          tap(() => hasLoaded$.next(true)),
        ),
        hasLoaded$.pipe(filter(Boolean)),
      ).pipe(
        throwTimeout(timeout, `Timed out waiting for editor to load (${timeout}ms)`),
        map((): EditorFixture<T> => ({ fixture, editor: editorComponent })),
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
