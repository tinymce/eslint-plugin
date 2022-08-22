import { Rule } from 'eslint';
import { CallExpression, MemberExpression, Property } from 'estree';
import { isEditorFunction } from '../utils/EditorUtils';
import { extractIdentifier, extractMemberIdentifiers } from '../utils/ExtractUtils';
import { isPathInTest } from '../utils/PathUtils';

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

const createGetContentAssertFixer = (context: Rule.RuleContext, node: CallExpression, raw: boolean) => (fixer: Rule.RuleFixer): Rule.Fix => {
  const sourceCode = context.getSourceCode();
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

const isGetContentCall = (node: CallExpression, raw: boolean) => {
  if (isEditorFunction(node, 'getContent')) {
    if (!raw && node.arguments.length === 0) {
      // No args so must just be regular getContent call
      return true;
    } else {
      const firstArg = node.arguments[0];
      if (firstArg.type === 'ObjectExpression') {
        const format = firstArg.properties.find((prop): prop is Property =>
          prop.type === 'Property' ? extractIdentifier(prop.key)?.name === 'format' : false
        );

        if (format === undefined) {
          // No format so must just be regular getContent arguments
          return !raw;
        } else if (format.value.type === 'Literal') {
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

const isGetBodyInnerHtmlCall = (node: MemberExpression) => {
  const { object, property } = node;
  return object.type === 'CallExpression' && isEditorFunction(object, 'getBody') && object.arguments.length === 0 &&
    property.type === 'Identifier' && property.name === 'innerHTML';
};

const isContentAssertion = (node: CallExpression, raw: boolean) => {
  const callee = node.callee;
  if (callee.type === 'MemberExpression' && node.arguments.length <= 2) {
    const [ object, property ] = extractMemberIdentifiers(callee);
    if (object?.name === 'assert' && (property?.name === 'equal' || property?.name === 'deepEqual')) {
      const firstArgument = node.arguments[0];
      if (firstArgument.type === 'CallExpression') {
        return isGetContentCall(firstArgument, raw);
      } else if (raw && firstArgument.type === 'MemberExpression') {
        return isGetBodyInnerHtmlCall(firstArgument);
      }
    }
  }

  return false;
};

export const preferMcAgarTinyAssertions: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using the McAgar TinyAssertions helper functions, instead of generic functions.'
    },
    messages: {
      preferAssertContent: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.',
      preferAssertRawContent: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.',
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
};