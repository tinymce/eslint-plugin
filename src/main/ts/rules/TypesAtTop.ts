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
    schema: [],
    fixable: 'code'
  },
  create: (context) => {
    const sourceCode = context.getSourceCode();

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
        let lastImportLine = 0;
        const typeDeclarations: TSESTree.Node[] = [];
        const codeStatements: TSESTree.Node[] = [];

        // Find the last import statement and collect declarations
        for (const statement of body) {
          if (statement.type === TSESTree.AST_NODE_TYPES.ImportDeclaration) {
            lastImportLine = Math.max(lastImportLine, statement.loc?.end.line || 0);
          } else if (isTypeDeclaration(statement)) {
            typeDeclarations.push(statement);
          } else if (isCodeStatement(statement)) {
            codeStatements.push(statement);
          }
        }

        // Check if types are misplaced and report with fixes
        const misplacedTypes: TSESTree.Node[] = [];

        for (const typeDecl of typeDeclarations) {
          const typeLine = typeDecl.loc?.start.line || 0;

          // Check if there's any code statement before this type (after imports)
          const hasCodeBefore = codeStatements.some((codeStmt) => {
            const codeLine = codeStmt.loc?.start.line || 0;
            return codeLine > lastImportLine && codeLine < typeLine;
          });

          if (hasCodeBefore) {
            misplacedTypes.push(typeDecl);
          }
        }

        // If we have misplaced types, we need to fix them all together
        if (misplacedTypes.length > 0) {
          // Report each misplaced type, but only provide a fix for the first one
          // The fix will move all misplaced types together
          misplacedTypes.forEach((typeDecl, index) => {
            context.report({
              node: typeDecl,
              messageId: 'typeNotAtTop',
              fix: index === 0 ? (fixer) => {
                // Find the position to insert types (after last import or at the beginning)
                let insertPosition: number;
                const lastImportNode = body
                  .filter((stmt) => stmt.type === TSESTree.AST_NODE_TYPES.ImportDeclaration)
                  .pop();

                if (lastImportNode && lastImportNode.range) {
                  insertPosition = lastImportNode.range[1];
                  // Find the end of the line (including newline)
                  const textAfter = sourceCode.text.slice(insertPosition);
                  const newlineMatch = textAfter.match(/\r?\n/);
                  if (newlineMatch && newlineMatch.index !== undefined) {
                    insertPosition += newlineMatch.index + newlineMatch[0].length;
                  }
                } else {
                  insertPosition = 0;
                }

                // Sort types by their original line numbers to maintain order
                const sortedTypes = [ ...misplacedTypes ].sort((a, b) =>
                  (a.loc?.start.line || 0) - (b.loc?.start.line || 0)
                );

                // Collect all misplaced type texts preserving original indentation
                const typesText = sortedTypes.map((typeNode) =>
                  sourceCode.getText(typeNode)
                ).join('\n\n');

                // Create the insertion text
                const insertText = `\n${typesText}\n`;

                const fixes = [
                  // Insert all types at the correct position
                  fixer.insertTextAfterRange([ insertPosition, insertPosition ], insertText),
                  // Remove all misplaced types from their original positions
                  ...misplacedTypes.map((typeNode) => fixer.remove(typeNode))
                ];

                return fixes;
              } : undefined
            });
          });
        }
      }
    };
  }
});
