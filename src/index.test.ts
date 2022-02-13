import { jest } from "@jest/globals";
import { createHooks } from "atomico/test-hooks";

afterEach(() => {
  document.getElementsByTagName("html")[0].innerHTML = "";
});

describe("useHead Hook", () => {
  describe("module", () => {
    it("exports match expectations", async () => {
      const module = await import("./index");

      expect(module).toMatchInlineSnapshot(`
        Object {
          "useHead": [Function],
        }
      `);
    });
  });

  describe("hook, no initial state", () => {
    it("returns a result object when run", async () => {
      const host = document.createElement("div");
      host.attachShadow({ mode: "open" });
      document.body.appendChild(host);
      const hooks = createHooks(jest.fn(), host);

      const { useHead } = await import("./index");
      const head = hooks.load(() => useHead({}));

      expect(head).toMatchSnapshot();

      expect(document.documentElement).toMatchSnapshot();
    });
  });

  describe("hook, with initial state", () => {
    it("returns a result object when run", async () => {
      const host = document.createElement("div");
      host.attachShadow({ mode: "open" });
      document.body.appendChild(host);
      const hooks = createHooks(jest.fn(), host);

      const { useHead } = await import("./index");
      const head = hooks.load(() =>
        useHead({
          title: "Test",
          meta: [
            {
              name: "description",
              content: "Test Description",
            },
          ],
          link: [
            {
              rel: "apple-touch-icon",
              sizes: "48x48",
              href: "/icons/icon-48x48.png",
            },
          ],
          base: {
            href: "/",
            target: "_blank",
          },
          style: [
            {
              children: "body {color: red}",
            },
          ],
          script: [
            {
              as: "script",
              rel: "preload",
              href: "/framework.js",
            },
          ],
          htmlAttrs: {
            lang: "en",
          },
          bodyAttrs: {
            class: "root",
          },
        })
      );

      hooks.cleanEffects();

      expect(head).toMatchSnapshot();

      expect(document.documentElement).toMatchSnapshot();

      hooks.cleanEffects(true);

      expect(document.documentElement).toMatchSnapshot();
    });
  });
});
