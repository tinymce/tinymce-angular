import { after, before, beforeEach, context } from '@ephox/bedrock-client';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { Type } from '@angular/core';
import { EditorComponent, Version } from '../../../main/ts/editor/editor.component';
import { firstValueFrom, map, switchMap, tap } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Optional, Singleton } from '@ephox/katamari';
import { VersionLoader } from '@tinymce/miniature';
import { deleteTinymce, throwTimeout } from './TestHelpers';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import type { Editor } from 'tinymce';

export const fixtureHook = <T = unknown>(component: Type<T>, moduleDef: TestModuleMetadata) => {
  before(async () => {
    await TestBed.configureTestingModule(moduleDef).compileComponents();
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
      `${'on' | 'ng' | 'register' | 'set' | 'write'}${string}` | 'createElement' | 'initialise' | 'editor'
    >
  >
) => Promise<EditorFixture<T>>;

export const editorHook = <T = unknown>(component: Type<T>, moduleDef: TestModuleMetadata = {
  imports: [ component, EditorComponent, FormsModule, ReactiveFormsModule ],
}): CreateEditorFixture<T> => {
  const createFixture = fixtureHook(component, moduleDef);
  const editorFixture = Singleton.value<EditorFixture<T>>();
  beforeEach(() => editorFixture.clear());

  return async (props = {}) => {
    if (editorFixture.isSet()) {
      return editorFixture.get().getOrDie();
    }

    const fixture = createFixture();
    const editorComponent =
      fixture.componentInstance instanceof EditorComponent
        ? fixture.componentInstance
        : Optional.from(fixture.debugElement.query(By.directive(EditorComponent)))
          .map((v): EditorComponent => v.componentInstance)
          .getOrDie('EditorComponent instance not found');

    for (const [ key, value ] of Object.entries({ ...props })) {
      (editorComponent as any)[key] = value;
    }

    fixture.detectChanges();

    return firstValueFrom(
      editorComponent.onInit.pipe(
        throwTimeout(10000, `Timed out waiting for editor to load`),
        switchMap(
          ({ editor }) =>
            new Promise<Editor>((resolve) => {
              if (editor.initialized) {
                resolve(editor);
              }
              editor.once( 'init', () => resolve(editor));
            })
        ),
        map(
          (editor): EditorFixture<T> =>
            Object.assign(fixture, {
              editorComponent,
              editor,
              ngModel: Optional.from(fixture.debugElement.query(By.directive(EditorComponent))).bind((debugEl) =>
                Optional.from(debugEl.injector.get<NgModel>(NgModel, undefined, { optional: true }))
              ),
            })
        ),
        tap(editorFixture.set)
      )
    );
  };
};

export const eachVersionContext = (versions: Version[], fn: (version: Version) => void) =>
  versions.forEach((version) =>
    context(`With version ${version}`, () => {
      tinymceVersionHook(version);
      fn(version);
    })
  );
