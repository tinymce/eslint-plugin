import { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import { base } from '../configs/Standard.mjs';
import { noDirectEditorEvents } from '../rules/NoDirectEditorEvents.js';
import { noDirectEditorOptions } from '../rules/NoDirectEditorOptions.js';
import { noDirectImports } from '../rules/NoDirectImports.js';
import { noEnumsInExportSpecifier } from '../rules/NoEnumsInExportSpecifier.js';
import { noImplicitDomGlobals } from '../rules/NoImplicitDomGlobals.js';
import { noMainModuleImports } from '../rules/NoMainModuleImports.js';
import { noPathAliasImports } from '../rules/NoPathAliasImports.js';
import { noPublicApiModuleImports } from '../rules/NoPublicApiModuleImports.js';
import { preferFun } from '../rules/PreferFun.js';
import { preferMcAgarTinyAssertions } from '../rules/PreferMcAgarTinyAssertions.js';
import { preferMcAgarTinyDom } from '../rules/PreferMcAgarTinyDom.js';

import tseslint from 'typescript-eslint';

const rules = {
  'no-direct-editor-events': noDirectEditorEvents,
  'no-direct-editor-options': noDirectEditorOptions,
  'no-direct-imports': noDirectImports,
  'no-enums-in-export-specifier': noEnumsInExportSpecifier,
  'no-main-module-imports': noMainModuleImports,
  'no-path-alias-imports': noPathAliasImports,
  'no-publicapi-module-imports': noPublicApiModuleImports,
  'no-implicit-dom-globals': noImplicitDomGlobals,
  'prefer-fun': preferFun,
  'prefer-mcagar-tiny-assertions': preferMcAgarTinyAssertions,
  'prefer-mcagar-tiny-dom': preferMcAgarTinyDom
};

const configs: FlatConfig.SharedConfigs = {
  get standard() {
    return standard;
  },
  get editor() {
    return editor;
  }
};

const plugin: FlatConfig.Plugin = {
  rules,
  configs,
  meta: {
    name: '@tinymce/eslint-plugin',
    version: '2.4.1-rc'
  }
};

const standard = tseslint.config(
  base,
  {
    plugins: {
      '@tinymce': plugin
    },
    rules: {
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
  });

const editor = tseslint.config(
  standard,
  {
    rules: {

      '@tinymce/no-direct-editor-events': 'error',
      '@tinymce/no-direct-editor-options': 'error',
      '@tinymce/prefer-mcagar-tiny-assertions': 'error',
      '@tinymce/prefer-mcagar-tiny-dom': 'error',

      '@typescript-eslint/explicit-module-boundary-types': [ 'error', { allowArgumentsExplicitlyTypedAsAny: true }],
      '@stylistic/comma-dangle': [ 'error', {
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
      'import-x/order': [ 'error', {
        'newlines-between': 'always',
        'groups': [
          [ 'builtin', 'external' ],
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true
        }
      }],

      // Disabled since we're using the stylistic rule
      'comma-dangle': 'off',
    },
    settings: {
      'import-x/internal-regex': '^(ephox|tinymce|tiny-premium)/.*'
    }
  }
);

export default plugin;
