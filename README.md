# Official TinyMCE Angular Component

## About

This package is a thin wrapper around `tinymce` to make it easier to use in an Angular application.

For some quick demos, check out the [storybook](https://tinymce.github.io/tinymce-angular/).

## Development instructions

The editor component itselt is located in the `tinymce-angular-component` and packaged into a redistributable package with the [ng-packagr](https://github.com/dherges/ng-packagr) tool. A test app has been created with the [`@angular/cli`](https://github.com/angular/angular-cli). It is located in the `src` directory and a dev server can be started by using the `ng serve` command.

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
And add it to you application module:

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

```tsx
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

None of the configuration inputs are **required** for the editor to work - other than if you are using TinyMCE Cloud you will have to specify the `apiKey` to get rid of the `This domain is not registered...` warning message.

### `ngModel`

You can also use the `ngModel` directive (more info in the [Angular documentation](https://angular.io/api/forms/NgModel)) on the editor to simplify using it in a form:

```tsx
<editor [(ngModel)]="dataModel"></editor>
```

### Using with reactive forms

The component also works with reactive forms (see [Angular documentation](https://angular.io/guide/reactive-forms))).

For example it can be used with the `formControlName` directive like this, placed inside a `formGroup`:

```tsx
<editor [formControlName]="schema.key" [init]="{plugins: 'link'}></editor>
```

### Event binding

You can also bind editor events via a shorthand prop on the editor, for example:
```tsx
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

```tsx
<editor apiKey="test" [init]="{/* your settings */}"></editor>
```

You can also define what cloud channel you want to use out these three
* `stable` **Default**. The most stable and well tested version that has passed the Ephox quality assurance process.
* `testing` This channel will deploy the current candidate for release to the `stable` channel.
* `dev` The cutting edge version of TinyMCE updated daily for the daring users.

So using the `dev` channel would look like this:

```tsx
<editor apiKey="YOUR_API_KEY" cloudChannel="dev" [init]="{/* your settings */}"></editor>
```

For more info on the different versions see the [documentation](https://www.tiny.cloud/docs/cloud-deployment-guide/editor-plugin-version/#devtestingandstablereleases).

### Loading TinyMCE by yourself

To opt out of using TinyMCE cloud you have to make TinyMCE globally available yourself. This can be done either by hosting the `tinymce.min.js` file by youself and adding a script tag to you HTML or, if you are using a module loader, installing TinyMCE with npm. For info on how to get TinyMCE working with module loaders check out [this page in the documentation](https://www.tinymce.com/docs/advanced/usage-with-module-loaders/).
Following step by step guide outlines the process of loading TinyMCE and TinyMCE-Angular in your local Angular project.

* Install TinyMCE using NPM
  * `npm install --save tinymce`
* In your `angular.json`, add `tinymce.min.js`, your desired theme (`.js`) and all required plugins in the "scripts" list of your Angular build declaration
  * To get karma tests working, provide `tinymce.min.js` in the "scripts" lists of "test". Depending on your text fixture, you might want to add plugins as well.
  * Your script list might look like the following:
  ```tsx
  "scripts": [
    "node_modules/tinymce/tinymce.min.js",
    "node_modules/tinymce/themes/modern/theme.js",
    "node_modules/tinymce/plugins/fullscreen/plugin.js",
  ]
  ```
* To get TinyMCE themes and styles, you need to provide them manually, i.e. by copying them into your assets folder.
  * `cp -r node_modules/tinymce/skins src/assets/tinymce/skins`
* Finally, configure the `<editor>` to use the local skin files by using the `skin_url` setting:
  ```tsx
  public tinyMceSettings = {
    skin_url: '/assets/tinymce/skins/lightgray',
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    height: 320,
    plugins: 'fullscreen',
  };
  ```
  ```tsx
  <editor [init]="tinyMceSettings"></editor>
  ```
