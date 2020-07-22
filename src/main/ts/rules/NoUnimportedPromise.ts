import { Rule, Scope } from 'eslint';
import { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier } from 'estree';
import { exists } from '../utils/Arr';

const isPromiseImportSpecifier = (specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => specifier.local.name === 'Promise';

const hasPromiseInScope = (context: Rule.RuleContext) => {
  let scope: Scope.Scope | null = context.getScope();
  while (scope && scope.type !== 'global') {
    if (exists(scope.variables, (v) => v.name === 'Promise')) {
      return true;
    }
    scope = scope.upper;
  }
  return false;
};

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
          if (exists(node.specifiers, isPromiseImportSpecifier)) {
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
                if (!seenPromiseImport && !hasPromiseInScope(context)) {
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
              if (!seenPromiseImport && !hasPromiseInScope(context)) {
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