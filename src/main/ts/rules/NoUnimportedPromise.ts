import { Rule } from 'eslint';
import { exists } from '../utils/Arr';
import { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier } from 'estree';

const isPromiseSpecifier = (specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => specifier.local.name === 'Promise';

export const noUnimportedPromise: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows usage of Promise without importing a featurefill.'
    },
    messages: {
      promiseFillMissing: 'Promise needs a featurefill import since IE 11 doesn\'t have native support.'
    }
  },
  create: (context) => {
    let seenPromiseImport = false;
    return {
      ImportDeclaration: (node) => {
        if (node.type === 'ImportDeclaration') {
          if (exists(node.specifiers, isPromiseSpecifier)) {
            seenPromiseImport = true;
          }
        }
      },
      CallExpression: (node) => {
        if (node.type === 'CallExpression') {
          const callee = node.callee;
          if (callee.type === 'MemberExpression') {
            const object = callee.object;
            if (object.type === 'Identifier') {
              if (object.name === 'Promise') {
                if (!seenPromiseImport) {
                  context.report({
                    node,
                    messageId: 'promiseFillMissing',
                  });
                }
              }
            }
          }
        }
      },
      NewExpression: (node) => {
        if (node.type === 'NewExpression') {
          const callee = node.callee;
          if (callee.type === 'Identifier') {
            if (callee.name === 'Promise') {
              if (!seenPromiseImport) {
                context.report({
                  node,
                  messageId: 'promiseFillMissing',
                });
              }
            }
          }
        }
      }
    };
  }
};