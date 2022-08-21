import { Rule } from 'eslint';
import { CallExpression, MemberExpression, Property } from 'estree';
import { extractIdentifier } from '../utils/ExtractUtils';
import { isPathInTest } from '../utils/PathUtils';

const enum Option {
  TinyAssertions = 'tinyAssertions',
  TinyDom = 'tinyDom'
}

const extractCallIdentifiers = (member: MemberExpression) => {
  const object = member.object.type === 'Identifier' ? member.object : null;
  const property = member.property.type === 'Identifier' ? member.property : null;

  return {
    object,
    property
  };
};

const createGetContentAssertFixer = (context: Rule.RuleContext, node: CallExpression, raw: boolean) => (fixer: Rule.RuleFixer): Rule.Fix => {
  const sourceCode = context.getSourceCode();
  const text = sourceCode.getText(node);
  const getContentCall = node.arguments[0] as CallExpression;
  const editorVar = extractIdentifier(getContentCall.callee)?.name as string;
  const funcName = raw ? 'TinyAssertions.assertRawContent' : 'TinyAssertions.assertContent';
  const newText = text.replace(
    /assert\.(?:equal|deepEqual)\((\s*)(?:ed|editor)\.getContent\(([^)]*)\),(\s+[^\)]+?)(\s*)\)/,
    (_match, beforeWhitespace, args, expectedText, afterWhitespace) => {
      const getContentArgs = args.replace(/(\s*format: 'raw',?\s*)/, ' ');
      if (getContentArgs && getContentArgs !== '{ }') {
        const extraSpace = beforeWhitespace || ' ';
        return `${funcName}(${beforeWhitespace}${editorVar},${expectedText},${extraSpace}${getContentArgs}${afterWhitespace})`;
      } else {
        return `${funcName}(${beforeWhitespace}${editorVar},${expectedText}${afterWhitespace})`;
      }
    }
  );
  return fixer.replaceText(node, newText);
};

const createTinyDomFixer = (node: CallExpression, type: string) => (fixer: Rule.RuleFixer): Rule.Fix => {
  const editorApiCall = node.arguments[0] as CallExpression;
  const editorVar = extractIdentifier(editorApiCall.callee)?.name as string;
  return fixer.replaceText(node, `TinyDom.${type}(${editorVar})`);
};

const isEditorFunction = (node: CallExpression, name: string) => {
  const callee = node.callee;
  if (callee.type === 'MemberExpression') {
    const { object, property } = extractCallIdentifiers(callee);
    return (object?.name === 'ed' || object?.name === 'editor') && property?.name === name;
  }

  return false;
};

const isGetContentCall = (node: CallExpression, raw: boolean = false) => {
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
            return raw;
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

const isContentAssertion = (node: CallExpression, raw: boolean = false) => {
  const callee = node.callee;
  if (callee.type === 'MemberExpression' && node.arguments.length <= 2) {
    const { object, property } = extractCallIdentifiers(callee);
    if (object?.name === 'assert' && (property?.name === 'equal' || property?.name === 'deepEqual')) {
      const firstArgument = node.arguments[0];
      if (firstArgument.type === 'CallExpression' && isGetContentCall(firstArgument, raw)) {
        return true;
      }
    }
  }

  return false;
};

const extractTinyDomCall = (node: CallExpression) => {
  const callee = node.callee;
  if (callee.type === 'MemberExpression' && node.arguments.length === 1) {
    const { object, property } = extractCallIdentifiers(callee);
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

export const preferMcAgar: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using the McAgar helper functions, instead of generic functions.'
    },
    messages: {
      preferAssertContent: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.',
      preferAssertRawContent: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.',
      preferTinyDomBody: 'Use `TinyDom.body` instead of manually converting the editor body to a Sugar element.',
      preferTinyDomDocument: 'Use `TinyDom.document` instead of manually converting the editor document to a Sugar element.',
      preferTinyDomContainer: 'Use `TinyDom.container` instead of manually converting the editor container to a Sugar element.',
      preferTinyDomContentAreaContainer: 'Use `TinyDom.contentAreaContainer` instead of manually converting the editor content area' +
        ' container to a Sugar element.',
      preferTinyDomTargetElement: 'Use `TinyDom.targetElement` instead of manually converting the editor target element to a Sugar element.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          tinyAssertions: { type: 'boolean' },
          tinyDom: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ]
  },
  create: (context) => {
    const options = context.options[0] || {};

    const report = (func: CallExpression, option: Option, messageId: string, fix?: (fixer: Rule.RuleFixer) => Rule.Fix) => {
      if (options[option] !== false) {
        context.report({
          node: func,
          messageId,
          fix
        });
      }
    };

    if (isPathInTest(context.getFilename())) {
      return {
        CallExpression: (node) => {
          if (node.type === 'CallExpression') {
            if (isContentAssertion(node, false)) {
              report(node, Option.TinyAssertions, 'preferAssertContent', createGetContentAssertFixer(context, node, false));
            } else if (isContentAssertion(node, true)) {
              report(node, Option.TinyAssertions, 'preferAssertRawContent', createGetContentAssertFixer(context, node, true));
            } else {
              const tinyDomCall = extractTinyDomCall(node);
              if (tinyDomCall !== null) {
                const messageId = 'preferTinyDom' + tinyDomCall.charAt(0).toUpperCase() + tinyDomCall.slice(1);
                report(node, Option.TinyDom, messageId, createTinyDomFixer(node, tinyDomCall));
              }
            }
          }
        }
      };
    } else {
      return {};
    }
  }
};