// Copy from https://github.com/streamich/react-use/blob/master/src/useLockBodyScroll.ts
// 魔改为可以锁定任意元素的滚动

import type { RefObject } from 'react';
import { useEffect } from 'react';

export interface IElementInfo {
  counter: number;
  initialOverflow: CSSStyleDeclaration['overflow'];
}

const isIosDevice = /iP(ad|hone|od)/.test(window?.navigator?.platform || '');

const elements: Map<HTMLElement, IElementInfo> = new Map();

function preventDefault(e: TouchEvent) {
  e.preventDefault();
}

export function useLockScroll(elementRef?: RefObject<HTMLElement>, locked = true) {
  useEffect(() => {
    const element = elementRef?.current || document.body;

    if (!element) {
      return;
    }

    function lock() {
      const elementInfo = elements.get(element);
      if (!elementInfo) {
        elements.set(element, { counter: 1, initialOverflow: element.style.overflow });
        if (isIosDevice) {
          element.addEventListener('touchmove', preventDefault, { passive: false });
        } else {
          element.style.overflow = 'hidden';
        }
      } else {
        elements.set(element, {
          counter: elementInfo.counter + 1,
          initialOverflow: elementInfo.initialOverflow,
        });
      }
    }

    function unlock() {
      const elementInfo = elements.get(element);
      if (elementInfo && element) {
        if (elementInfo.counter === 1) {
          elements.delete(element);
          if (isIosDevice) {
            element.ontouchmove = null;
            element.removeEventListener('touchmove', preventDefault);
          } else {
            element.style.overflow = elementInfo.initialOverflow;
          }
        } else {
          elements.set(element, {
            counter: elementInfo.counter - 1,
            initialOverflow: elementInfo.initialOverflow,
          });
        }
      }
    }

    if (locked) {
      lock();
      return unlock;
    }
  }, [locked, elementRef]);
}
