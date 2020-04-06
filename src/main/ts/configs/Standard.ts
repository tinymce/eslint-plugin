import { Linter } from 'eslint';

export const base: Linter.Config = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'prefer-arrow',
  ],
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': [ 'error', { accessibility: 'explicit' }],
    '@typescript-eslint/indent': [ 'error', 2, {
      FunctionDeclaration: { parameters: 'first' },
      FunctionExpression: { parameters: 'first' },
      SwitchCase: 1
    }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': [ 'error', {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false }
    }],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': [ 'error', { ignoreParameters: true, ignoreProperties: true }],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-vars': [ 'warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    '@typescript-eslint/quotes': [ 'error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/semi': [ 'error', 'always' ],
    '@typescript-eslint/unified-signatures': 'error',
    'array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
    'arrow-body-style': 'error',
    'arrow-parens': [ 'error', 'always' ],
    'comma-dangle': 'off',
    'complexity': 'off',
    'constructor-super': 'error',
    'curly': 'error',
    'dot-notation': 'error',
    'eol-last': 'off',
    'eqeqeq': [ 'error', 'smart' ],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
    'import/order': 'off',
    'max-classes-per-file': [ 'error', 1 ],
    'max-len': 'off',
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-fallthrough': 'off',
    'no-invalid-this': 'off',
    'no-multiple-empty-lines': 'error',
    'no-new-wrappers': 'error',
    'no-shadow': [ 'error', { hoist: 'all' }],
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'object-curly-spacing': [ 'error', 'always', { objectsInObjects:  false }],
    'object-shorthand': 'error',
    'one-var': [ 'error', 'never' ],
    'prefer-arrow/prefer-arrow-functions': 'off',
    'quote-props': [ 'error', 'consistent-as-needed' ],
    'radix': 'error',
    'space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' }],
    'spaced-comment': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off'
  }
};

export const standard: Linter.Config = {
  extends: base.extends,
  plugins: [
    ...(base.plugins as string[]),
    '@tinymce', // means @tinymce/eslint-plugin (see https://eslint.org/docs/user-guide/configuring#naming-convention )
  ],
  rules: {
    ...base.rules,
    '@tinymce/no-direct-imports': 'error',
    '@tinymce/no-enums-in-export-specifier': 'error',
    '@tinymce/no-main-module-imports': 'error',
    '@tinymce/no-path-alias-imports': 'error',
    '@tinymce/no-unimported-promise': 'error',
  }
};