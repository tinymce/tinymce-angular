import '../alien/InitTestEnvironment';

import { ChangeDetectionStrategy, Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Assertions } from '@ephox/agar';
import { context, describe, it } from '@ephox/bedrock-client';

import { EditorComponent } from '../../../main/ts/public_api';
import { eachVersionContext, editorHook, fixtureHook } from '../alien/TestHooks';
import { By } from '@angular/platform-browser';
import { first, firstValueFrom, switchMap } from 'rxjs';
import type { Editor } from 'tinymce';
import { fakeTypeInEditor } from '../alien/TestHelpers';

type FormControlProps = Partial<Record<'touched' | 'pristine' | 'dirty' | 'valid', boolean>>;

describe('FormControlTest', () => {
  const assertFormControl = (label: string, control: FormControlProps, expected: FormControlProps) => {
    for (const [ key, value ] of Object.entries(expected)) {
      Assertions.assertEq(`${label} - ${key}`, value, control[key as keyof FormControlProps]);
    }
  };

  eachVersionContext([ '4', '5', '6', '7', '8' ], () => {
    [ ChangeDetectionStrategy.Default, ChangeDetectionStrategy.OnPush ].forEach((changeDetection) => {
      context(`[formControl] with change detection: ${changeDetection}`, () => {
        @Component({
          standalone: true,
          imports: [ EditorComponent, ReactiveFormsModule ],
          changeDetection,
          template: `<editor [formControl]="control" />`,
        })
        class EditorWithFormControl {
          public control = new FormControl();
        }
        const createFixture = editorHook(EditorWithFormControl);

        it('FormControl interaction', async () => {
          const fixture = await createFixture();

          Assertions.assertEq('Expect editor to have no initial value', '', fixture.editor.getContent());

          fixture.componentInstance.control.setValue('<p>Some Value</p>');
          fixture.detectChanges();

          Assertions.assertEq('Expect editor to have a value', '<p>Some Value</p>', fixture.editor.getContent());

          fixture.componentInstance.control.reset();
          fixture.detectChanges();

          Assertions.assertEq('Expect editor to be empty after reset', '', fixture.editor.getContent());
        });
      });

      context(`[formGroup] with change detection: ${changeDetection}`, () => {
        @Component({
          standalone: true,
          changeDetection,
          imports: [ EditorComponent, ReactiveFormsModule ],
          template: `
            <form [formGroup]="form">
              <editor formControlName="editor" licenseKey="gpl" />
              <button #resetBtn type="reset">Reset form</button>
              <button #submitBtn [disabled]="form.invalid" type="submit">Submit form</button>
            </form>
          `,
        })
        class FormWithEditor {
          @ViewChild('resetBtn') public resetBtn!: ElementRef<HTMLButtonElement>;
          @ViewChild('submitBtn') public submitBtn!: ElementRef<HTMLButtonElement>;
          public readonly form = new FormGroup({
            editor: new FormControl('', {
              validators: Validators.compose([
                // eslint-disable-next-line @typescript-eslint/unbound-method
                Validators.required,
                Validators.minLength(10),
              ]),
            }),
          });
        }
        const createFixture = fixtureHook(FormWithEditor, { imports: [ FormWithEditor ] });

        it('interaction', async () => {
          const fixture = createFixture();
          fixture.detectChanges();
          const editorComponent: EditorComponent = fixture.debugElement.query(
            By.directive(EditorComponent)
          ).componentInstance;
          const editor = await firstValueFrom(
            editorComponent.onInit.pipe(
              first(),
              switchMap((ev) => new Promise<Editor>((resolve) => ev.editor.on('SkinLoaded', () => resolve(ev.editor))))
            )
          );
          const form = fixture.componentInstance.form;
          const initialProps: FormControlProps = { valid: false, dirty: false, pristine: true, touched: false };
          // const editorCtrl = form.get('editor')!;

          assertFormControl('Initial form', form, initialProps);
          editor.fire('blur');
          assertFormControl('Form after editor blur', form, { ...initialProps, touched: true });
          fixture.componentInstance.resetBtn.nativeElement.click();
          fixture.detectChanges();
          assertFormControl('Form after reset', form, initialProps);

          fakeTypeInEditor(fixture, 'x');
          assertFormControl('Form after typing one character', form, {
            valid: false,
            dirty: true,
            pristine: false,
            touched: false,
          });
          editor.fire('blur');
          assertFormControl('Form after editor blur', form, {
            valid: false,
            dirty: true,
            pristine: false,
            touched: true,
          });
          fakeTypeInEditor(fixture, 'x'.repeat(20));
          assertFormControl('Form after typing 10 characters', form, {
            valid: true,
            dirty: true,
            pristine: false,
            touched: true,
          });
          Assertions.assertEq('Editor value has expected value', `<p>${'x'.repeat(20)}</p>`, form.value.editor);
        });
      });
    });
  });
});
