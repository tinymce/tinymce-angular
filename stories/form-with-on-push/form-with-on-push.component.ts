/* eslint-disable @typescript-eslint/unbound-method */
import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import type { EditorComponent } from '../../tinymce-angular-component/src/main/ts/public_api';
import { apiKey } from 'stories/Settings';

@Component({
  selector: 'form-with-on-push',
  templateUrl: './form-with-on-push.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormWithOnPushComponent {
  @Input() public apiKey = apiKey;
  public readonly initialValue = '';
  public readonly init: EditorComponent['init'] = {
    plugins: [ 'help' ],
  };
  public readonly form = new FormGroup({
    tiny: new FormControl('', {
      validators: Validators.compose([
        Validators.required,
        Validators.minLength(10)
      ]),
    }),
    regular: new FormControl(''),
  });
}
