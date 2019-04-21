module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false,
      jasmine: {
        random: false
      }
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    basePath: '../',
    files: [
      { pattern: 'node_modules/tinymce/tinymce.js', watched: false },
      { pattern: 'node_modules/tinymce/themes/silver/theme.js', watched: false },
      { pattern: 'node_modules/tinymce/skins/**/*.css', included: false, watched: false },
    ]
  });
};
