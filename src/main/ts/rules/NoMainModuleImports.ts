import { Rule } from 'eslint';
import { isInternalPathAlias, isMainImport } from '../utils/ImportUtils';
import { isPathInMain } from '../utils/PathUtils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';

const mainPathValidator = isMainImport;

const genericPathValidator = (path: string) => isMainImport(path) && isInternalPathAlias(path);

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
  create: (context) => {
    const filename = context.getFilename();
    const validator = isPathInMain(filename) ? mainPathValidator : genericPathValidator;
    return {
      ImportDeclaration: (node) => {
        const moduleSpecifier = extractModuleSpecifier(node);
        if (validator(moduleSpecifier)) {
          context.report({
            node,
            messageId: 'noMainImport',
          });
        }
      }
    };
  }
};