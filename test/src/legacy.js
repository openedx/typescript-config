// Plain JavaScript, type-checked only loosely: `allowJs` is on but `checkJs` is not.
// Open edX frontends still have plenty of these alongside their TypeScript.
export function legacyHelper(value) {
  return String(value).toUpperCase();
}
