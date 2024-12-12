import { Rule } from 'eslint';
import { TSESTree } from '@typescript-eslint/typescript-estree';
import { Identifier } from 'estree';

export const noEnumsInExportSpecifier: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallows enums to be exported though export specifier at the end of the file.'
    },
    messages: {
      noEnumsInExportSpecifier: 'Exports of enums needs to be where it\'s being declared.'
    }
  },
  create: (context) => {
    const enumNames: Record<string, true> = {};
    return {
      TSEnumDeclaration: (n: unknown) => {
        const node = n as TSESTree.TSEnumDeclaration;
        enumNames[node.id.name] = true;
      },
      ExportSpecifier: (node) => {
        if (node.type === 'ExportSpecifier') {
          const name = (node.local as Identifier).name;
          if (enumNames.hasOwnProperty(name) && enumNames[name]) {
            context.report({ node, messageId: 'noEnumsInExportSpecifier' });
          }
        }
      }
    };
  }
};
