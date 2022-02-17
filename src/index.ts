import { h, useLayoutEffect, render } from "atomico";

type HeadAttributes = Record<string, any>;

interface HeadObject {
  title: string;
  meta: HeadAttributes[];
  link: HeadAttributes[];
  base: HeadAttributes;
  style: HeadAttributes[];
  script: HeadAttributes[];
  htmlAttrs: HeadAttributes;
  bodyAttrs: HeadAttributes;
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
  dirty: boolean;
}

const defaultAttributes = {
  "data-atomico-helmet": "true",
};

type BackupAttribute = { [prop: string]: string | undefined };

export function useHead(
  initialState: Partial<HeadObject>,
  options?: Partial<Options>
): HookResult {
  const headState = { ...defaultHeadState, ...initialState };

  useLayoutEffect(() => {
    if (options?.hydrate) {
      for (const element of document.querySelectorAll(
        "[data-atomico-helmet]"
      )) {
        element.remove();
      }
    }

    const backupHtmlAttributes: BackupAttribute | undefined =
      headState.htmlAttrs &&
      Object.fromEntries(
        Object.keys(headState.htmlAttrs).map((attribute) => [
          attribute,
          document.documentElement.getAttribute(attribute) || undefined,
        ])
      );
    const backupBodyAttributes: BackupAttribute | undefined =
      headState.bodyAttrs &&
      Object.fromEntries(
        Object.keys(headState.bodyAttrs).map((attribute) => [
          attribute,
          document.body.getAttribute(attribute) || undefined,
        ])
      );

    render(
      h(
        "host",
        undefined,
        headState.title && h("title", defaultAttributes, headState.title),
        headState.meta &&
          headState.meta.map((meta) =>
            h("meta", { ...defaultAttributes, ...meta })
          ),
        headState.link &&
          headState.link.map((meta) =>
            h("link", { ...defaultAttributes, ...meta })
          ),
        headState.base &&
          h("base", { ...defaultAttributes, ...headState.base }),
        headState.style &&
          headState.style.map((meta) =>
            h("style", { ...defaultAttributes, ...meta })
          ),
        headState.script &&
          headState.script.map((meta) =>
            h("script", { ...defaultAttributes, ...meta })
          )
      ),
      document.head
    );

    render(h("host", headState.htmlAttrs), document.documentElement);
    render(h("host", headState.bodyAttrs), document.body);

    if (!options?.dirty) {
      return () => {
        render(h("host", backupHtmlAttributes), document.documentElement);
        render(h("host"), document.head);
        render(h("host", backupBodyAttributes), document.body);
      };
    }
  }, [JSON.stringify(headState)]);

  return { state: headState };
}
