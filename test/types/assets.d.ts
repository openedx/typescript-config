// Open edX MFEs import stylesheets and images through webpack loaders. Consumers
// declare these modules themselves; the fixture does the same so that the asset
// imports below resolve the way they do in a real frontend app.
declare module '*.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
