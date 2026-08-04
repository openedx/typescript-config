[![Build Status](https://github.com/openedx/typescript-config/actions/workflows/release.yml/badge.svg)](https://github.com/openedx/typescript-config/actions/workflows/release.yml/)
[![NPM Version](https://img.shields.io/npm/v/@edx/typescript-config.svg)](https://www.npmjs.com/package/@edx/typescript-config)
[![npm_downloads](https://img.shields.io/npm/dt/@edx/typescript-config.svg)](https://www.npmjs.com/package/@edx/tpyescript-config)
[![license](https://img.shields.io/npm/l/@edx/typescript-config.svg)](https://github.com/openedx/typescript-config/blob/main/LICENSE)
[![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# @edx/typescript-config

## About

The presence of a tsconfig.json file in a directory indicates that the directory is the root of a TypeScript project. The tsconfig.json file specifies the root files and the compiler options required to compile the project (from https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## Requirements

This package requires TypeScript 6 or 7. Support for TypeScript 4 and 5 was dropped
because those versions do not understand `"moduleResolution": "bundler"`, which
replaces the `node10` resolution mode that TypeScript 7 removed.

## Installation

```
npx install-peerdeps --dev @edx/typescript-config
```

This will install the package and all of its peer dependencies.

## Usage

Create file in repository `tsconfig.json`, with a clause `"extends": "@edx/typescript-config"`, adding references to the root directory, output directory, and directories to include/exclude in TypeScript compilation.

```Sample json
{
  "extends": "@edx/typescript-config",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

Note that `rootDir` is no longer optional when you emit output: as of TypeScript 6,
the compiler errors with `TS5011` if it has to infer the common source directory.

## Development

```
npm ci
npm test
```

`npm test` type-checks the fixtures in [test/](test/) against the installed TypeScript.
Those fixtures model an Open edX frontend — the `react-jsx` transform, webpack-style
SCSS imports, `paths` aliases and a plain `.js` file alongside TypeScript — so the
suite catches changes to this config that would break apps like
[frontend-app-authoring](https://github.com/openedx/frontend-app-authoring).

`test/errors/` is a deliberately broken fixture, and the suite asserts that each
strictness option in this config reports its specific error code. Without it, a config
that quietly turned strictness off would still pass. If you change a compiler option,
update `EXPECTED_ERROR_CODES` in [scripts/run-tests.mjs](scripts/run-tests.mjs) to match.

CI runs the suite against every supported TypeScript major. Local development installs
TypeScript 6, which is the version the Open edX frontend toolchain is currently happy
with; TypeScript 7 is supported and covered by CI, so run `npm install --no-save
typescript@7 && npm test` to check it locally.
