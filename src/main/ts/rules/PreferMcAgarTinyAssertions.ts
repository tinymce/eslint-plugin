import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { RuleContext, RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { isEditorFunction } from '../utils/EditorUtils';
import { extractIdentifier, extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInTest } from '../utils/PathUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

/*
This regex is broken up to detect the following:
- assert.equal(editor.getContent(), expected)
- assert.deepEqual(editor.getContent(), expected)
- assert.equal(editor.getContent({ format: 'raw', param: value }), expected)
- assert.equal(editor.getBody().innerHTML, expected)

assert\.(?:equal|deepEqual)\(
  (\s*)(?:ed|editor)\.(?:getContent\(([^)]*)\)|getBody\(()\)\.innerHTML),
  (\s+[^\)]+?)(\s*)
\)
 */
const assertContentRegex = /assert\.(?:equal|deepEqual)\((\s*)(ed|editor)\.(?:getContent\(([^)]*)\)|getBody\(\)\.innerHTML),(\s+[^\)]+?)(\s*)\)/;

const createGetContentAssertFixer =
  (context: RuleContext<MessageId, readonly unknown[]>, node: TSESTree.CallExpression, raw: boolean) => (fixer: RuleFixer): RuleFix => {
    const sourceCode = context.sourceCode;
    const text = sourceCode.getText(node);
    const funcName = raw ? 'TinyAssertions.assertRawContent' : 'TinyAssertions.assertContent';
    const newText = text.replace(assertContentRegex, (_match, beforeWhitespace, editorVar, args, expectedText, afterWhitespace) => {
      const getContentArgs = args?.replace(/(\s*format: 'raw',?\s*)/, ' ');
      if (getContentArgs && getContentArgs !== '{ }') {
        const extraSpace = beforeWhitespace || ' ';
        return `${funcName}(${beforeWhitespace}${editorVar},${expectedText},${extraSpace}${getContentArgs}${afterWhitespace})`;
      } else {
        return `${funcName}(${beforeWhitespace}${editorVar},${expectedText}${afterWhitespace})`;
      }
    });
    return fixer.replaceText(node, newText);
  };

const isGetContentCall = (node: TSESTree.CallExpression, raw: boolean) => {
  if (isEditorFunction(node, 'getContent')) {
    if (!raw && node.arguments.length === 0) {
      // No args so must just be regular getContent call
      return true;
    } else {
      const firstArg = node.arguments[0];
      if (firstArg.type === TSESTree.AST_NODE_TYPES.ObjectExpression) {
        const format = firstArg.properties.find((prop): prop is TSESTree.Property =>
          prop.type === TSESTree.AST_NODE_TYPES.Property ? extractIdentifier(prop.key)?.name === 'format' : false
        );

        if (format === undefined) {
          // No format so must just be regular getContent arguments
          return !raw;
        } else if (format.value.type === TSESTree.AST_NODE_TYPES.Literal) {
          const value = format.value.value;
          if (value === 'raw') {
            // Note: Currently the `assertRawContent` API doesn't accept additional args
            // so don't flag if multiple parameters are used.
            return raw && firstArg.properties.length === 1;
          } else if (value === 'html') {
            return !raw;
          } else {
            return false;
          }
        }
      }
    }
  }

  return false;
};

const isGetBodyInnerHtmlCall = (node: TSESTree.MemberExpression) => {
  const { object, property } = node;
  return object.type === TSESTree.AST_NODE_TYPES.CallExpression && isEditorFunction(object, 'getBody') && object.arguments.length === 0 &&
    property.type === TSESTree.AST_NODE_TYPES.Identifier && property.name === 'innerHTML';
};

const isContentAssertion = (node: TSESTree.CallExpression, raw: boolean) => {
  const callee = node.callee;
  if (callee.type === TSESTree.AST_NODE_TYPES.MemberExpression && node.arguments.length <= 2) {
    const [ object, property ] = extractMemberIdentifiers(callee);
    if (object?.name === 'assert' && (property?.name === 'equal' || property?.name === 'deepEqual')) {
      const firstArgument = node.arguments[0];
      if (firstArgument.type === TSESTree.AST_NODE_TYPES.CallExpression) {
        return isGetContentCall(firstArgument, raw);
      } else if (raw && firstArgument.type === TSESTree.AST_NODE_TYPES.MemberExpression) {
        return isGetBodyInnerHtmlCall(firstArgument);
      }
    }
  }

  return false;
};

type MessageId = 'preferAssertContent' | 'preferAssertRawContent';

export const preferMcAgarTinyAssertions = createRule({
  name: 'prefer-mcagar-tiny-assertions',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using the McAgar TinyAssertions helper functions, instead of generic functions.'
    },
    messages: {
      preferAssertContent: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.',
      preferAssertRawContent: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.',
    },
    fixable: 'code',
    schema: [],
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
            if (isContentAssertion(node, false)) {
              report(node, 'preferAssertContent', createGetContentAssertFixer(context, node, false));
            } else if (isContentAssertion(node, true)) {
              report(node, 'preferAssertRawContent', createGetContentAssertFixer(context, node, true));
            }
          }
        }
      };
    } else {
      return {};
    }
  }
});
