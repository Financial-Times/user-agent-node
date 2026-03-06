
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
// "FTSystem/myapp/1.2.3 (Node.js/22.13.1)"
```

You can optionally pass in options to `buildUserAgent` to change the output. These options can all be used together.

#### `hash` option

If you pass in an options object with a `hash` property (`string`), then this hash will be added to the generated user-agent, allowing us to verify it when it makes requests to FT properties. This hash **MUST NOT** be a secret but it must be predictable (e.g. not generated per-request). We recommend generating a hash with:

```sh
echo -n "a key phrase you decide on, it doesn't matter, it should just be unique" | openssl dgst -sha256
```

```js
buildUserAgent({ hash: '8977402135f4f28eb252473dc8ecf36f5b0253abd156c413bfae7886c6562e21' });
// "FTSystem/myapp/1.2.3 (hash:8977402135f4f28eb252473dc8ecf36f5b0253abd156c413bfae7886c6562e21)"
```

The `hash` option defaults to the value of `process.env.USER_AGENT_HASH` if present.

#### `libraries` option

If you pass in an options object with a `libraries` property (Array of strings - `string[]`), then library names and versions will be added based on what's found in the application's `node_modules` folder, e.g.

```js
buildUserAgent({ libraries: ['node-fetch'] });
// "FTSystem/myapp/1.2.3 (node-fetch/2.0.0; Node.js/22.13.1)"
```

If you pass in multiple libraries then they will be separated by semicolons (`;`). If a library with a given name cannot be found under `node_modules` then it will be excluded.

#### `urls` option

If you pass in an options object with a `urls` property (Array of strings - `string[]`), then these URLs will be added with a leading `+`, e.g.

```js
buildUserAgent({ urls: ['https://www.ft.com/'] });
// "FTSystem/myapp/1.2.3 (+https://www.ft.com/; Node.js/22.13.1)"
```

If you pass in multiple urls then they will be separated by semicolons (`;`).


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2024, The Financial Times Ltd.
