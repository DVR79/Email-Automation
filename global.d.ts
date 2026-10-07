/* Bridge the deprecated global JSX namespace to React 19's React.JSX,
   so `JSX.Element` annotations typecheck. Sendrift. Copyright 2026 Venkataramana. */

import type { JSX as ReactJSX } from "react";

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type ElementClass = ReactJSX.ElementClass;
    type ElementAttributesProperty = ReactJSX.ElementAttributesProperty;
    type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
  }
}

export {};
