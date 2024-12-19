import { Linter } from 'eslint';
import stylistic from '@stylistic/eslint-plugin';

const stylisticRules = stylistic.configs.customize({
  arrowParens: true,
  blockSpacing: true,
  braceStyle: '1tbs',
  commaDangle: 'only-multiline',
  flat: false,
  quoteProps: 'consistent-as-needed',
  indent: 2,
  quotes: 'single',
  semi: true,
  jsx: true,
});

export const base: Linter.Config = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@stylistic/disable-legacy'
  ],
  plugins: [
    '@typescript-eslint',
    '@stylistic',
    'import',
    'mocha',
    'prefer-arrow'
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
      argsIgnorePattern: '^_',
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

    'arrow-body-style': 'error',
    'complexity': 'off',
    'constructor-super': 'error',
    'curly': 'error',
    'dot-notation': 'error',
    'eqeqeq': [ 'error', 'smart' ],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
    'max-classes-per-file': [ 'error', 1 ],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-identical-title': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-fallthrough': 'error',
    'no-invalid-this': 'off',
    'no-nested-ternary': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': [ 'error', { allowTernary: true }],
    'no-unused-labels': 'error',
    'object-shorthand': 'error',
    'one-var': [ 'error', 'never' ],
    'prefer-arrow-callback': 'off', // Covered by prefer-arrow-functions
    'prefer-arrow/prefer-arrow-functions': 'error',
    'radix': 'error',
    'use-isnan': 'error',

    ...stylisticRules.rules,
    '@stylistic/eol-last': 'off',
    '@stylistic/array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
    '@stylistic/operator-linebreak': [ 'error', 'after' ],
    '@stylistic/no-mixed-operators': 'off',
    '@stylistic/max-len': [ 'warn', 160 ],
    // '@stylistic/comma-dangle': 'off',
    // '@stylistic/brace-style': 'error',
    // '@stylistic/comma-spacing': 'error',
    // '@stylistic/func-call-spacing': 'error',
    // '@stylistic/indent': [ 'error', 2, {
    //   FunctionDeclaration: { parameters: 'first' },
    //   FunctionExpression: { parameters: 'first' },
    //   SwitchCase: 1
    // }],
    // '@stylistic/keyword-spacing': 'error',
    // '@stylistic/member-delimiter-style': [ 'error', {
    //   multiline: { delimiter: 'semi', requireLast: true },
    //   singleline: { delimiter: 'semi', requireLast: false },
    // }],
    // '@stylistic/semi': [ 'error', 'always' ],
    // '@stylistic/space-before-blocks': 'error',
    // '@stylistic/space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' }],
    // '@stylistic/space-infix-ops': 'error',
    // '@stylistic/object-curly-spacing': [ 'error', 'always', { objectsInObjects: false }],
    // '@stylistic/quotes': [ 'error', 'single', { allowTemplateLiterals: true }],
    // '@stylistic/type-annotation-spacing': 'error',
    // '@stylistic/rest-spread-spacing': 'error',
    // '@stylistic/semi-spacing': 'error',
    // '@stylistic/spaced-comment': 'error',
    // '@stylistic/space-unary-ops': 'error',
    // '@stylistic/switch-colon-spacing': 'error',
    // '@stylistic/template-curly-spacing': 'error',
    // '@stylistic/quote-props': [ 'error', 'consistent-as-needed' ],
    // '@stylistic/no-whitespace-before-property': 'error',
    // '@stylistic/no-multi-spaces': [ 'error', { ignoreEOLComments: true }],
    // '@stylistic/no-multiple-empty-lines': [ 'error', { max: 1 }],
    // '@stylistic/max-len': [ 'warn', 160 ],
    // '@stylistic/key-spacing': [ 'error', { beforeColon: false, afterColon: true, mode: 'strict' }],
    // '@stylistic/dot-location': [ 'error', 'property' ],
    // '@stylistic/arrow-parens': [ 'error', 'always' ],
    // '@stylistic/arrow-spacing': 'error',
    // '@stylistic/comma-dangle': 'off',
    // '@stylistic/computed-property-spacing': 'error',
    // '@stylistic/new-parens': 'error',
    // '@stylistic/array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
    // '@stylistic/no-trailing-spaces': 'error',

    'import/order': 'off',
    'import/no-duplicates': 'error'
  },
  reportUnusedDisableDirectives: true,
};

export const standard: Linter.Config = {
  extends: base.extends,
  plugins: [
    ...(base.plugins!),
    '@tinymce' // means @tinymce/eslint-plugin (see https://eslint.org/docs/user-guide/configuring#naming-convention )
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
