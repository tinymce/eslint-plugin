import { Linter } from 'eslint';
import stylistic from '@stylistic/eslint-plugin';

// Default rules listed here: https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts#L32
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

    ...stylisticRules.rules,
    '@stylistic/array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
    '@stylistic/func-call-spacing': 'error',
    '@stylistic/no-multi-spaces': [ 'error', { ignoreEOLComments: true }],
    '@stylistic/object-curly-spacing': [ 'error', 'always', { objectsInObjects: false }],
    '@stylistic/operator-linebreak': [ 'error', 'after' ],
    '@stylistic/switch-colon-spacing': 'error',

    '@stylistic/comma-dangle': 'off',
    '@stylistic/eol-last': 'off',
    '@stylistic/no-mixed-operators': 'off',
    // Continue using default max-len option to avoid changing too many files that
    // have max-len ignore comments
    '@stylistic/max-len': 'off',

    // Consier removing
    '@stylistic/indent-binary-ops': 'off',
  },
  reportUnusedDisableDirectives: true
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
