import { Rule } from 'eslint';
import { CallExpression, Identifier, NewExpression } from 'estree';
import { extractIdentifier } from './ExtractUtils';

export const forIdentifier = (f: (node: CallExpression | NewExpression | Identifier, identifier: Identifier) => void): Rule.RuleListener => {
  const checkCallee = (node: CallExpression | NewExpression) => {
    const identifier = extractIdentifier(node.callee);
    if (identifier !== null) {
      f(node, identifier);
    }
  };

  const checkArguments = (node: CallExpression | NewExpression) => {
    node.arguments.forEach((arg) => {
      const identifier = extractIdentifier(arg);
      if (identifier !== null) {
        f(identifier, identifier);
      }
    });
  };

  return {
    CallExpression: (node) => {
      if (node.type === 'CallExpression') {
        checkCallee(node);
        checkArguments(node);
      }
    },
    NewExpression: (node) => {
      if (node.type === 'NewExpression') {
        checkCallee(node);
        checkArguments(node);
      }
    }
  }
};