import { Rule } from 'eslint';
import { Identifier, Node, VariableDeclarator } from 'estree';
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
  if (init) {
    // a = Node.DOCUMENT_POSITION_PRECEDING
    if (init.type === 'MemberExpression') {
      const object = init.object;
      if (object.type === 'Identifier') {
        return object;
      }
    }

    // a = Node
    if (init.type === 'Identifier') {
      return init;
    }
  }

  return null;
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
    const options = context.options[0] || {};
    const allowed = getAllowedGlobals(options);
    const invalid = Globals.getDomGlobals().filter((name) => !allowed.includes(name));

    const report = (node: Node) => {
      context.report({
        node: node,
        messageId: 'noImplicitDomGlobals',
        fix: (fixer: Rule.RuleFixer): Rule.Fix => {
          return fixer.insertTextBefore(node, 'window.');
        }
      });
    };

    return {
      VariableDeclarator: (node) => {
        if (node.type === 'VariableDeclarator' && node.init) {
          let identifier = extractInitIdentifier(node);
          if (identifier) {
            const name = identifier.name;
            if (invalid.includes(name) && !hasVariableInScope(context, name)) {
              report(identifier);
            }
          }
        }
      },
      ...NewOrCallUtils.forIdentifier((node, identifier) => {
        const name = identifier.name;
        if (invalid.includes(name) && !hasVariableInScope(context, name)) {
          const callee = node.type === 'NewExpression' ? identifier : node;
          report(callee);
        }
      })
    };
  }
};