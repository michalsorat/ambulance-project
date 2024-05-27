import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ambulance-project',
  globalScript: 'src/global/app.ts',
  testing: {
    transformIgnorePatterns: ["/node_modules/(?!axios)"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
