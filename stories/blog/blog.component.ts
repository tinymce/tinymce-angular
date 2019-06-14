import { Component } from '@angular/core';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  public submitted = false;
  public post = { title: '', content: '' };

  public onSubmit() {
    this.submitted = !this.submitted;
  }
}
