import { ESLintUtils } from '@typescript-eslint/utils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { isInternalPathAlias } from '../utils/ImportUtils';
import { isPathInMain } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const noPathAliasImports = createRule({
  name: 'no-path-alias-imports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows importing things using path aliases within src/main.'
    },
    messages: {
      noPathAliasImport: 'Imports with path aliases within src/main is forbidden.'
    },
    schema: [],
  },
  create: (context) => {
    if (isPathInMain(context.filename)) {
      return {
        ImportDeclaration: (node) => {
          if (isInternalPathAlias(extractModuleSpecifier(node))) {
            context.report({
              node,
              messageId: 'noPathAliasImport',
            });
          }
        }
      };
    } else {
      return {};
    }
  }
});
