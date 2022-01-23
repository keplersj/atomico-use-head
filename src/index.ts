import { useState, useLayoutEffect } from "atomico/core";

type HeadAttrs = Record<string, any>;

interface HeadObject {
  title: string;
  meta: HeadAttrs[];
  link: HeadAttrs[];
  base: HeadAttrs;
  style: HeadAttrs[];
  script: HeadAttrs[];
  htmlAttrs: HeadAttrs;
  bodyAttrs: HeadAttrs;
}

const defaultHeadState: Partial<HeadObject> = {
  title: undefined,
  meta: [],
  link: [],
  base: undefined,
  style: [],
  script: [],
  htmlAttrs: undefined,
  bodyAttrs: undefined,
};

interface HookResult {
  state?: Partial<HeadObject>;
}

export function useHead(initialHead?: Partial<HeadObject>): HookResult {
  const [headState, setHeadState] = useState({
    ...defaultHeadState,
    ...initialHead,
  });

  useLayoutEffect(() => {
    const elements: HTMLElement[] = [];

    if (headState.title) {
      const titleElement = document.createElement("title");
      titleElement.text = headState.title;
      elements.push(titleElement);
    }

    if (headState.meta) {
      elements.push(
        ...headState.meta.map((meta) => {
          const element = document.createElement("meta");

          for (const prop in meta) {
            (element as any)[prop] = meta[prop];
          }

          return element;
        })
      );
    }

    if (headState.link) {
      elements.push(
        ...headState.link.map((meta) => {
          const element = document.createElement("link");

          for (const prop in meta) {
            (element as any)[prop] = meta[prop];
          }

          return element;
        })
      );
    }

    if (headState.base) {
      const element = document.createElement("base");

      for (const prop in headState.base) {
        (element as any)[prop] = headState.base[prop];
      }

      elements.push(element);
    }

    if (headState.style) {
      elements.push(
        ...headState.style.map((meta) => {
          const element = document.createElement("style");

          for (const prop in meta) {
            (element as any)[prop] = meta[prop];
          }

          return element;
        })
      );
    }

    if (headState.script) {
      elements.push(
        ...headState.script.map((meta) => {
          const element = document.createElement("script");

          for (const prop in meta) {
            (element as any)[prop] = meta[prop];
          }

          return element;
        })
      );
    }

    const initialHtmlAttributes: HeadAttrs = {};
    if (headState.htmlAttrs) {
      const element = document.documentElement;

      for (const prop in headState.htmlAttrs) {
        initialHtmlAttributes[prop] = (element as any)[prop];
        (element as any)[prop] = headState.htmlAttrs[prop];
      }

      (element as any)["data-atomico-helmet"] = Object.keys(
        headState.htmlAttrs
      ).join(",");
    }

    const initialBodyAttributes: HeadAttrs = {};
    if (headState.bodyAttrs) {
      const element = document.body;

      for (const prop in headState.bodyAttrs) {
        initialBodyAttributes[prop] = (element as any)[prop];
        (element as any)[prop] = headState.bodyAttrs[prop];
      }

      (element as any)["data-atomico-helmet"] = Object.keys(
        headState.bodyAttrs
      ).join(",");
    }

    for (const element of elements) {
      (element as any)["data-atomico-helmet"] = true;
      document.head.appendChild(element);
    }

    return () => {
      for (const element of elements) {
        element.remove();
      }

      if (headState.htmlAttrs) {
        const html = document.documentElement;

        for (const prop in initialHtmlAttributes) {
          (html as any)[prop] = initialHtmlAttributes[prop];
        }

        delete (html as any)["data-atomico-helmet"];
      }

      if (headState.bodyAttrs) {
        const body = document.body;

        for (const prop in initialBodyAttributes) {
          (body as any)[prop] = initialBodyAttributes[prop];
        }

        delete (body as any)["data-atomico-helmet"];
      }
    };
  }, [headState]);

  return {
    state: headState,
  };
}
