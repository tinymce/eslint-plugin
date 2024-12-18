import { Linter } from 'eslint';

export const base: Linter.Config = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked'
  ],
  plugins: [
    '@typescript-eslint',
    '@stylistic',
    'import',
    'mocha',
    'prefer-arrow',
  ],
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': [ 'error', { accessibility: 'explicit' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: [ 'PascalCase' ]
      }
    ],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-inferrable-types': [ 'error', { ignoreParameters: true, ignoreProperties: true }],
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/parameter-properties': 'error',
    '@typescript-eslint/no-shadow': [ 'error', { hoist: 'all' }],
    '@typescript-eslint/no-unused-vars': [ 'warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_'
    }],
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/unified-signatures': 'error',

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
    'comma-dangle': 'off',
    'complexity': 'off',
    'computed-property-spacing': 'error',
    'constructor-super': 'error',
    'curly': 'error',
    'dot-location': [ 'error', 'property' ],
    'dot-notation': 'error',
    'eol-last': 'off',
    'eqeqeq': [ 'error', 'smart' ],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
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
    'no-whitespace-before-property': 'error',
    'object-shorthand': 'error',
    'one-var': [ 'error', 'never' ],
    'prefer-arrow-callback': 'off', // Covered by prefer-arrow-functions
    'prefer-arrow/prefer-arrow-functions': 'error',
    'quote-props': [ 'error', 'consistent-as-needed' ],
    'radix': 'error',
    'rest-spread-spacing': 'error',
    'semi-spacing': 'error',
    'spaced-comment': 'error',
    'space-unary-ops': 'error',
    'switch-colon-spacing': 'error',
    'template-curly-spacing': 'error',
    'use-isnan': 'error',

    '@stylistic/brace-style': 'error',
    '@stylistic/comma-spacing': 'error',
    '@stylistic/func-call-spacing': 'error',
    '@stylistic/indent': [ 'error', 2, {
      FunctionDeclaration: { parameters: 'first' },
      FunctionExpression: { parameters: 'first' },
      SwitchCase: 1
    }],
    '@stylistic/keyword-spacing': 'error',
    '@stylistic/member-delimiter-style': [ 'error', {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false }
    }],
    '@stylistic/semi': [ 'error', 'always' ],
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' }],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/object-curly-spacing': [ 'error', 'always', { objectsInObjects: false }],
    '@stylistic/quotes': [ 'error', 'single', { allowTemplateLiterals: true }],
    '@stylistic/type-annotation-spacing': 'error',

    'import/order': 'off',
    'import/no-duplicates': 'error',
  }
};

export const standard: Linter.Config = {
  extends: base.extends,
  plugins: [
    ...(base.plugins!),
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
  }
};
