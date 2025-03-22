import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { isEditorMemberExpression } from '../utils/EditorUtils';
import { extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInDemo, isPathInTest, normalizeFilePath } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const noDirectEditorEvents = createRule({
  name: 'no-direct-editor-events',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows editor events from being dispatched outside api/Events.ts.'
    },
    messages: {
      noDirectEditorEvents: 'Dispatching events is forbidden outside api/Events.ts.',
    },
    schema: []
  },
  create: (context) => {
    const filename = normalizeFilePath(context.filename);
    // Ignore in tests, demos or Events.ts
    // NOTE: To allow for some legacy setups we currently only enforce `Events.ts` instead of `api/Events.ts`
    if (isPathInTest(filename) || isPathInDemo(filename) || filename.endsWith('/Events.ts')) {
      return {};
    } else {
      return {
        CallExpression: (node) => {
          const callee = node.callee;
          if (callee.type === TSESTree.AST_NODE_TYPES.MemberExpression && isEditorMemberExpression(callee)) {
            const identifiers = extractMemberIdentifiers(callee);
            if (identifiers[1]?.name === 'dispatch' || identifiers[1]?.name === 'fire') {
              context.report({
                node,
                messageId: 'noDirectEditorEvents'
              });
            }
          }
        }
      };
    }
  }
});
