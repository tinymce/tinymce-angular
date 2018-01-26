import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h2')).getText();
  }

  getEditorPluginsAttribute() {
    return element(by.css('editor')).getAttribute('plugins');
  }
}
