## (TBA)
* Changed the CDN URL to use `cdn.tiny.cloud`
* Changed peer dependencies to support Angular 8.

## 3.0.1
* Fixed a bug where `ControlValueAccessor.writeValue()` or setting content programmatically would set `FormControl` pristine/dirty flags

## 3.0.0
* Changed default cloudChannel to `'5'`.

# 2.5.0

* Add EditorComponent to public api.

# 2.4.1

* Fixed a bug where `FormGroup.reset()` didn't clear the editor content when used in a formgroup. Patch contributed by nishanthkarthik.

# 2.4.0

* Make editor always invoke touched callback on blur. Patch contributed by joensindholt 

# 2.3.3

* Improved documentation.

# 2.3.2

* Change deps to support Angular 7.

# 2.3.1

* Fixed incorrect documentation in readme.md file.

# 2.3.0

* Added platform detection to make the package work better with SSR.

# 2.2.0

* Added support for disabling the editor via the `disabled` attribute.

# 2.1.0

* Fixed bug where textarea was being added to editor content if id was set.
* Changed `inline` attribute to accept truthy values, so you can now do this: `<editor inline></editor>` instead of the earlier `<editor [inline]="true"></editor>`.

# 2.0.1

* Fixed broken links in readme.

# 2.0.0 (2018-05-08)

* Migrate to Angular and rxjs version 6

# 1.0.9 (2018-05-04)

* Added `undo` and `redo` events to ngModel onChangeCallback.

# 1.0.8 (2018-04-26)

* Added null check before removing editor to check that tinymce is actually available.

# 1.0.7 (2018-04-06)

* Fixed bug with onInit not firing and removed onPreInit shorthand.

# 1.0.6 (2018-04-06)

* Changed so tinymce.init is run outside of angular with ngzone.

# 1.0.5 (2018-02-15)

* Fixed bug where is wasn't possible to set inline in the init object, only on the shorthand.

# 1.0.4 (2018-02-14)

* Fixed bug where the component threw errors because it tried to setContent on an editor that had not been initialized fully.

# 1.0.3 (2018-02-13)

* Fixed bug where the component threw errors on change when not used together with the forms module.
