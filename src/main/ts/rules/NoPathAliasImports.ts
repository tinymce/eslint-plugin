import { Rule } from 'eslint';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { isInternalPathAlias } from '../utils/ImportUtils';
import { isPathInMain } from '../utils/PathUtils';

export const noPathAliasImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows importing things using path aliases within src/main.'
    },
    messages: {
      noPathAliasImport: 'Imports with path aliases within src/main is forbidden.'
    }
  },
  create: (context) => {
    if (isPathInMain(context.getFilename())) {
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
};