import { Linter } from 'eslint';

export const base: Linter.Config = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'mocha',
    'prefer-arrow',
  ],
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/comma-spacing': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': [ 'error', { accessibility: 'explicit' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': [ 'error', 2, {
      FunctionDeclaration: { parameters: 'first' },
      FunctionExpression: { parameters: 'first' },
      SwitchCase: 1
    }],
    '@typescript-eslint/keyword-spacing': 'error',
    '@typescript-eslint/member-delimiter-style': [ 'error', {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false }
    }],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: [ 'PascalCase' ]
      }
    ],
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-inferrable-types': [ 'error', { ignoreParameters: true, ignoreProperties: true }],
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-parameter-properties': 'error',
    '@typescript-eslint/no-shadow': [ 'error', { hoist: 'all' }],
    '@typescript-eslint/no-unused-vars': [ 'warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_'
    }],
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/quotes': [ 'error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/semi': [ 'error', 'always' ],
    '@typescript-eslint/space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' }],
    '@typescript-eslint/space-infix-ops': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',

    // TODO: Enable once we no longer support IE 11
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',

    // TODO: Investigate if these rules should be enabled
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // Needs StrictNullChecks
    '@typescript-eslint/no-unnecessary-type-assertion': 'off', // to be investigated, produces different results on a uncompiled environment
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off', // Needs StrictNullChecks

    'array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
    'arrow-body-style': 'error',
    'arrow-parens': [ 'error', 'always' ],
    'arrow-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': 'off',
    'complexity': 'off',
    'constructor-super': 'error',
    'curly': 'error',
    'dot-location': [ 'error', 'property' ],
    'dot-notation': 'error',
    'eol-last': 'off',
    'eqeqeq': [ 'error', 'smart' ],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
    'import/order': 'off',
    'key-spacing': [ 'error', { beforeColon: false, afterColon: true, mode: 'strict' }],
    'max-classes-per-file': [ 'error', 1 ],
    'max-len': [ 'warn', 160 ],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-identical-title': 'error',
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-fallthrough': 'error',
    'no-invalid-this': 'off',
    'no-multi-spaces': [ 'error', { ignoreEOLComments: true }],
    'no-multiple-empty-lines': [ 'error', { max: 1 }],
    'no-nested-ternary': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': [ 'error', { allowTernary: true }],
    'no-unused-labels': 'error',
    'object-curly-spacing': [ 'error', 'always', { objectsInObjects: false }],
    'object-shorthand': 'error',
    'one-var': [ 'error', 'never' ],
    'prefer-arrow-callback': 'off', // Covered by prefer-arrow-functions
    'prefer-arrow/prefer-arrow-functions': 'error',
    'quote-props': [ 'error', 'consistent-as-needed' ],
    'radix': 'error',
    'space-before-blocks': 'error',
    'spaced-comment': 'error',
    'space-unary-ops': 'error',
    'template-curly-spacing': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',  // Disabled as it's handled by TypeScript

    // Disabled since we're using the equivalent typescript-eslint rule
    'comma-spacing': 'off',
    'indent': 'off',
    'keyword-spacing': 'off',
    'no-duplicate-imports': 'off',
    'no-shadow': 'off',
    'space-before-function-paren': 'off',
    'space-infix-ops': 'off',
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
    '@tinymce/no-unimported-promise': 'off',
    '@tinymce/no-implicit-dom-globals': 'error',
    '@tinymce/prefer-fun': 'error',
    '@tinymce/prefer-mcagar': 'off',
  }
};