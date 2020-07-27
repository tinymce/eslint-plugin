import { Rule } from 'eslint';
import { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier } from 'estree';
import { exists } from '../utils/Arr';
import * as NewOrCallUtils from '../utils/NewOrCallUtils';
import { hasVariableInScope } from '../utils/ScopeUtils';

const isPromiseImportSpecifier = (specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => specifier.local.name === 'Promise';

const hasPromiseInScope = (context: Rule.RuleContext) => hasVariableInScope(context, 'Promise');

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
      ...NewOrCallUtils.forIdentifier((node, identifier) => {
        if (identifier.name === 'Promise') {
          if (!seenPromiseImport && !hasPromiseInScope(context)) {
            const callee = node.type === 'NewExpression' ? identifier : node;
            context.report({
              node: callee,
              messageId: 'promiseFillMissing'
            });
          }
        }
      })
    };
  }
};