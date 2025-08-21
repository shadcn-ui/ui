import prettierConfig from 'eslint-config-prettier';
import onlyWarnPlugin from 'eslint-plugin-only-warn';
import turboPlugin from 'eslint-plugin-turbo';

/** @type {import("eslint").Linter.Config} */
export default [
  prettierConfig,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    plugins: {
      onlyWarn: onlyWarnPlugin,
    },
  },
  {
    ignores: ['dist/**'],
  },
];
