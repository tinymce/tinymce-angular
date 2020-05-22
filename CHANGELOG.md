## 3.6.0 (2020-05-22)
* Added `modelEvents` property to update NgModel

## 3.5.2 (2020-05-11)
* Fixed event binding order.

## 3.5.1 (2020-04-30)
* Upgraded jquery in dev dependencies in response to security alert.

## 3.5.0 (2020-03-02)
* Added new `TINYMCE_SCRIPT_SRC` injection token. To be used in a dependency injection provider to specify an external version of TinyMCE to load

## 3.4.0 (2020-01-31)
* Added new `outputFormat` property for specifying the format of content emitted to form controls

## 3.3.1 (2019-09-23)
* Added tslib as a dependency. Inlined tslib helpers caused an issue for the Angular Ivy compiler

## 3.3.0 (2019-08-20)
* Changed peer dependencies to support Angular 5

## 3.2.1 (2019-08-16)
* Changed referrer policy to origin to allow cloud caching

## 3.2.0 (2019-07-01)
* Added a getter for obtaining a reference to the editor
* Fixed a bug that made EventEmitters run outside of NgZone. Patch contributed by garrettld #GH-95

## 3.1.0 (2019-06-06)
* Changed the CDN URL to use `cdn.tiny.cloud`
* Changed peer dependencies to support Angular 8.

## 3.0.1 (2019-04-21)
* Fixed a bug where `ControlValueAccessor.writeValue()` or setting content programmatically would set `FormControl` pristine/dirty flags

## 3.0.0 (2019-02-11)
* Changed default cloudChannel to `'5'`.

## 2.5.0 (2019-01-17)
* Add EditorComponent to public api.

## 2.4.1 (2019-01-09)
* Fixed a bug where `FormGroup.reset()` didn't clear the editor content when used in a formgroup. Patch contributed by nishanthkarthik.

## 2.4.0 (2019-01-07)
* Make editor always invoke touched callback on blur. Patch contributed by joensindholt 

## 2.3.3 (2018-12-14)
* Improved documentation.

## 2.3.2 (2018-12-03)
* Change deps to support Angular 7.

## 2.3.1 (2018-10-10)
* Fixed incorrect documentation in readme.md file.

## 2.3.0 (2018-10-08)
* Added platform detection to make the package work better with SSR.

## 2.2.0 (2018-09-26)
* Added support for disabling the editor via the `disabled` attribute.

## 2.1.0 (2018-09-24)
* Fixed bug where textarea was being added to editor content if id was set.
* Changed `inline` attribute to accept truthy values, so you can now do this: `<editor inline></editor>` instead of the earlier `<editor [inline]="true"></editor>`.

## 2.0.1 (2018-09-03)
* Fixed broken links in readme.

## 2.0.0 (2018-05-08)
* Migrate to Angular and rxjs version 6

## 1.0.9 (2018-05-04)
* Added `undo` and `redo` events to ngModel onChangeCallback.

## 1.0.8 (2018-04-26)
* Added null check before removing editor to check that tinymce is actually available.

## 1.0.7 (2018-04-06)
* Fixed bug with onInit not firing and removed onPreInit shorthand.

## 1.0.6 (2018-04-06)
* Changed so tinymce.init is run outside of angular with ngzone.

## 1.0.5 (2018-02-15)
* Fixed bug where is wasn't possible to set inline in the init object, only on the shorthand.

## 1.0.4 (2018-02-14)
* Fixed bug where the component threw errors because it tried to setContent on an editor that had not been initialized fully.

## 1.0.3 (2018-02-13)
* Fixed bug where the component threw errors on change when not used together with the forms module.
