import { Rule } from 'eslint';
import {isInternalLibModule, isInternalSrcModule } from '../utils/ImportUtils';

export const noDirectImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows deep lib imports directly to a file within a @ephox package.'
    },
    messages: {
      noDirectImport: 'Direct import to {{ source }} is forbidden.'
    }
  },
  create: (context) => {
    return {
      ImportDeclaration: (node) => {
        if (node.type === 'ImportDeclaration') {
          const source = node.source.value;
          if (typeof source === 'string') {
            console.log(source);
            if (isInternalLibModule(source) || isInternalSrcModule(source)) {
              context.report({
                node,
                messageId: 'noDirectImport',
                data: { source },
              });
            }
          }
        }
      }
    }
  }
};