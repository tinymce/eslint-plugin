import { Rule } from 'eslint';
import { Expression, Identifier, Node, Property, VariableDeclarator } from 'estree';
import { extractIdentifier } from '../utils/ExtractUtils';
import * as Globals from '../utils/Globals';
import * as NewOrCallUtils from '../utils/NewOrCallUtils';
import { hasVariableInScope } from '../utils/ScopeUtils';

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

const extractInitIdentifier = (node: VariableDeclarator): Identifier | null => {
  const init = node.init;
  return init ? extractIdentifier(init) : null;
};

export const noImplicitDomGlobals: Rule.RuleModule = {
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

    const report = (node: Node) => {
      context.report({
        node,
        messageId: 'noImplicitDomGlobals',
        fix: (fixer: Rule.RuleFixer): Rule.Fix => fixer.insertTextBefore(node, 'window.')
      });
    };

    const validateIdentifier = (identifier: Identifier | null) => {
      if (identifier !== null) {
        const name = identifier.name;
        if (invalid.has(name) && !hasVariableInScope(context, name)) {
          report(identifier);
        }
      }
    };

    return {
      'VariableDeclarator': (node) => {
        if (node.type === 'VariableDeclarator' && node.init) {
          const identifier = extractInitIdentifier(node);
          validateIdentifier(identifier);
        }
      },
      'ExpressionStatement': (node) => {
        if (node.type === 'ExpressionStatement') {
          const identifier = extractIdentifier(node.expression);
          validateIdentifier(identifier);
        }
      },
      'AssignmentExpression,BinaryExpression': (node: Expression) => {
        if (node.type === 'AssignmentExpression' || node.type === 'BinaryExpression') {
          const leftIdentifier = extractIdentifier(node.left);
          validateIdentifier(leftIdentifier);

          const rightIdentifier = extractIdentifier(node.right);
          validateIdentifier(rightIdentifier);
        }
      },
      'ConditionalExpression': (node) => {
        if (node.type === 'ConditionalExpression') {
          const testIdentifier = extractIdentifier(node.test);
          validateIdentifier(testIdentifier);

          const conIdentifier = extractIdentifier(node.consequent);
          validateIdentifier(conIdentifier);

          const altIdentifier = extractIdentifier(node.alternate);
          validateIdentifier(altIdentifier);
        }
      },
      'ArrayExpression': (node) => {
        node.elements.forEach((element) => {
          const identifier = extractIdentifier(element);
          validateIdentifier(identifier);
        });
      },
      'ObjectExpression > Property': (node: Property) => {
        if (node.type === 'Property') {
          const identifier = extractIdentifier(node.value);
          validateIdentifier(identifier);
        }
      },
      'ReturnStatement': (node) => {
        if (node.type === 'ReturnStatement' && node.argument) {
          const identifier = extractIdentifier(node.argument);
          validateIdentifier(identifier);
        }
      },
      ...NewOrCallUtils.forIdentifier((node, identifier) => {
        const name = identifier.name;
        if (invalid.has(name) && !hasVariableInScope(context, name)) {
          const callee = node.type === 'NewExpression' ? identifier : node;
          report(callee);
        }
      })
    };
  }
};