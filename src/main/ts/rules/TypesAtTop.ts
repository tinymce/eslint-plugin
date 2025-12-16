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
        // Re-export statements (export { foo } from 'module') should not be treated as code
        if (node.source) {
          return false;
        }

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
          // Report all misplaced types with a single fix for the first one
          context.report({
            node: misplacedTypes[0],
            messageId: 'typeNotAtTop',
            fix: (fixer) => {
              // Get the full source text
              const fullText = sourceCode.getText();

              // Find the position to insert types (after last import or at the beginning)
              let insertPosition: number;
              const lastImportNode = body
                .filter((stmt) => stmt.type === TSESTree.AST_NODE_TYPES.ImportDeclaration)
                .pop();

              if (lastImportNode && lastImportNode.range) {
                insertPosition = lastImportNode.range[1];
                // Find the end of the line (including newline)
                const textAfter = fullText.slice(insertPosition);
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

              // Extract type text preserving indentation
              const extractedTypes = sortedTypes.map((typeNode) =>
                sourceCode.getText(typeNode)
              );

              // Create the insertion text - types with empty line between each
              const typeText = extractedTypes.join('\n\n');

              // Remove the types from their original locations
              let modifiedText = fullText;

              // Process in reverse order to avoid position shifts
              const reversedTypes = [ ...sortedTypes ].reverse();
              for (const typeNode of reversedTypes) {
                if (!typeNode.range) {
                  continue;
                }

                const nodeStart = typeNode.range[0];
                const nodeEnd = typeNode.range[1];

                // Find the line boundaries for clean removal
                let removeStart = nodeStart;
                let removeEnd = nodeEnd;

                // Look backwards to find start of line (including indentation)
                while (removeStart > 0 && modifiedText[removeStart - 1] !== '\n') {
                  removeStart--;
                }

                // Look forwards to include the trailing newline
                if (removeEnd < modifiedText.length && modifiedText[removeEnd] === '\n') {
                  removeEnd++;
                }

                // Remove this section
                modifiedText = modifiedText.slice(0, removeStart) + modifiedText.slice(removeEnd);

                // Update insert position if it was after the removed content
                if (insertPosition > removeStart) {
                  insertPosition -= (removeEnd - removeStart);
                }
              }

              // Insert the types at the correct position
              const beforeInsert = modifiedText.slice(0, insertPosition);
              const afterInsert = modifiedText.slice(insertPosition);

              // Ensure proper spacing: single empty line before types, single empty line after
              let cleanAfter = afterInsert;

              // Remove any extra leading newlines from after text and ensure exactly one
              cleanAfter = cleanAfter.replace(/^\n+/, '\n');

              // Construct final text
              let finalText = beforeInsert + '\n' + typeText + '\n' + cleanAfter;

              // Clean up any trailing whitespace at the very end of the file
              finalText = finalText.replace(/\s+$/, '');

              // Return the fix
              return fixer.replaceTextRange([ 0, fullText.length ], finalText);
            }
          });

          // Report additional types without fixes to show all errors
          for (let i = 1; i < misplacedTypes.length; i++) {
            context.report({
              node: misplacedTypes[i],
              messageId: 'typeNotAtTop'
            });
          }
        }
      }
    };
  }
});
