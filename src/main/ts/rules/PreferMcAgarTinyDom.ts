import { Rule } from 'eslint';
import { CallExpression } from 'estree';
import { isEditorFunction } from '../utils/EditorUtils';
import { extractIdentifier, extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInTest } from '../utils/PathUtils';

const createTinyDomFixer = (node: CallExpression, type: string) => (fixer: Rule.RuleFixer): Rule.Fix => {
  const editorApiCall = node.arguments[0] as CallExpression;
  const editorVar = extractIdentifier(editorApiCall.callee)?.name as string;
  return fixer.replaceText(node, `TinyDom.${type}(${editorVar})`);
};

const extractTinyDomCall = (node: CallExpression) => {
  const callee = node.callee;
  if (callee.type === 'MemberExpression' && node.arguments.length === 1) {
    const [ object, property ] = extractMemberIdentifiers(callee);
    if (object?.name === 'SugarElement' && property?.name === 'fromDom') {
      const firstArg = node.arguments[0];
      if (firstArg.type === 'CallExpression') {
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

export const preferMcAgarTinyDom: Rule.RuleModule = {
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
    fixable: 'code'
  },
  create: (context) => {
    const report = (func: CallExpression, messageId: string, fix?: (fixer: Rule.RuleFixer) => Rule.Fix) => {
      context.report({
        node: func,
        messageId,
        fix
      });
    };

    if (isPathInTest(context.getFilename())) {
      return {
        CallExpression: (node) => {
          if (node.type === 'CallExpression') {
            const tinyDomCall = extractTinyDomCall(node);
            if (tinyDomCall !== null) {
              const messageId = 'preferTinyDom' + tinyDomCall.charAt(0).toUpperCase() + tinyDomCall.slice(1);
              report(node, messageId, createTinyDomFixer(node, tinyDomCall));
            }
          }
        }
      };
    } else {
      return {};
    }
  }
};