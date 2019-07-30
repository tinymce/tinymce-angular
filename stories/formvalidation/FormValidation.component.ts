import { Component } from '@angular/core';

@Component({
  templateUrl: './FormValidation.component.html',
  styleUrls: ['./FormValidation.component.css']
})
export class BlogComponent {
  public submitted = false;
  public post = { title: '', content: '' };

  public onSubmit() {
    this.submitted = !this.submitted;
  }
}
