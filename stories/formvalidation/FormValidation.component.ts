import { Component } from '@angular/core';
import { apiKey } from '../Settings';

@Component({
  selector: 'blog',
  templateUrl: './FormValidation.component.html',
  styles: [ `
    .valid {
      border: 2px solid rgb(138, 201, 138);
    }

    .invalid {
      border: 2px solid rgb(255, 108, 103);
    }

    .preview {
      border: 1px solid rgb(190, 190, 190);
    }
  ` ]
})
export class BlogComponent {
  public submitted = false;
  public post = { title: '', content: '' };
  public apiKey = apiKey;

  public onSubmit() {
    this.submitted = !this.submitted;
  }
}
