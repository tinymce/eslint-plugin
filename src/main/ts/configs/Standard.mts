import stylisticPlugin from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import mochaPlugin from 'eslint-plugin-mocha';
import * as preferArrowPlugin from 'eslint-plugin-prefer-arrow-functions';
import tseslint from 'typescript-eslint';

// c.f: https://github.com/typescript-eslint/examples/blob/main/packages/eslint-plugin-example-typed-linting/eslint.config.mjs
export const base = tseslint.config(
  tseslint.configs.recommendedTypeChecked,
  // tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      '@stylistic': stylisticPlugin,
      'import-x': importPlugin,
      'mocha': mochaPlugin,
      'prefer-arrow-functions': {
        meta: preferArrowPlugin.meta,
        rules: preferArrowPlugin.rules,
      },
    },
    rules: {
      'consistent-this': [ 'error', 'self' ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-types': 'off',
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-spacing': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': [ 'error', { accessibility: 'explicit' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@stylistic/func-call-spacing': 'error',
      // The indent rule is broken on ts code bases. C.f: https://github.com/typescript-eslint/typescript-eslint/issues/1824
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
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      '@stylistic/object-curly-spacing': [ 'error', 'always', { objectsInObjects: false }],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@stylistic/quotes': [ 'error', 'single', { allowTemplateLiterals: true }],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@stylistic/semi': [ 'error', 'always' ],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' }],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/type-annotation-spacing': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: false
        }
      ],
      // TODO: Look at setting all exhaustive-check options to false to be stricter
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          considerDefaultExhaustiveForUnions: true
        }
      ],

      // TODO: Enable once we no longer support IE 11
      '@typescript-eslint/prefer-includes': 'off',
      '@typescript-eslint/prefer-string-starts-ends-with': 'off',

      // TODO: Investigate if these rules should be enabled
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
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-base-to-string': 'off',

      '@stylistic/array-bracket-spacing': [ 'error', 'always', { objectsInArrays: false, arraysInArrays: false }],
      'arrow-body-style': 'error',
      '@stylistic/arrow-parens': [ 'error', 'always' ],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/comma-dangle': 'off',
      'complexity': 'off',
      '@stylistic/computed-property-spacing': 'error',
      'constructor-super': 'error',
      'curly': 'error',
      '@stylistic/dot-location': [ 'error', 'property' ],
      'dot-notation': 'error',
      '@stylistic/eol-last': 'off',
      'eqeqeq': [ 'error', 'smart' ],
      'guard-for-in': 'error',
      'id-blacklist': 'error',
      'id-match': 'error',
      'import-x/order': 'off',
      '@stylistic/key-spacing': [ 'error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      'max-classes-per-file': [ 'error', 1 ],
      'max-len': [ 'warn', 160 ],
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-identical-title': 'error',
      '@stylistic/new-parens': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-fallthrough': 'error',
      'no-invalid-this': 'off',
      '@stylistic/no-multi-spaces': [ 'error', { ignoreEOLComments: true }],
      '@stylistic/no-multiple-empty-lines': [ 'error', { max: 1 }],
      'no-nested-ternary': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': 'error',
      'no-unsafe-finally': 'error',
      '@typescript-eslint/no-unused-expressions': [ 'error', { allowTernary: true }],
      'no-unused-labels': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      'object-shorthand': 'error',
      'one-var': [ 'error', 'never' ],
      'prefer-arrow-callback': 'off', // Covered by prefer-arrow-functions
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowedNames: [],
          allowNamedFunctions: false,
          allowObjectProperties: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false
        }
      ],
      '@stylistic/quote-props': [ 'error', 'consistent-as-needed' ],
      'radix': 'error',
      '@stylistic/rest-spread-spacing': 'error',
      '@stylistic/semi-spacing': 'error',
      '@stylistic/spaced-comment': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/switch-colon-spacing': 'error',
      '@stylistic/template-curly-spacing': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'off',  // Disabled as it's handled by TypeScript

      // Disabled since we're using the equivalent typescript-eslint rule
      'no-shadow': 'off',

      'import-x/no-duplicates': 'off',
      'no-duplicate-imports': 'error',
      // Continue using default max-len option to avoid changing too many files that
      // have max-len ignore comments
      '@stylistic/max-len': 'off'
    }
  });
