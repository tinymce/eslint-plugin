import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const typesAtTop = createRule({
  name: 'types-at-top',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures TypeScript interfaces and types are placed at the top of the file below imports.'
    },
    messages: {
      typeNotAtTop: 'Type declarations (interfaces, types, enums) should be placed at the top of the file below imports.',
    },
    schema: []
  },
  create: (context) => {
    let lastImportLine = 0;
    let firstTypeDeclarationLine = Infinity;
    let hasNonTypeCode = false;
    let firstNonTypeCodeLine = 0;

    const isTypeDeclaration = (node: TSESTree.Node): boolean => {
      if (node.type === TSESTree.AST_NODE_TYPES.TSInterfaceDeclaration ||
          node.type === TSESTree.AST_NODE_TYPES.TSTypeAliasDeclaration ||
          node.type === TSESTree.AST_NODE_TYPES.TSEnumDeclaration) {
        return true;
      }

      // Handle exported type declarations
      if (node.type === TSESTree.AST_NODE_TYPES.ExportNamedDeclaration && node.declaration) {
        return node.declaration.type === TSESTree.AST_NODE_TYPES.TSInterfaceDeclaration ||
               node.declaration.type === TSESTree.AST_NODE_TYPES.TSTypeAliasDeclaration ||
               node.declaration.type === TSESTree.AST_NODE_TYPES.TSEnumDeclaration;
      }

      return false;
    };

    const isCodeStatement = (node: TSESTree.Node): boolean => {
      if (node.type === TSESTree.AST_NODE_TYPES.VariableDeclaration ||
          node.type === TSESTree.AST_NODE_TYPES.FunctionDeclaration ||
          node.type === TSESTree.AST_NODE_TYPES.ClassDeclaration ||
          node.type === TSESTree.AST_NODE_TYPES.ExpressionStatement ||
          node.type === TSESTree.AST_NODE_TYPES.ExportDefaultDeclaration) {
        return true;
      }

      // Handle exported declarations - only treat as code if not exporting a type
      if (node.type === TSESTree.AST_NODE_TYPES.ExportNamedDeclaration) {
        if (!node.declaration) {
          // Export specifiers like `export { foo }`
          return true;
        }

        // If exporting a type declaration, don't treat as code
        return !(node.declaration.type === TSESTree.AST_NODE_TYPES.TSInterfaceDeclaration ||
                node.declaration.type === TSESTree.AST_NODE_TYPES.TSTypeAliasDeclaration ||
                node.declaration.type === TSESTree.AST_NODE_TYPES.TSEnumDeclaration);
      }

      return false;
    };

    return {
      Program: (node) => {
        const body = node.body;

        // Find the last import statement
        for (const statement of body) {
          if (statement.type === TSESTree.AST_NODE_TYPES.ImportDeclaration) {
            lastImportLine = Math.max(lastImportLine, statement.loc?.end.line || 0);
          }
        }

        // Check the order of declarations
        for (const statement of body) {
          const currentLine = statement.loc?.start.line || 0;

          if (isTypeDeclaration(statement)) {
            firstTypeDeclarationLine = Math.min(firstTypeDeclarationLine, currentLine);

            // Check if there's code before this type declaration (after imports)
            if (hasNonTypeCode && currentLine > firstNonTypeCodeLine) {
              context.report({
                node: statement,
                messageId: 'typeNotAtTop'
              });
            }
          } else if (isCodeStatement(statement) && currentLine > lastImportLine) {
            if (!hasNonTypeCode) {
              hasNonTypeCode = true;
              firstNonTypeCodeLine = currentLine;
            }
          }
        }
      }
    };
  }
});
