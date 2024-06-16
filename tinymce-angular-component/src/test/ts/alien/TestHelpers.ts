import { Fun, Global, Arr, Strings } from '@ephox/katamari';
import { Observable, throwError, timeout } from 'rxjs';
import { ScriptLoader } from '../../../main/ts/utils/ScriptLoader';
import { Attribute, Remove, SelectorFilter, SugarElement } from '@ephox/sugar';

export const apiKey = Fun.constant(
  'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc',
);

export const throwTimeout =
  (timeoutMs: number, message: string = `Timeout ${timeoutMs}ms`) =>
    <T>(source: Observable<T>) =>
      source.pipe(
        timeout({
          first: timeoutMs,
          with: () => throwError(() => new Error(message)),
        })
      );

export const deleteTinymce = () => {
  ScriptLoader.reinitialize();

  delete Global.tinymce;
  delete Global.tinyMCE;

  const hasTinyUri = (attrName: string) => (elm: SugarElement<Element>) =>
    Attribute.getOpt(elm, attrName).exists((src) => Strings.contains(src, 'tinymce'));

  const elements = Arr.flatten([
    Arr.filter(SelectorFilter.all('script'), hasTinyUri('src')),
    Arr.filter(SelectorFilter.all('link'), hasTinyUri('href')),
  ]);

  Arr.each(elements, Remove.remove);
};

export const captureLogs = async (
  method: 'log' | 'warn' | 'debug' | 'error',
  fn: () => Promise<void> | void
): Promise<unknown[][]> => {
  const original = console[method];
  try {
    const logs: unknown[][] = [];
    console[method] = (...args: unknown[]) => logs.push(args);
    await fn();
    return logs;
  } finally {
    console[method] = original;
  }
};
