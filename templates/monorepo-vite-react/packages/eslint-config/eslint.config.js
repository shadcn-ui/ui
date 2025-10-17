import tanstackQueryConfig from './eslint-tanstack-query-config.js';
import turboConfig from './eslint-turbo-config.js';
import uiConfig from './eslint-ui-config.js';
import viteConfig from './eslint-vite-config.js';

/** @type {import("eslint").Linter.Config} */
export default [...turboConfig, ...viteConfig, ...tanstackQueryConfig, ...uiConfig];
