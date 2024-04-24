/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fromEvent, Observable, shareReplay, switchMap, BehaviorSubject, first, filter, map } from 'rxjs';

interface ScriptLoader {
  load: (doc: Document, url: string) => Observable<void>;
  /** Intended to only to be used by tests. */
  reinitialize: () => void;
}

const firstEmission = () => (source: Observable<unknown>): Observable<void> => source.pipe(first(), map(() => undefined));

const CreateScriptLoader = (): ScriptLoader => {
  const params$ = new BehaviorSubject<Parameters<ScriptLoader['load']> | null>(null);
  const loaded$: Observable<void> = params$.pipe(
    filter(Boolean),
    switchMap(([ doc, url ]) => {
      const scriptTag = doc.createElement('script');
      scriptTag.referrerPolicy = 'origin';
      scriptTag.type = 'application/javascript';
      scriptTag.src = url;
      doc.head.appendChild(scriptTag);
      return fromEvent(scriptTag, 'load').pipe(firstEmission());
    }),
    // Caretaker note: `loaded$` is a multicast observable since it's piped with `shareReplay`,
    // so if there're multiple editor components simultaneously on the page, they'll subscribe to the internal
    // `ReplaySubject`. The script will be loaded only once, and `ReplaySubject` will cache the result.
    shareReplay({ bufferSize: 1, refCount: true })
  );

  return {
    load: (...args) => {
      if (!params$.getValue()) {
        params$.next(args);
      }
      return loaded$;
    },
    reinitialize: () => {
      params$.next(null);
    },
  };
};

const ScriptLoader = CreateScriptLoader();

export { ScriptLoader };
