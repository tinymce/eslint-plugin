import { ESLintUtils } from '@typescript-eslint/utils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { isInternalPathAlias, isPublicApiImport } from '../utils/ImportUtils';
import { isPathInDemo, isPathInMain, normalizeFilePath } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

const mainPathValidator = isPublicApiImport;

const genericPathValidator = (path: string) => isPublicApiImport(path) && isInternalPathAlias(path);

export const noPublicApiModuleImports = createRule({
  name: 'no-public-api-module-imports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows importing things directly from the PublicApi module outside demos.'
    },
    messages: {
      noPublicApiImport: 'Direct import to PublicApi module is forbidden outside demos.'
    },
    schema: []
  },
  create: (context) => {
    const filename = normalizeFilePath(context.filename);
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
});
