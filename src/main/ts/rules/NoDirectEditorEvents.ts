import { Rule } from 'eslint';
import { isEditorMemberExpression } from '../utils/EditorUtils';
import { extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInDemo, isPathInTest } from '../utils/PathUtils';

export const noDirectEditorEvents: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows editor events from being dispatched outside api/Events.ts.'
    },
    messages: {
      noDirectEditorEvents: 'Dispatching events is forbidden outside api/Events.ts.',
    }
  },
  create: (context) => {
    const filename = context.getFilename();
    // Ignore in tests, demos or Events.ts
    // NOTE: To allow for some legacy setups we currently only enforce `Events.ts` instead of `api/Events.ts`
    if (isPathInTest(filename) || isPathInDemo(filename) || filename.match(/[\/\\]Events\.ts$/)) {
      return {};
    } else {
      return {
        CallExpression: (node) => {
          const callee = node.callee;
          if (callee.type === 'MemberExpression' && isEditorMemberExpression(callee)) {
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
};