import { configure } from '@storybook/angular';

function loadStories() {
  require('../stories/index.ts');
}

configure(loadStories, module);
