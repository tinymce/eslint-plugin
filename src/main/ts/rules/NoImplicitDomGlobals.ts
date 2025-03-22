import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { extractIdentifier } from '../utils/ExtractUtils';
import * as Globals from '../utils/Globals';
import * as NewOrCallUtils from '../utils/NewOrCallUtils';
import { hasVariableInScope } from '../utils/ScopeUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

interface Options {
  allowed: string[];
  appendDefaults: boolean;
}

const defaultExceptions = [
  'window',
  'document',
  'console',
  'navigator',
  'localStorage',
  'sessionStorage',

  // Common functions
  'atob',
  'clearTimeout',
  'setTimeout',
  'clearInterval',
  'setInterval',

  // Commons constructors
  'Blob',
  'DOMParser',
  'FileReader',
  'FormData',
  'MutationObserver',
  'Image',
  'URL',
  'XMLHttpRequest',

  // Common property accessors
  'Node',
  'NodeFilter',

  // Common events
  'Event',
  'KeyboardEvent',
  'MouseEvent',
  'Touch',
  'TouchEvent',
  'UIEvent'
];

const getAllowedGlobals = (options: Partial<Options>): string[] => {
  const allowedGlobals = options.allowed || [];
  if (options.appendDefaults) {
    return allowedGlobals.concat(defaultExceptions);
  } else {
    return options.allowed === undefined ? defaultExceptions : allowedGlobals;
  }
};

const extractInitIdentifier = (node: TSESTree.VariableDeclarator): TSESTree.Identifier | null => {
  const init = node.init;
  return init ? extractIdentifier(init) : null;
};

export const noImplicitDomGlobals = createRule({
  name: 'no-implicit-dom-globals',
  defaultOptions: [{
    allowed: [],
    appendDefaults: true
  }],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows implicit dom global variables from being used without being accessed via the global window object. ' +
                   'A number of common ones are allowed by default however, such as window and document.'
    },
    messages: {
      noImplicitDomGlobals: 'Don\'t use implicit dom globals. Access the global via the window object instead.'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          appendDefaults: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create: (context) => {
    const options: Partial<Options> = context.options[0] || {};
    const allowed = getAllowedGlobals(options);
    // PERFORMANCE: Convert the invalid list to a Set for better lookup times
    const invalid = new Set(Globals.getDomGlobals().filter((name) => !allowed.includes(name)));

    const report = (node: TSESTree.Node) => {
      context.report({
        node,
        messageId: 'noImplicitDomGlobals',
        fix: (fixer: RuleFixer): RuleFix => fixer.insertTextBefore(node, 'window.')
      });
    };

    const validateIdentifier = (identifier: TSESTree.Identifier | null, node: TSESTree.Node) => {
      if (identifier !== null) {
        const name = identifier.name;
        if (invalid.has(name) && !hasVariableInScope(context, name, node)) {
          report(identifier);
        }
      }
    };

    return {
      'VariableDeclarator': (node) => {
        if (node.type === TSESTree.AST_NODE_TYPES.VariableDeclarator && node.init) {
          const identifier = extractInitIdentifier(node);
          validateIdentifier(identifier, node);
        }
      },
      'ExpressionStatement': (node) => {
        if (node.type === TSESTree.AST_NODE_TYPES.ExpressionStatement) {
          const identifier = extractIdentifier(node.expression);
          validateIdentifier(identifier, node);
        }
      },
      'AssignmentExpression,BinaryExpression': (node: TSESTree.AssignmentExpression | TSESTree.BinaryExpression) => {
        if (node.type === TSESTree.AST_NODE_TYPES.AssignmentExpression || node.type === TSESTree.AST_NODE_TYPES.BinaryExpression) {
          const leftIdentifier = extractIdentifier(node.left);
          validateIdentifier(leftIdentifier, node);

          const rightIdentifier = extractIdentifier(node.right);
          validateIdentifier(rightIdentifier, node);
        }
      },
      'ConditionalExpression': (node) => {
        if (node.type === TSESTree.AST_NODE_TYPES.ConditionalExpression) {
          const testIdentifier = extractIdentifier(node.test);
          validateIdentifier(testIdentifier, node);

          const conIdentifier = extractIdentifier(node.consequent);
          validateIdentifier(conIdentifier, node);

          const altIdentifier = extractIdentifier(node.alternate);
          validateIdentifier(altIdentifier, node);
        }
      },
      'ArrayExpression': (node) => {
        node.elements.forEach((element) => {
          const identifier = extractIdentifier(element);
          validateIdentifier(identifier, node);
        });
      },
      'ObjectExpression > Property': (node: TSESTree.Property) => {
        if (node.type === TSESTree.AST_NODE_TYPES.Property) {
          const identifier = extractIdentifier(node.value);
          validateIdentifier(identifier, node);
        }
      },
      'ReturnStatement': (node) => {
        if (node.type === TSESTree.AST_NODE_TYPES.ReturnStatement && node.argument) {
          const identifier = extractIdentifier(node.argument);
          validateIdentifier(identifier, node);
        }
      },
      ...NewOrCallUtils.forIdentifier((node, identifier) => {
        const name = identifier.name;
        if (invalid.has(name) && !hasVariableInScope(context, name, node)) {
          const callee = node.type === TSESTree.AST_NODE_TYPES.NewExpression ? identifier : node;
          report(callee);
        }
      })
    };
  }
});
