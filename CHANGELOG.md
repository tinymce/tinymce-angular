# 1.0.6 (2018-04-06)
* Fixed bug with onInit not firing and removed onPreInit shorthand.

# 1.0.6 (2018-04-06)
* Changed so tinymce.init is run outside of angular with ngzone.

# 1.0.5 (2018-02-15)
* Fixed bug where is wasn't possible to set inline in the init object, only on the shorthand.

# 1.0.4 (2018-02-14)
* Fixed bug where the component threw errors because it tried to setContent on an editor that had not been initialized fully.

# 1.0.3 (2018-02-13)
* Fixed bug where the component threw errors on change when not used together with the forms module.
