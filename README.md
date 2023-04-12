[![Build Status](https://github.com/openedx/typescript-config/actions/workflows/release.yml/badge.svg)](https://github.com/openedx/typescript-config/actions/workflows/release.yml/)
[![NPM Version](https://img.shields.io/npm/v/@edx/typescript-config.svg)](https://www.npmjs.com/package/@edx/typescript-config)
[![npm_downloads](https://img.shields.io/npm/dt/@edx/typescript-config.svg)](https://www.npmjs.com/package/@edx/tpyescript-config)
[![license](https://img.shields.io/npm/l/@edx/typescript-config.svg)](https://github.com/openedx/typescript-config/blob/main/LICENSE)
[![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# @edx/typescript-config

## About

The presence of a tsconfig.json file in a directory indicates that the directory is the root of a TypeScript project. The tsconfig.json file specifies the root files and the compiler options required to compile the project (from https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

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
