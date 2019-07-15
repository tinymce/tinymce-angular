# Official TinyMCE Angular Component

## About

This package is a thin wrapper around [TinyMCE](https://github.com/tinymce/tinymce) to make it easier to use in an Angular application. If you need detailed documentation on TinyMCE itself head to the [TinyMCE Documentation](https://www.tiny.cloud/docs/).
For some quick demos, check out the [storybook](https://tinymce.github.io/tinymce-angular/).

## Installation

```sh
$ npm install @tinymce/tinymce-angular
```

## Usage

### Loading the component

Import the `EditorModule` from the npm package like this:

```tsx
import { EditorModule } from '@tinymce/tinymce-angular';
```
And add it to your application module:

```tsx
// This might look different depending on how you have set up your app
// but the important part is the imports array
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EditorModule // <- Important part
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

### Using the component in your templates

Use the editor in your templates like this:

```html
<editor apiKey="test" [init]="{plugins: 'link'}"></editor>
```

### Configuring the editor

The editor accepts the following inputs:
* `disabled`: Using this input that takes a boolean value you can dynamically set the editor into a "disabled" readonly mode or into the normal editable mode.
* `id`: An id for the editor so you can later grab the instance by using the `tinymce.get('ID')` method on tinymce, defaults to an automatically generated uuid.
* `init`: Object sent to the `tinymce.init` method used to initialize the editor.
* `initialValue`: Initial value that the editor will be initialized with.
* `inline`: Shorthand for setting that the editor should be inline, `<editor [inline]="true"></editor>` is the same as setting `{inline: true}` in the init.
* `tagName`: Only used if the editor is inline, decides what element to initialize the editor on, defaults to `div`.
* `plugins`: Shorthand for setting what plugins you want to use, `<editor plugins="foo bar"></editor>` is the same as setting `{plugins: 'foo bar'}` in the init.
* `toolbar`: Shorthand for setting what toolbar items you want to show, `<editor toolbar="foo bar"></editor>` is the same as setting `{toolbar: 'foo bar'}` in the init.
* `apiKey`: Api key for TinyMCE cloud, more info below.
* `cloudChannel`: Cloud channel for TinyMCE Cloud, more info below.
* `forceInit$`: Observable that remove and init editor.
```html
<editor [forceInit$]="forceInit$"></editor>
```
```tsx
this.forceInit$ = new Subject();
this.forceInit$.next();
```

None of the configuration inputs are **required** for the editor to work - other than if you are using TinyMCE Cloud you will have to specify the `apiKey` to get rid of the `This domain is not registered...` warning message.

### `ngModel`

You can also use the `ngModel` directive (more info in the [Angular documentation](https://angular.io/api/forms/NgModel)) on the editor to simplify using it in a form:

```html
<editor [(ngModel)]="dataModel"></editor>
```

### Using with reactive forms

The component also works with reactive forms (see [Angular documentation](https://angular.io/guide/reactive-forms))).

For example it can be used with the `formControlName` directive like this, placed inside a `formGroup`:

```html
<editor [formControlName]="schema.key" [init]="{plugins: 'link'}></editor>
```

### Event binding

You can also bind editor events via a shorthand prop on the editor, for example:
```html
<editor (onSelectionChange)="handleEvent($event)"></editor>
```
Where the handler gets called with an object containing the properties `event`, which is the event object, and `editor`, which is a reference to the editor.

Here is a full list of the events available:
<details>
<summary>All available events</summary>

* `onActivate`
* `onAddUndo`
* `onBeforeAddUndo`
* `onBeforeExecCommand`
* `onBeforeGetContent`
* `onBeforeRenderUI`
* `onBeforeSetContent`
* `onBeforePaste`
* `onBlur`
* `onChange`
* `onClearUndos`
* `onClick`
* `onContextMenu`
* `onCopy`
* `onCut`
* `onDblclick`
* `onDeactivate`
* `onDirty`
* `onDrag`
* `onDragDrop`
* `onDragEnd`
* `onDragGesture`
* `onDragOver`
* `onDrop`
* `onExecCommand`
* `onFocus`
* `onFocusIn`
* `onFocusOut`
* `onGetContent`
* `onHide`
* `onInit`
* `onKeyDown`
* `onKeyPress`
* `onKeyUp`
* `onLoadContent`
* `onMouseDown`
* `onMouseEnter`
* `onMouseLeave`
* `onMouseMove`
* `onMouseOut`
* `onMouseOver`
* `onMouseUp`
* `onNodeChange`
* `onObjectResizeStart`
* `onObjectResized`
* `onObjectSelected`
* `onPaste`
* `onPostProcess`
* `onPostRender`
* `onPreProcess`
* `onProgressState`
* `onRedo`
* `onRemove`
* `onReset`
* `onSaveContent`
* `onSelectionChange`
* `onSetAttrib`
* `onSetContent`
* `onShow`
* `onSubmit`
* `onUndo`
* `onVisualAid`
</details>

## Loading TinyMCE
### Auto-loading from TinyMCE Cloud
The `Editor` component needs TinyMCE to be globally available to work, but to make it as easy as possible it will automatically load [TinyMCE Cloud](https://www.tiny.cloud/docs/cloud-deployment-guide/) if it can't find TinyMCE available when the component has mounted. To get rid of the `This domain is not registered...` warning, sign up for the cloud and enter the api key like this:

```html
<editor apiKey="test" [init]="{/* your settings */}"></editor>
```

You can also define what cloud channel you want to use, for more info on the different versions see the [documentation](https://www.tiny.cloud/docs/cloud-deployment-guide/editor-plugin-version/#devtestingandstablereleases).

### Loading TinyMCE by yourself

To opt out of using TinyMCE cloud you have to make TinyMCE globally available yourself. This can be done either by hosting the `tinymce.min.js` file by youself and adding a script tag to you HTML or, if you are using a module loader, installing TinyMCE with npm. For info on how to get TinyMCE working with module loaders check out [this page in the documentation](https://www.tinymce.com/docs/advanced/usage-with-module-loaders/).

Following step by step guide outlines the process of loading TinyMCE and TinyMCE-Angular in your project managed by the Angular CLI.

* Install TinyMCE using NPM
  * `npm install --save tinymce`
* In your `angular.json` add tinymce to the *global scripts* tag.
  * Your script list might look like the following:
  ```json
  "scripts": [
    "node_modules/tinymce/tinymce.min.js"
  ]
  ```
* Add tinymce skins, themes and plugins to the assets property of your `angular.json`. This will allow Tiny to lazy-load everything it requires on initialization.
  ```json
  "assets": [
    { "glob": "**/*", "input": "node_modules/tinymce/skins", "output": "/tinymce/skins/" },
    { "glob": "**/*", "input": "node_modules/tinymce/themes", "output": "/tinymce/themes/" },
    { "glob": "**/*", "input": "node_modules/tinymce/plugins", "output": "/tinymce/plugins/" }
  ]
  ```
* Finally, configure the editor. If necessary, set the `base_url` and `suffix` options.
  ```html
  <editor [init]="{
    base_url: '/tinymce', // Root for resources
    suffix: '.min',       // Suffix to use when loading resources
    plugins: 'lists advlist',
    toolbar: 'undo redo | bold italic | bullist numlist outdent indent'
  }"></editor>
  ```

### Issues

Have you found an issue with tinymce-angular or do you have a feature request? Open up an [issue](https://github.com/tinymce/tinymce-angular/issues) and let us know or submit a [pull request](https://github.com/tinymce/tinymce-angular/pulls). *Note: for issues concerning TinyMCE please visit the [TinyMCE repository](https://github.com/tinymce/tinymce).*