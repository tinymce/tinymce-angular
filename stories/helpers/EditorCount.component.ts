import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'editor-count',
  template: `
    <p>Total number of editors: {{editorCount}}</p>
  `
})
export class EditorCountComponent {
  public editorCount = 0;
  private intervalId: number;

  constructor(private cdRef: ChangeDetectorRef) {
    this.intervalId = window.setInterval(this.poll.bind(this), 100);
  }

  public ngOnDestroy() {
    window.clearInterval(this.intervalId);
  }

  private poll () {
    const tinymce = (window as any).tinymce;
    if (tinymce) {
      const newEditorCount = tinymce.editors.length;

      if (this.editorCount !== newEditorCount) {
        this.editorCount = newEditorCount;
        this.cdRef.detectChanges();
      }
    }
  }

}
