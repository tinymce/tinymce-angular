import { TinyVer } from '@tinymce/miniature';
import { getTinymce } from '../TinyMCE';
import { TinyMCE } from 'tinymce';

const isDisabledOptionSupported = () => {
  const tiny: TinyMCE = getTinymce();
  return !TinyVer.isLessThan(tiny, '7.6.0');
};

export {
  isDisabledOptionSupported
};
