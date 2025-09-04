import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // side effects
            ['^react$', '^@(?!workspace|repo)\\w', '^\\w'], // externals
            ['^@(?:workspace|repo)/(.*)$'], // monorepo scopes
            ['^@/(.*)$', '^\\./', '^\\../'], // aliases + relatives
            ['^.+\\.(css|scss|sass|less)$'], // styles
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
