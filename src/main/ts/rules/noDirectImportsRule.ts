import { Rule } from 'eslint';
import {isInternalLibModule, isInternalSrcModule } from '../utils/ImportUtils';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows deep lib imports directly to a file within a @ephox package.'
    },
    messages: {
      noDirectImport: 'Direct import to {{ moduleSpecifier }} is forbidden.'
    }
  },
  create: (context) => {
    return {
      ImportDeclaration: (node) => {
        if (node.type === 'ImportDeclaration') {
          const moduleSpecifier = String(node.source.value);
          console.log(moduleSpecifier);
          if (isInternalLibModule(moduleSpecifier) || isInternalSrcModule(moduleSpecifier)) {
            context.report({
              node,
              messageId: 'noDirectImport',
              data: { moduleSpecifier },
            });
          }
        }
      }
    }
  }
}

module.exports = rule;