import { TSESTree } from '@typescript-eslint/typescript-estree';
import { Rule } from 'eslint';
import { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, VariableDeclarator } from 'estree';
import { exists } from '../utils/Arr';

const isPromiseImportSpecifier = (specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => specifier.local.name === 'Promise';

const isTsAsExpression = (node: TSESTree.Node): node is TSESTree.TSAsExpression => node.type === 'TSAsExpression';

const extractAsExpression = (node: TSESTree.Node): TSESTree.Node => isTsAsExpression(node) ? extractAsExpression(node.expression) : node;

const isPromiseVariableDeclaration = (node: VariableDeclarator) => {
  if (node.id.type === 'Identifier' && node.id.name === 'Promise' && node.init) {
    // The types for init are missing the TSAsExpression, so we need to cast it as the ts-etree version
    const initNode = extractAsExpression(node.init as TSESTree.Node);
    if (initNode.type === 'FunctionExpression' || initNode.type === 'ArrowFunctionExpression') {
      return true;
    }
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
    let seenPromise = false;
    return {
      ImportDeclaration: (node) => {
        if (node.type === 'ImportDeclaration') {
          if (exists(node.specifiers, isPromiseImportSpecifier)) {
            seenPromise = true;
          }
        }
      },
      VariableDeclarator: (node) => {
        if (node.type === 'VariableDeclarator') {
          if (isPromiseVariableDeclaration(node)) {
            seenPromise = true;
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
                if (!seenPromise) {
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
              if (!seenPromise) {
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