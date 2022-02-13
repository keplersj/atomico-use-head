import { h, useLayoutEffect, render } from "atomico";

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

const defaultAttrs = {
  "data-atomico-helmet": "true",
};

type BackupAttr = { [prop: string]: string | null };

export function useHead(
  initialState: Partial<HeadObject>,
  options?: Partial<Options>
): HookResult {
  const headState = { ...defaultHeadState, ...initialState };

  useLayoutEffect(() => {
    if (options?.hydrate) {
      document.querySelectorAll("[data-atomico-helmet]").forEach((element) => {
        element.remove();
      });
    }

    const htmlAttrs: BackupAttr | undefined =
      headState.htmlAttrs &&
      Object.keys(headState.htmlAttrs).reduce(
        (props, attr) => ({
          ...props,
          [attr]: document.documentElement.getAttribute(attr) || null,
        }),
        {}
      );
    const bodyAttrs: BackupAttr | undefined =
      headState.bodyAttrs &&
      Object.keys(headState.bodyAttrs).reduce(
        (props, attr) => ({
          ...props,
          [attr]: document.body.getAttribute(attr) || null,
        }),
        {}
      );
    return () => {
      render(h("host", htmlAttrs), document.documentElement);
      render(h("host", null), document.head);
      render(h("host", bodyAttrs), document.body);
    };
  }, []);

  useLayoutEffect(() => {
    render(
      h(
        "host",
        null,
        headState.title && h("title", defaultAttrs, headState.title),
        headState.meta &&
          headState.meta.map((meta) => h("meta", { ...defaultAttrs, ...meta })),
        headState.link &&
          headState.link.map((meta) => h("link", { ...defaultAttrs, ...meta })),
        headState.base && h("base", { ...defaultAttrs, ...headState.base }),
        headState.style &&
          headState.style.map((meta) =>
            h("style", { ...defaultAttrs, ...meta })
          ),
        headState.script &&
          headState.script.map((meta) =>
            h("script", { ...defaultAttrs, ...meta })
          )
      ),
      document.head
    );

    render(h("host", headState.htmlAttrs), document.documentElement);
    render(h("host", headState.bodyAttrs), document.body);
  }, [JSON.stringify(headState)]);

  return { state: headState };
}
