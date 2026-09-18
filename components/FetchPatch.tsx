'use client';

import { useEffect } from 'react';

export default function FetchPatch() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const origFetch = window.fetch;
        const getDesc = function (obj: any, prop: string) {
          try {
            return Object.getOwnPropertyDescriptor(obj, prop);
          } catch (e) {
            return null;
          }
        };
        const desc =
          getDesc(window, 'fetch') ||
          (typeof Window !== 'undefined' ? getDesc(Window.prototype, 'fetch') : null);
        if (desc && !desc.set) {
          let currentFetch = origFetch ? origFetch.bind(window) : null;
          try {
            Object.defineProperty(window, 'fetch', {
              get: function () {
                return currentFetch;
              },
              set: function (val) {
                currentFetch = val;
              },
              configurable: true,
              enumerable: true,
            });
          } catch (err) {
            try {
              if (typeof Window !== 'undefined' && Window.prototype) {
                Object.defineProperty(Window.prototype, 'fetch', {
                  get: function () {
                    return currentFetch;
                  },
                  set: function (val) {
                    currentFetch = val;
                  },
                  configurable: true,
                  enumerable: true,
                });
              }
            } catch (e2) {}
          }
        }
        window.addEventListener(
          'error',
          function (event) {
            if (
              event &&
              event.message &&
              event.message.indexOf('fetch') !== -1 &&
              event.message.indexOf('only a getter') !== -1
            ) {
              event.preventDefault();
              if (event.stopImmediatePropagation) event.stopImmediatePropagation();
              return true;
            }
          },
          true
        );
      }
    } catch (e) {}
  }, []);

  return null;
}
