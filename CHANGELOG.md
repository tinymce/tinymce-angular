# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 7.1.0 - 2024-04-04
### Fixed
- Updated CI library to latest
- Updated dependencies. #INT-3274
- Usage of RxJS deprecated operators. #INT-3274
### Added
- Support for Angular 15, 16 & 17. #INT-3274
### Improved
- Updated Storybook to v8, as well as now using CSFv3 components. #INT-3274

## 7.0.0 - 2022-06-27
### Added
- Support for Angular 14

## 6.0.1 - 2022-04-09
### Fixed
- Disabling bug

## 6.0.0 - 2022-04-08
### Changed
- License changed to MIT
- Default cloud channel to '6'

## 5.0.1 - 2022-01-21
### Fixed
- Dependencies issues having to manually install tinymce to get Types

## 5.0.0 - 2022-01-12
### Added
- Support for Angular 13

## 4.2.5 - 2021-11-30
### Added
- Types
### Fixed
- Performance of removing event listeners
- Initializing the editor when component has been destroyed
- Setting disabling state

## 4.2.4 - 2021-05-31
### Fixed
- Updated dependencies

### 4.2.3 - 2021-05-11
### Fixed
- Updated dependencies

## 4.2.2 - 2021-03-18
### Added
- Event `ResizeEditor` to event handler
- Warning on multiple ediotrs with same Id

## 4.2.1 - 2021-02-10
### Added
- Beehive-flow release process
- Support for Angular 11
- Adopted beehive-flow release process
- Support for Angular 11

## 4.2.0 - 2020-09-16
### Added
- Added `allowedEvents` to specify what events are emitted by the component
- Added `ignoreEvents` to blacklist events not to be emitted by the component

### Removed
- Remove`change` event being emitted on initialization if the value is not changed by the editor

## 4.1.0 - 2020-07-20
### Added
- Added `onInitNgModel` event
- Use `input` instead of `keyup` as default modelEvent

## 4.0.0 - 2020-07-07
### Added
- Compatibility with Angular ^10.0.0 compatibility

### Changed
- Changed peer dependencies to support Angular 9 and 10

## 3.6.1 - 2020-05-26
### Changed
- Setting the initial value on the editor now propagates the editor's content

## 3.6.0 - 2020-05-22
### Added
- Added `modelEvents` property to update NgModel

## 3.5.2 - 2020-05-11
### Fixed
- Fixed event binding order.

## 3.5.1 - 2020-04-30
### Fixed
- Upgraded jquery in dev dependencies in response to security alert.

## 3.5.0 - 2020-03-02
### Added
- Added new `TINYMCE_SCRIPT_SRC` injection token. To be used in a dependency injection provider to specify an external version of TinyMCE to load

## 3.4.0 - 2020-01-31
### Added
- Added new `outputFormat` property for specifying the format of content emitted to form controls

## 3.3.1 - 2019-09-23
### Added
- Added tslib as a dependency. Inlined tslib helpers caused an issue for the Angular Ivy compiler

## 3.3.0 - 2019-08-20
### Changed
- Changed peer dependencies to support Angular 5

## 3.2.1 - 2019-08-16
### Changed
- Changed referrer policy to origin to allow cloud caching

## 3.2.0 - 2019-07-01
### Added
- Added a getter for obtaining a reference to the editor

### Fixed
- Fixed a bug that made EventEmitters run outside of NgZone. Patch contributed by garrettld #GH-95

## 3.1.0 - 2019-06-06
### Added
- Angular 8 support

### Changed
- Changed the CDN URL to use `cdn.tiny.cloud`

## 3.0.1 - 2019-04-21
### Fixed
- Fixed a bug where `ControlValueAccessor.writeValue()` or setting content programmatically would set `FormControl` pristine/dirty flags

## 3.0.0 - 2019-02-11
### Changed
- Changed default cloudChannel to `'5'`.

## 2.5.0 - 2019-01-17
### Added
- Add EditorComponent to public api.

## 2.4.1 - 2019-01-09
### Fixed
- Fixed a bug where `FormGroup.reset()` didn't clear the editor content when used in a formgroup. Patch contributed by nishanthkarthik.

## 2.4.0 - 2019-01-07
### Added
- Make editor always invoke touched callback on blur. Patch contributed by joensindholt 

## 2.3.3 - 2018-12-14
### Fixed
- Improved documentation.

## 2.3.2 - 2018-12-03
### Added
- Angular 7 support

## 2.3.1 - 2018-10-10
### Fixed
- Fixed incorrect documentation in readme.md file.

## 2.3.0 - 2018-10-08
### Added
- Added platform detection to make the package work better with SSR.

## 2.2.0 - 2018-09-26
### Added
- Added support for disabling the editor via the `disabled` attribute.

## 2.1.0 - 2018-09-24
### Fixed
- Fixed bug where textarea was being added to editor content if id was set.
  
### Changed
- Changed `inline` attribute to accept truthy values, so you can now do this: `<editor inline></editor>` instead of the earlier `<editor [inline]="true"></editor>`.

## 2.0.1 - 2018-09-03
### Fixed
- Fixed broken links in readme.

## 2.0.0 - 2018-05-08
### Added
- Angular 6 support

### Changed  
- rxjs version 6

## 1.0.9 - 2018-05-04
### Added
- Added `undo` and `redo` events to ngModel onChangeCallback.

## 1.0.8 - 2018-04-26
### Fixed
- Added null check before removing editor to check that tinymce is actually available.

## 1.0.7 - 2018-04-06
### Fixed
- Fixed bug with onInit not firing and removed onPreInit shorthand.

## 1.0.6 - 2018-04-06
### Changed
- Changed so tinymce.init is run outside of angular with ngzone.

## 1.0.5 - 2018-02-15
### Fixed
- Fixed bug where is wasn't possible to set inline in the init object, only on the shorthand.

## 1.0.4 - 2018-02-14
### Fixed
- Fixed bug where the component threw errors because it tried to setContent on an editor that had not been initialized fully.

## 1.0.3 - 2018-02-13
### Fixed
- Fixed bug where the component threw errors on change when not used together with the forms module.
