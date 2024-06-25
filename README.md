
# @financial-times/user-agent

A library to generate user-agent strings that conform to the [FT standard](https://docs.google.com/document/d/1fSrPlPKwJyL69iLi8MXygFe-TzfiKAEler21smAJicM/edit).

* [Usage](#usage)
  * [`buildUserAgent`](#builduseragent)
    * [`libraries` option](#libraries-option)
    * [`urls` option](#urls-option)
* [License](#license)


## Usage

Install `@financial-times/user-agent` as a dependency:

```bash
npm install --save @financial-times/user-agent
```

Include in your code:

```js
import { buildUserAgent } from '@financial-times/user-agent';
// or
const { buildUserAgent } = require('@financial-times/user-agent');
```

### `buildUserAgent`

The `buildUserAgent` function can be used to generate a user-agent string based on the app that the function is run in. It uses the [Reliability Kit app-info package](https://github.com/Financial-Times/dotcom-reliability-kit/tree/main/packages/app-info#readme) to determine a system code and version as follows:

  * **System code:** use the `SYSTEM_CODE` environment variable. Otherwise, fall back to `name` in `CWD/package.json`. If neither is present, use `unknown`.

  * **Version:** use the `HEROKU_RELEASE_VERSION` environment variable, then the `AWS_LAMBDA_FUNCTION_VERSION` environment variable, Otherwise, fall back to `version` in `CWD/package.json`. If none are present, use `0.0.0`.

It also includes the Node.js version. E.g.

```js
buildUserAgent();
// "FTSystem/myapp/1.2.3 (Node.js/22.3.0)"
```

You can optionally pass in options to `buildUserAgent` to change the output. These options can all be used together.

#### `libraries` option

If you pass in an options object with a `libraries` property (Array of strings - `string[]`), then library names and versions will be added based on what's found in the application's `node_modules` folder, e.g.

```js
buildUserAgent({ libraries: ['node-fetch'] });
// "FTSystem/myapp/1.2.3 (node-fetch/2.0.0; Node.js/22.3.0)"
```

If you pass in multiple libraries then they will be separated by semicolons (`;`). If a library with a given name cannot be found under `node_modules` then it will be excluded.

#### `urls` option

If you pass in an options object with a `urls` property (Array of strings - `string[]`), then these URLs will be added with a leading `+`, e.g.

```js
buildUserAgent({ urls: ['https://www.ft.com/'] });
// "FTSystem/myapp/1.2.3 (+https://www.ft.com/; Node.js/22.3.0)"
```

If you pass in multiple libraries then they will be separated by semicolons (`;`). If a library with a given name cannot be found under `node_modules` then it will be excluded.


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2024, The Financial Times Ltd.
