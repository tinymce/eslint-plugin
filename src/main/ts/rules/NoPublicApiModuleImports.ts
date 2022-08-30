import { Rule } from 'eslint';
import { isInternalPathAlias, isPublicApiImport } from '../utils/ImportUtils';
import { isPathInDemo, isPathInMain, normalizeFilePath } from '../utils/PathUtils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';

const mainPathValidator = isPublicApiImport;

const genericPathValidator = (path: string) => isPublicApiImport(path) && isInternalPathAlias(path);

export const noPublicApiModuleImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows importing things directly from the PublicApi module outside demos.'
    },
    messages: {
      noPublicApiImport: 'Direct import to PublicApi module is forbidden outside demos.'
    }
  },
  create: (context) => {
    const filename = normalizeFilePath(context.getFilename());
    // Demo files are the sole location we want to allow
    if (isPathInDemo(filename)) {
      return {};
    } else {
      const validator = isPathInMain(filename) ? mainPathValidator : genericPathValidator;
      return {
        ImportDeclaration: (node) => {
          const moduleSpecifier = extractModuleSpecifier(node);
          if (validator(moduleSpecifier)) {
            context.report({
              node,
              messageId: 'noPublicApiImport'
            });
          }
        }
      };
    }
  }
};