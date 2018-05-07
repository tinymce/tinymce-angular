/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const getTinymce = () => {
  const w = <any> window;
  return w && w.tinymce ? w.tinymce : null;
};

export { getTinymce };
