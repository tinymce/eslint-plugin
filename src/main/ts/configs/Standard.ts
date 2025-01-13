import { Linter } from 'eslint';

export const base: Linter.Config = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    '@stylistic',
    'import',
    'mocha',
    'prefer-arrow',
  ],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'explicit' },
    ],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'typeLike', format: [ 'PascalCase' ] },
    ],
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true, ignoreProperties: true },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': [ 'error', { hoist: 'all' }],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowTernary: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/parameter-properties': 'error',
    '@typescript-eslint/unified-signatures': 'error',

    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',

    // TODO: Enable once we no longer support IE 11
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',

    // TODO: Investigate if these rules should be enabled
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // Needs StrictNullChecks
    '@typescript-eslint/no-unnecessary-type-assertion': 'off', // to be investigated, produces different results on a uncompiled environment
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off', // Needs StrictNullChecks
    '@typescript-eslint/switch-exhaustiveness-check': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',

    'arrow-body-style': 'error',
    'curly': 'error',
    'dot-notation': 'error',
    'eqeqeq': [ 'error', 'smart' ],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
    'max-classes-per-file': [ 'error', 1 ],
    'max-len': [ 'warn', 160 ],
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': 'error',
    'no-eval': 'error',
    'no-nested-ternary': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'object-shorthand': 'error',
    'one-var': [ 'error', 'never' ],
    'radix': 'error',

    'complexity': 'off',
    'no-invalid-this': 'off',
    'valid-typeof': 'off', // Disabled as it's handled by TypeScript

    // Consider allowing from eslint recommended rules
    'no-case-declarations': 'off',
    'no-control-regex': 'off',
    'no-misleading-character-clas': 'off',
    'no-prototype-builtins': 'off',
    'no-useless-escape': 'off',

    'import/no-duplicates': 'error',
    'import/order': 'off',

    'prefer-arrow-callback': 'off', // Covered by prefer-arrow-functions
    'prefer-arrow/prefer-arrow-functions': 'error',

    'mocha/no-exclusive-tests': 'error',
    'mocha/no-identical-title': 'error',

    '@stylistic/array-bracket-spacing': [
      'error',
      'always',
      { objectsInArrays: false, arraysInArrays: false },
    ],
    '@stylistic/arrow-parens': [ 'error', 'always' ],
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/brace-style': 'error',
    '@stylistic/comma-spacing': 'error',
    '@stylistic/computed-property-spacing': 'error',
    '@stylistic/dot-location': [ 'error', 'property' ],
    '@stylistic/func-call-spacing': 'error',
    '@stylistic/indent': [
      'error',
      2,
      {
        FunctionDeclaration: { parameters: 'first' },
        FunctionExpression: { parameters: 'first' },
        SwitchCase: 1,
      },
    ],
    '@stylistic/key-spacing': [
      'error',
      { beforeColon: false, afterColon: true, mode: 'strict' },
    ],
    '@stylistic/keyword-spacing': 'error',
    '@stylistic/member-delimiter-style': [
      'error',
      {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
      },
    ],
    '@stylistic/new-parens': 'error',
    '@stylistic/no-multi-spaces': [ 'error', { ignoreEOLComments: true }],
    '@stylistic/no-multiple-empty-lines': [ 'error', { max: 1 }],
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/object-curly-spacing': [
      'error',
      'always',
      { objectsInObjects: false },
    ],
    '@stylistic/quote-props': [ 'error', 'consistent-as-needed' ],
    '@stylistic/quotes': [ 'error', 'single', { allowTemplateLiterals: true }],
    '@stylistic/rest-spread-spacing': 'error',
    '@stylistic/semi-spacing': 'error',
    '@stylistic/semi': [ 'error', 'always' ],
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never' },
    ],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-unary-ops': 'error',
    '@stylistic/spaced-comment': 'error',
    '@stylistic/switch-colon-spacing': 'error',
    '@stylistic/template-curly-spacing': 'error',
    '@stylistic/type-annotation-spacing': 'error',

    '@stylistic/comma-dangle': 'off',
    '@stylistic/eol-last': 'off',
    // Continue using default max-len option to avoid changing too many files that
    // have max-len ignore comments
    '@stylistic/max-len': 'off',
  },
};

export const standard: Linter.Config = {
  extends: base.extends,
  plugins: [
    ...(base.plugins as string[]),
    '@tinymce', // means @tinymce/eslint-plugin (see https://eslint.org/docs/user-guide/configuring#naming-convention )
  ],
  rules: {
    ...base.rules,
    '@tinymce/no-direct-editor-events': 'off',
    '@tinymce/no-direct-editor-options': 'off',
    '@tinymce/no-direct-imports': 'error',
    '@tinymce/no-enums-in-export-specifier': 'error',
    '@tinymce/no-main-module-imports': 'error',
    '@tinymce/no-path-alias-imports': 'error',
    '@tinymce/no-publicapi-module-imports': 'error',
    '@tinymce/no-unimported-promise': 'off',
    '@tinymce/no-implicit-dom-globals': 'error',
    '@tinymce/prefer-fun': 'error',
    '@tinymce/prefer-mcagar-tiny-assertions': 'off',
    '@tinymce/prefer-mcagar-tiny-dom': 'off',
  },
};
