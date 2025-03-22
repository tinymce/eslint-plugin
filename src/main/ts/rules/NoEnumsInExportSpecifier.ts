import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const noEnumsInExportSpecifier = createRule({
  name: 'no-enums-in-export-specifier',
  defaultOptions: [],
  meta: {
    type: 'problem',
    schema: [],
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
      TSEnumDeclaration: (node: TSESTree.TSEnumDeclaration) => {
        enumNames[node.id.name] = true;
      },
      ExportSpecifier: (node: TSESTree.ExportSpecifier) => {
        if (node.type === TSESTree.AST_NODE_TYPES.ExportSpecifier) {
          const name = node.local.type === TSESTree.AST_NODE_TYPES.Identifier ? node.local.name : undefined;
          if (name && Object.prototype.hasOwnProperty.call(enumNames, name) && enumNames[name]) {
            context.report({ node, messageId: 'noEnumsInExportSpecifier' });
          }
        }
      }
    };
  }
});
