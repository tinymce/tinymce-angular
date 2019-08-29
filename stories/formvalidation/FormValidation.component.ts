import { Component } from '@angular/core';
import { apiKey } from '../Settings';

@Component({
  templateUrl: './FormValidation.component.html',
  styleUrls: ['./FormValidation.component.css']
})
export class BlogComponent {
  public submitted = false;
  public post = { title: '', content: '' };
  public apiKey = apiKey;

  public onSubmit() {
    this.submitted = !this.submitted;
  }
}
