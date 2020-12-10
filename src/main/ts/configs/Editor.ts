import { Linter } from 'eslint';
import { standard } from './Standard';

export const editor: Linter.Config = {
  extends: standard.extends,
  plugins: standard.plugins,
  rules: {
    ...standard.rules,

    '@typescript-eslint/explicit-module-boundary-types': [ 'error', { allowArgumentsExplicitlyTypedAsAny: true }],
    '@typescript-eslint/comma-dangle': [ 'error', {
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'never',
      enums: 'never',
      generics: 'never',
      tuples: 'never'
    }],
    'arrow-body-style': 'off', // Disabled as it causes readability issues in more complex cases
    'import/order': [ 'error', {
      groups: [ 'builtin', 'external', 'internal', 'parent', 'sibling', 'index' ],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],

    // Disabled since we're using the typescript-eslint rule
    'comma-dangle': 'off',
  },
  settings: {
    'import/internal-regex': '^(ephox|tinymce|tiny-premium)/.*'
  }
};