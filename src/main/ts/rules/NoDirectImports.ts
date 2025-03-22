import { ESLintUtils } from '@typescript-eslint/utils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { isInternalLibModule, isInternalSrcModule } from '../utils/ImportUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const noDirectImports = createRule({
  name: 'no-direct-imports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows deep lib imports directly to a file within a @ephox, @tiny or @tinymce package.'
    },
    messages: {
      noDirectImport: 'Direct import to {{ moduleSpecifier }} is forbidden.'
    },
    schema: []
  },
  create: (context) => ({
    ImportDeclaration: (node) => {
      const moduleSpecifier = extractModuleSpecifier(node);
      if (isInternalLibModule(moduleSpecifier) || isInternalSrcModule(moduleSpecifier)) {
        context.report({
          node,
          messageId: 'noDirectImport',
          data: { moduleSpecifier },
        });
      }
    }
  })
});
