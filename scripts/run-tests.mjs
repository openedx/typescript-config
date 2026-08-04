#!/usr/bin/env node
// Type-checks the fixtures in test/ against whichever TypeScript version is
// installed. This package ships nothing but a tsconfig.json, so "the tests" are:
//
//   1. a realistic MFE fixture must type-check and emit cleanly, and
//   2. a deliberately broken fixture must produce the errors the config promises.
//
// Check 2 is the important one: without it, a config that silently disabled every
// strictness option would still pass check 1.

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

// TypeScript 7 hides `./bin/tsc` behind its `exports` map, so resolve the binary
// through package.json (which both TypeScript 6 and 7 export) instead.
const tsPackageJsonPath = require.resolve('typescript/package.json');
const tsPackageJson = require(tsPackageJsonPath);
const tsc = resolve(dirname(tsPackageJsonPath), tsPackageJson.bin.tsc);

// Error codes the negative fixture must trigger, one per strictness option that
// would otherwise be untested. See test/errors/strictness.tsx.
const EXPECTED_ERROR_CODES = [
  'TS2322', // strict: wrong JSX prop type
  'TS2741', // strict: missing required prop
  'TS6133', // noUnusedParameters
  'TS18048', // strictNullChecks (via strict)
  'TS7029', // noFallthroughCasesInSwitch
];

let failures = 0;

function runTsc(args) {
  const result = spawnSync(process.execPath, [tsc, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function pass(name) {
  console.log(`  ok  ${name}`);
}

function fail(name, detail) {
  failures += 1;
  console.error(`  FAIL  ${name}`);
  if (detail) {
    console.error(detail.split('\n').map((line) => `        ${line}`).join('\n'));
  }
}

console.log(`typescript ${tsPackageJson.version}\n`);

// 1. The valid fixture must type-check with no diagnostics at all.
{
  const name = 'valid fixture type-checks';
  const { status, output } = runTsc(['--noEmit', '-p', 'test/tsconfig.json']);
  if (status === 0 && output.trim() === '') {
    pass(name);
  } else {
    fail(name, output.trim() || `tsc exited with status ${status}`);
  }
}

// 2. The valid fixture must also emit: declaration + sourceMap output is part of
// what this config promises, and emit-only errors such as TS5011 (rootDir) do not
// show up under --noEmit.
{
  const name = 'valid fixture emits js, sourcemaps and declarations';
  const outDir = mkdtempSync(join(tmpdir(), 'edx-tsconfig-'));
  try {
    const { status, output } = runTsc(['-p', 'test/tsconfig.json', '--outDir', outDir]);
    if (status !== 0 || output.trim() !== '') {
      fail(name, output.trim() || `tsc exited with status ${status}`);
    } else {
      const missing = ['src/Card.js', 'src/Card.js.map', 'src/Card.d.ts']
        .filter((file) => !existsSync(join(outDir, file)));
      if (missing.length > 0) {
        fail(name, `missing expected output: ${missing.join(', ')}`);
      } else {
        pass(name);
      }
    }
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

// 3. The broken fixture must report every promised error.
{
  const name = 'broken fixture reports the expected errors';
  const { status, output } = runTsc(['-p', 'test/tsconfig.errors.json']);
  if (status === 0) {
    fail(name, 'expected type errors, but tsc succeeded');
  } else {
    const missing = EXPECTED_ERROR_CODES.filter((code) => !output.includes(code));
    if (missing.length > 0) {
      fail(name, `these errors were never reported: ${missing.join(', ')}\n\n${output.trim()}`);
    } else {
      pass(name);
    }
  }
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
