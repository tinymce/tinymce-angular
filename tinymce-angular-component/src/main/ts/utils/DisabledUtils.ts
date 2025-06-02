import { Editor } from 'tinymce';

const isDisabledOptionSupported = (editor: Editor) => editor.options && editor.options.isRegistered('disabled');

export {
  isDisabledOptionSupported
};
