# atomico-use-head

[![npm](https://img.shields.io/npm/v/atomico-use-head)](https://www.npmjs.com/package/atomico-use-head)
[![npm](https://img.shields.io/npm/dw/atomico-use-head)](https://www.npmjs.com/package/atomico-use-head)
[![Codecov](https://img.shields.io/codecov/c/github/keplersj/atomico-use-head)](https://app.codecov.io/gh/keplersj/atomico-use-head)
[![Bundle Size](https://img.shields.io/bundlephobia/min/atomico-use-head)](https://bundlephobia.com/package/atomico-use-head)

Atomico hook for interacting with the document head.

## Installation

Install using [npm](https://npmjs.com):

```sh
$ npm install atomico-use-head
```

Or use in browsers with [Skypack](https://www.skypack.dev/):

```html
<script type="module">
  import { useHead } from "https://cdn.skypack.dev/atomico-use-head";
</script>
```

## Usage

Use the `useHead()` hook to set the contents of the document head from your component:

```jsx
import { c } from "atomico";
import { useHead } from "atomico-use-head";

function component() {
  useHead({
    title: "Hello World!",
  });

  return (
    <host>
      <p>The title of this document is `Hello World!`</p>
    </host>
  );
}

customElements.define("hello-world", c(component));
```

## License

Copyright 2022 [Kepler Sticka-Jones](https://keplersj.com). Licensed ISC.
