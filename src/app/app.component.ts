import { Component } from '@angular/core';

export class BlogPost {
  title = '';
  content = '';
  constructor(
    title: string,
    content: string,
    date: Date
  ) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isDisabled = false;
  submitted = false;
  model = new BlogPost('', '', new Date());

  log({event, editor}: any) {
    console.log(event);
    console.log(editor.getContent());
  }

  onSubmit() { this.submitted = true; }
}
