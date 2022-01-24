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

interface Options {
  hydrate: boolean;
}

export function useHead(
  initialHead?: Partial<HeadObject>,
  options?: Partial<Options>
): HookResult {
  const [headState, setHeadState] = useState({
    ...defaultHeadState,
    ...initialHead,
  });

  useLayoutEffect(() => {
    if (options?.hydrate) {
      document.querySelectorAll("[data-atomico-helmet]").forEach((element) => {
        element.remove();
      });
    }

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
            element.setAttribute(prop, meta[prop]);
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
            element.setAttribute(prop, meta[prop]);
          }

          return element;
        })
      );
    }

    if (headState.base) {
      const element = document.createElement("base");

      for (const prop in headState.base) {
        element.setAttribute(prop, headState.base[prop]);
      }

      elements.push(element);
    }

    if (headState.style) {
      elements.push(
        ...headState.style.map((meta) => {
          const element = document.createElement("style");

          for (const prop in meta) {
            if (prop === "innerText") {
              element.innerText = meta[prop];
            } else {
              element.setAttribute(prop, meta[prop]);
            }
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
            if (prop === "innerText") {
              element.innerText = element[prop];
            } else {
              element.setAttribute(prop, meta[prop]);
            }
          }

          return element;
        })
      );
    }

    const initialHtmlAttributes: HeadAttrs = {};
    if (headState.htmlAttrs) {
      const element = document.documentElement;

      for (const prop in headState.htmlAttrs) {
        initialHtmlAttributes[prop] = element.getAttribute(prop);
        element.setAttribute(prop, headState.htmlAttrs[prop]);
      }

      element.setAttribute(
        "data-atomico-helmet",
        Object.keys(headState.htmlAttrs).join(",")
      );
    }

    const initialBodyAttributes: HeadAttrs = {};
    if (headState.bodyAttrs) {
      const element = document.body;

      for (const prop in headState.bodyAttrs) {
        initialBodyAttributes[prop] = element.getAttribute(prop);
        element.setAttribute(prop, headState.bodyAttrs[prop]);
      }

      element.setAttribute(
        "data-atomico-helmet",
        Object.keys(headState.bodyAttrs).join(",")
      );
    }

    for (const element of elements) {
      element.setAttribute("data-atomico-helmet", "true");
      document.head.appendChild(element);
    }

    return () => {
      for (const element of elements) {
        element.remove();
      }

      if (headState.htmlAttrs) {
        const html = document.documentElement;

        for (const prop in initialHtmlAttributes) {
          if (initialHtmlAttributes[prop]) {
            html.setAttribute(prop, initialHtmlAttributes[prop]);
          } else {
            html.removeAttribute(prop);
          }
        }

        html.removeAttribute("data-atomico-helmet");
      }

      if (headState.bodyAttrs) {
        const body = document.body;

        for (const prop in initialBodyAttributes) {
          if (initialBodyAttributes[prop]) {
            body.setAttribute(prop, initialBodyAttributes[prop]);
          } else {
            body.removeAttribute(prop);
          }
        }

        body.removeAttribute("data-atomico-helmet");
      }
    };
  }, [headState]);

  return {
    state: headState,
  };
}
