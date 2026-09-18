# Official TinyMCE Angular Component

## About

Official Angular component for [TinyMCE](https://www.npmjs.com/package/tinymce) to make it easy to integrate into your Angular applications

## Quickstart

### Cloud CDN

In your Angular project:

1. [Sign up for a Tiny Cloud account](https://www.tiny.cloud/pricing/) to receive a Tiny Cloud API key.
2. `npm install @tinymce/tinymce-angular`
3. Include the following code:

```js
import { Component } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-root',
  imports: [EditorComponent],
  template: `
  <h1>TinyMCE Angular demo</h1>
  <editor
    [init]="init"
    apiKey="your-api-key"
  />
  `
})
export class AppComponent {
  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount'
  };
}
```

4. Update the `apiKey` option in the editor element to include your Tiny Cloud API key.

For more information: [Using TinyMCE with Angular - Cloud CDN](https://www.tiny.cloud/docs/tinymce/latest/angular-cloud/)

### Self hosted via NPM package

Using TinyMCE from NPM in an Angular project requires a couple of extra steps. See the documentation for more information: [Using TinyMCE with Angular - Self hosted via NPM](https://www.tiny.cloud/docs/tinymce/latest/angular-pm/)

## Detailed documentation

* [TinyMCE Angular Technical Reference](https://www.tiny.cloud/docs/tinymce/latest/angular-ref/).
* [TinyMCE Documentation](https://www.tiny.cloud/docs/tinymce/latest/).

## Demos

For our quick demos, check out the TinyMCE Angular [Storybook](https://tinymce.github.io/tinymce-angular/).

## Version compatibility

|Angular version|`tinymce-angular` version|
|---            |---                      |
|>=16.x         |8+                       |
|14+            |7.x                      |
|13+            |6.x                      |
|9+             |4.x                      |
|<= 8           |3.x                      |
|< 5            | Not supported           |


## Zoneless Support

No additional configuration is needed — the component works with both zone-based and zoneless applications.

## Issues

Have you found an issue with `tinymce-angular` or do you have a feature request? 
Open up an [issue](https://github.com/tinymce/tinymce-angular/issues) and let us know 
or submit a [pull request](https://github.com/tinymce/tinymce-angular/pulls). 

_Note: for issues concerning TinyMCE please visit the [TinyMCE repository](https://github.com/tinymce/tinymce)._


## License

`tinymce-angular` is licensed under the MIT License. See the LICENSE.txt file for details.

Depending on use case, the TinyMCE core editor can be used under either GPL-2.0-or-later or a commercial license. See the [tinymce package](https://www.npmjs.com/package/tinymce) for details.
