import { configure, addDecorator } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';

addDecorator(withNotes);
function loadStories() {
  require('../stories/index.ts');
}

configure(loadStories, module);
