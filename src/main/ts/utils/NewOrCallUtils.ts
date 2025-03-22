import { TSESTree } from '@typescript-eslint/utils';
import { RuleListener } from '@typescript-eslint/utils/ts-eslint';
import { extractIdentifier } from './ExtractUtils';

export const forIdentifier =
  (f: (node: TSESTree.CallExpression | TSESTree.NewExpression | TSESTree.Identifier, identifier: TSESTree.Identifier) => void): RuleListener => {
    const checkCallee = (node: TSESTree.CallExpression | TSESTree.NewExpression) => {
      const { callee } = node;
      const identifier = extractIdentifier(callee);
      if (identifier !== null) {
        f(node, identifier);
      }
    };

    const checkArguments = (node: TSESTree.CallExpression | TSESTree.NewExpression) => {
      node.arguments.forEach((arg) => {
        const identifier = extractIdentifier(arg);
        if (identifier !== null) {
          f(identifier, identifier);
        }
      });
    };

    return {
      CallExpression: (node) => {
        if (node.type === TSESTree.AST_NODE_TYPES.CallExpression) {
          checkCallee(node);
          checkArguments(node);
        }
      },
      NewExpression: (node) => {
        if (node.type === TSESTree.AST_NODE_TYPES.NewExpression) {
          checkCallee(node);
          checkArguments(node);
        }
      }
    };
  };
