import { AppPage } from './app.po';

describe('tinymce-angular App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('FakeyBlog');
  });

  it('should display editor', () => {
    page.navigateTo();
    expect(page.getEditorPluginsAttribute()).toEqual('link');
  });
});
