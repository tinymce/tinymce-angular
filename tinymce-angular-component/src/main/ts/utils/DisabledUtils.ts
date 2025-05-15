import { getTinymce } from '../TinyMCE';
import { TinyMCE } from 'tinymce';

const isDisabledOptionSupported = () => {
  const tiny: TinyMCE = getTinymce();
  // Disabled option is supported since Tiny 7.6.0
  return Number(tiny.majorVersion) > 7 || (Number(tiny.majorVersion) === 7 && Number(tiny.minorVersion) >= 6);
};

export {
  isDisabledOptionSupported
};
