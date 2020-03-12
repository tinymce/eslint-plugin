import { Rule } from 'eslint';
import {isInternalLibModule, isInternalSrcModule } from '../utils/ImportUtils';
import { extractModuleSpecifier } from '../utils/ExtractUtils';

export const noDirectImports: Rule.RuleModule = {
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
        const moduleSpecifier = extractModuleSpecifier(node);
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
};