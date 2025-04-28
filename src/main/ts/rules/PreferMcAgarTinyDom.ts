import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { isEditorFunction } from '../utils/EditorUtils';
import { extractIdentifier, extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInTest } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

const createTinyDomFixer = (node: TSESTree.CallExpression, type: string) => (fixer: RuleFixer): RuleFix => {
  const editorApiCall = node.arguments[0] as TSESTree.CallExpression;
  const editorVar = extractIdentifier(editorApiCall.callee)?.name as string;
  return fixer.replaceText(node, `TinyDom.${type}(${editorVar})`);
};

const extractTinyDomCall = (node: TSESTree.CallExpression) => {
  const callee = node.callee;
  if (callee.type === TSESTree.AST_NODE_TYPES.MemberExpression && node.arguments.length === 1) {
    const [ object, property ] = extractMemberIdentifiers(callee);
    if (object?.name === 'SugarElement' && property?.name === 'fromDom') {
      const firstArg = node.arguments[0];
      if (firstArg.type === TSESTree.AST_NODE_TYPES.CallExpression) {
        if (isEditorFunction(firstArg, 'getBody')) {
          return 'body';
        } else if (isEditorFunction(firstArg, 'getDoc')) {
          return 'document';
        } else if (isEditorFunction(firstArg, 'getContainer')) {
          return 'container';
        } else if (isEditorFunction(firstArg, 'getContentAreaContainer')) {
          return 'contentAreaContainer';
        } else if (isEditorFunction(firstArg, 'getElement')) {
          return 'targetElement';
        }
      }
    }
  }

  return null;
};

type MessageId = 'preferTinyDomBody' | 'preferTinyDomDocument' | 'preferTinyDomContainer' | 'preferTinyDomContentAreaContainer' | 'preferTinyDomTargetElement';

export const preferMcAgarTinyDom = createRule({
  name: 'prefer-mcagar-tiny-dom',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using the McAgar TinyDom helper functions, instead of generic functions.'
    },
    messages: {
      preferTinyDomBody: 'Use `TinyDom.body` instead of manually converting the editor body to a Sugar element.',
      preferTinyDomDocument: 'Use `TinyDom.document` instead of manually converting the editor document to a Sugar element.',
      preferTinyDomContainer: 'Use `TinyDom.container` instead of manually converting the editor container to a Sugar element.',
      preferTinyDomContentAreaContainer: 'Use `TinyDom.contentAreaContainer` instead of manually converting the editor content area' +
        ' container to a Sugar element.',
      preferTinyDomTargetElement: 'Use `TinyDom.targetElement` instead of manually converting the editor target element to a Sugar element.',
    },
    fixable: 'code',
    schema: []
  },
  create: (context) => {
    const report = (func: TSESTree.CallExpression, messageId: MessageId, fix?: (fixer: RuleFixer) => RuleFix) => {
      context.report({
        node: func,
        messageId,
        fix
      });
    };

    if (isPathInTest(context.filename)) {
      return {
        CallExpression: (node) => {
          if (node.type === TSESTree.AST_NODE_TYPES.CallExpression) {
            const tinyDomCall = extractTinyDomCall(node);
            if (tinyDomCall !== null) {
              const messageId = 'preferTinyDom' + tinyDomCall.charAt(0).toUpperCase() + tinyDomCall.slice(1) as MessageId;
              report(node, messageId, createTinyDomFixer(node, tinyDomCall));
            }
          }
        }
      };
    } else {
      return {};
    }
  }
});
