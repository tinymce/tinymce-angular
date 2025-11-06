import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  public constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: string, type: string): SafeHtml {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
