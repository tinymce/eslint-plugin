import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { isEditorMemberExpression } from '../utils/EditorUtils';
import { extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInDemo, isPathInTest, normalizeFilePath } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const noDirectEditorOptions = createRule({
  name: 'no-direct-editor-options',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows editor options from being registered or accessed outside api/Options.ts.'
    },
    messages: {
      noDirectEditorOption: 'Direct access to options is forbidden outside api/Options.ts.',
      noRegisterEditorOption: 'Registering options is forbidden outside api/Options.ts.'
    },
    schema: []
  },
  create: (context) => {
    const filename = normalizeFilePath(context.filename);
    // Ignore in tests, demos or Options.ts
    // NOTE: To allow for some legacy setups we currently only enforce `Options.ts` instead of `api/Options.ts`
    if (isPathInTest(filename) || isPathInDemo(filename) || filename.endsWith('/Options.ts')) {
      return {};
    } else {
      return {
        CallExpression: (node) => {
          const callee = node.callee;
          if (callee.type === TSESTree.AST_NODE_TYPES.MemberExpression && isEditorMemberExpression(callee)) {
            const identifiers = extractMemberIdentifiers(callee);
            if (identifiers[1]?.name === 'options' && identifiers[2]?.name === 'get' || identifiers[1]?.name === 'getParam') {
              context.report({
                node,
                messageId: 'noDirectEditorOption'
              });
            } else if (identifiers[1]?.name === 'options' && identifiers[2]?.name === 'register') {
              context.report({
                node,
                messageId: 'noRegisterEditorOption'
              });
            }
          }
        }
      };
    }
  }
});
