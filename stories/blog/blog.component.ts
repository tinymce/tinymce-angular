import { Component } from '@angular/core';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  submitted = false;
  post = { title: '', content: '' };

  onSubmit() {
    this.submitted = !this.submitted;
  }
}
