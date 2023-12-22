/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defer, fromEvent, Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

export interface IStateObj {
  script$: Observable<void> | null;
}

const createState = (): IStateObj => ({
  script$: null,
});

interface ScriptLoader {
  load: (doc: Document, url: string) => Observable<void>;
  reinitialize: () => void;
}

const CreateScriptLoader = (): ScriptLoader => {
  let state = createState();

  const load = (doc: Document, url: string) => (
    state.script$ ||
    // Caretaker note: the `script$` is a multicast observable since it's piped with `shareReplay`,
    // so if there're multiple editor components simultaneously on the page, they'll subscribe to the internal
    // `ReplaySubject`. The script will be loaded only once, and `ReplaySubject` will cache the result.
    (state.script$ = defer(() => {
      const scriptTag = doc.createElement('script');
      scriptTag.referrerPolicy = 'origin';
      scriptTag.type = 'application/javascript';
      scriptTag.src = url;
      doc.head.appendChild(scriptTag);
      return fromEvent(scriptTag, 'load').pipe(take(1), map(() => undefined));
    }).pipe(shareReplay({ bufferSize: 1, refCount: true })))
  );

  // Only to be used by tests.
  const reinitialize = () => {
    state = createState();
  };

  return {
    load,
    reinitialize,
  };
};

const ScriptLoader = CreateScriptLoader();

export { ScriptLoader };
