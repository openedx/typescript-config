// Every line below MUST fail to compile. `scripts/run-tests.mjs` asserts that each
// listed error code is reported, which is what proves the strictness options in the
// shared config are actually in effect. Keep the codes in the script in sync.
import { Card, type CardProps } from '../src/Card';

// TS2322: `strict` type checking of a JSX prop.
export const wrongPropType = <Card title={42} />;

// TS2741: `title` is required.
export const missingProp = <Card />;

// TS6133: `noUnusedParameters`.
export function unusedParameter(used: string, unused: string): string {
  return used;
}

// TS18048: `strictNullChecks`, via `strict`.
export function possiblyNull(props: CardProps): number {
  return props.units.length;
}

// TS7029: `noFallthroughCasesInSwitch`.
export function fallthrough(kind: 'a' | 'b'): string {
  switch (kind) {
    case 'a':
      const first = 'first';
    case 'b':
      return 'second';
    default:
      return 'none';
  }
}
