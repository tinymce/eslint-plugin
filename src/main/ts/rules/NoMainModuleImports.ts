import { Rule } from 'eslint';
import { isMainImport } from '../utils/ImportUtils';
import { isPathInMain } from '../utils/PathUtils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';

export const noMainModuleImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows importing things directly from the Main module within src/main.'
    },
    messages: {
      noMainImport: 'Direct import to Main module is forbidden.'
    }
  },
  create: context => {
    if (isPathInMain(context.getFilename())) {
      return {
        ImportDeclaration: node => {
          if (isMainImport(extractModuleSpecifier(node))) {
            context.report({
              node,
              messageId: 'noMainImport',
            });
          }
        }
      };
    } else {
      return {};
    }
  }
};