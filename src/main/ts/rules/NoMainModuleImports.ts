import { ESLintUtils } from '@typescript-eslint/utils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { isInternalPathAlias, isMainImport } from '../utils/ImportUtils';
import { isPathInMain, normalizeFilePath } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

const mainPathValidator = isMainImport;

const genericPathValidator = (path: string) => isMainImport(path) && isInternalPathAlias(path);

export const noMainModuleImports = createRule({
  name: 'no-main-module-imports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows importing things directly from the Main module within src/main.'
    },
    messages: {
      noMainImport: 'Direct import to Main module is forbidden.'
    },
    schema: [],
  },
  create: (context) => {
    const filename = normalizeFilePath(context.getFilename());
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
});
