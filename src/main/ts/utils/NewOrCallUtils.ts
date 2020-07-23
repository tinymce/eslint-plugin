import { Rule } from 'eslint';
import { CallExpression, Identifier, NewExpression } from 'estree';

export const forIdentifier = (f: (node: CallExpression | NewExpression, identifier: Identifier) => void): Rule.RuleListener => {
  return {
    CallExpression: (node) => {
      if (node.type === 'CallExpression') {
        const callee = node.callee;
        if (callee.type === 'MemberExpression') {
          const object = callee.object;
          if (object.type === 'Identifier') {
            f(node, object);
          }
        } else if (callee.type === 'Identifier') {
          f(node, callee);
        }
      }
    },
    NewExpression: (node) => {
      if (node.type === 'NewExpression') {
        const callee = node.callee;
        if (callee.type === 'Identifier') {
          f(node, callee);
        }
      }
    }
  }
};