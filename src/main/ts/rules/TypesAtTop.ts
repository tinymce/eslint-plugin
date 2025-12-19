import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

type MessageIds = 'typeNotAtTop';
type Options = [];

interface FileAnalysis {
  readonly lastImportLine: number;
  readonly typeDeclarations: readonly TSESTree.Node[];
  readonly codeStatements: readonly TSESTree.Node[];
}

const TYPE_DECLARATION_NODE_TYPES: TSESTree.AST_NODE_TYPES[] = [
  TSESTree.AST_NODE_TYPES.TSInterfaceDeclaration,
  TSESTree.AST_NODE_TYPES.TSTypeAliasDeclaration,
  TSESTree.AST_NODE_TYPES.TSEnumDeclaration
];

const CODE_STATEMENT_NODE_TYPES: TSESTree.AST_NODE_TYPES[] = [
  TSESTree.AST_NODE_TYPES.VariableDeclaration,
  TSESTree.AST_NODE_TYPES.FunctionDeclaration,
  TSESTree.AST_NODE_TYPES.ClassDeclaration,
  TSESTree.AST_NODE_TYPES.ExpressionStatement,
  TSESTree.AST_NODE_TYPES.ExportDefaultDeclaration
];

const isDeclareStatement = (node: TSESTree.Node): boolean =>
  node.type === TSESTree.AST_NODE_TYPES.VariableDeclaration && node.declare === true;

const isBaseTypeDeclaration = (node: TSESTree.Node): boolean =>
  TYPE_DECLARATION_NODE_TYPES.includes(node.type);

const isTypeOrDeclare = (node: TSESTree.Node): boolean =>
  isBaseTypeDeclaration(node) || isDeclareStatement(node);

/**
 * Checks if a node is a type declaration (interface, type alias, enum, or declare statement).
 * Handles both standalone and exported type declarations.
 */
const isTypeDeclaration = (node: TSESTree.Node): boolean => {
  if (isTypeOrDeclare(node)) {
    return true;
  }

  // Handle exported type declarations: export interface Foo {}, export declare let foo
  if (node.type === TSESTree.AST_NODE_TYPES.ExportNamedDeclaration && node.declaration) {
    return isTypeOrDeclare(node.declaration);
  }

  return false;
};

/**
 * Checks if a node is a code statement that should come after type declarations.
 * Excludes re-export statements (export { foo } from 'module') as they are import-like.
 */
const isCodeStatement = (node: TSESTree.Node): boolean => {
  if (CODE_STATEMENT_NODE_TYPES.includes(node.type)) {
    return true;
  }

  if (node.type === TSESTree.AST_NODE_TYPES.ExportNamedDeclaration) {
    // Re-export statements should not be treated as code
    if (node.source) {
      return false;
    }

    // Export specifiers like `export { foo }` are code
    if (!node.declaration) {
      return true;
    }

    // If exporting a type declaration or declare statement, don't treat as code
    return !isTypeOrDeclare(node.declaration);
  }

  return false;
};

/**
 * Analyzes the program body to categorize statements and find the last import line.
 */
const analyzeFile = (body: readonly TSESTree.ProgramStatement[]): FileAnalysis => {
  const typeDeclarations: TSESTree.Node[] = [];
  const codeStatements: TSESTree.Node[] = [];
  let lastImportLine = 0;

  for (const statement of body) {
    if (statement.type === TSESTree.AST_NODE_TYPES.ImportDeclaration) {
      lastImportLine = Math.max(lastImportLine, statement.loc?.end.line ?? 0);
    } else if (isTypeDeclaration(statement)) {
      typeDeclarations.push(statement);
    } else if (isCodeStatement(statement)) {
      codeStatements.push(statement);
    }
  }

  return { lastImportLine, typeDeclarations, codeStatements };
};

/**
 * Gets the line number of a node, defaulting to 0 if unavailable.
 */
const getNodeLine = (node: TSESTree.Node): number => node.loc?.start.line ?? 0;

/**
 * Identifies type declarations that appear after code statements.
 * These are considered misplaced and should be moved to the top.
 */
const findMisplacedTypes = (fileAnalysis: FileAnalysis): readonly TSESTree.Node[] => {
  const { codeStatements, typeDeclarations, lastImportLine } = fileAnalysis;

  return typeDeclarations.filter((typeDecl) => {
    const typeLine = getNodeLine(typeDecl);
    return codeStatements.some((codeStmt) => {
      const codeLine = getNodeLine(codeStmt);
      return codeLine > lastImportLine && codeLine < typeLine;
    });
  });
};

/**
 * Calculates the position after the last import statement (or start of file).
 * This is where type declarations should be inserted.
 */
const getInsertPosition = (
  body: readonly TSESTree.ProgramStatement[],
  fullText: string
): number => {
  const lastImportNode = body
    .filter((stmt): stmt is TSESTree.ImportDeclaration =>
      stmt.type === TSESTree.AST_NODE_TYPES.ImportDeclaration
    )
    .pop();

  if (!lastImportNode?.range) {
    return 0;
  }

  // Start after the import statement
  let position = lastImportNode.range[1];

  // Move to the end of the line (including newline)
  const textAfter = fullText.slice(position);
  const newlineMatch = textAfter.match(/\r?\n/);

  if (newlineMatch?.index !== undefined) {
    position += newlineMatch.index + newlineMatch[0].length;
  }

  return position;
};

/**
 * Removes a node from the source text, including its surrounding whitespace.
 * Returns the modified text and the number of characters removed.
 */
const removeNodeFromText = (
  text: string,
  node: TSESTree.Node
): { readonly text: string; readonly removedLength: number } => {
  if (!node.range) {
    return { text, removedLength: 0 };
  }

  const [ nodeStart, nodeEnd ] = node.range;
  let removeStart = nodeStart;
  let removeEnd = nodeEnd;

  // Expand to include the entire line (indentation and trailing newline)
  while (removeStart > 0 && text[removeStart - 1] !== '\n') {
    removeStart--;
  }

  if (removeEnd < text.length && text[removeEnd] === '\n') {
    removeEnd++;
  }

  const modifiedText = text.slice(0, removeStart) + text.slice(removeEnd);
  const removedLength = removeEnd - removeStart;

  return { text: modifiedText, removedLength };
};

/**
 * Sorts nodes by their line numbers to maintain relative order.
 */
const sortByLineNumber = (nodes: readonly TSESTree.Node[]): TSESTree.Node[] =>
  [ ...nodes ].sort((a, b) => getNodeLine(a) - getNodeLine(b));

/**
 * Creates a fix that moves all misplaced type declarations to the top of the file.
 */
const createAutoFix = (
  fixer: TSESLint.RuleFixer,
  misplacedTypes: readonly TSESTree.Node[],
  body: readonly TSESTree.ProgramStatement[],
  sourceCode: Readonly<TSESLint.SourceCode>
): TSESLint.RuleFix => {
  const fullText = sourceCode.getText();
  let insertPosition = getInsertPosition(body, fullText);

  // Sort types by their original line numbers to maintain relative order
  const sortedTypes = sortByLineNumber(misplacedTypes);
  const typeText = sortedTypes.map((node) => sourceCode.getText(node)).join('\n\n');

  // Remove types from their original locations (in reverse order to maintain positions)
  let modifiedText = fullText;

  for (const typeNode of [ ...sortedTypes ].reverse()) {
    const { text: newText, removedLength } = removeNodeFromText(modifiedText, typeNode);
    modifiedText = newText;

    // Adjust insert position if we removed text before it
    if (typeNode.range && typeNode.range[0] < insertPosition) {
      insertPosition -= removedLength;
    }
  }

  // Insert types at the correct position with proper spacing
  const beforeInsert = modifiedText.slice(0, insertPosition);
  const afterInsert = modifiedText.slice(insertPosition);
  const normalizedAfter = afterInsert.replace(/^\n+/, '\n');
  const finalText = (beforeInsert + '\n' + typeText + '\n' + normalizedAfter).replace(/\s+$/, '');

  return fixer.replaceTextRange([ 0, fullText.length ], finalText);
};

export const typesAtTop = createRule<Options, MessageIds>({
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
    const sourceCode = context.sourceCode;

    return {
      Program: (node) => {
        const fileAnalysis = analyzeFile(node.body);
        const misplacedTypes = findMisplacedTypes(fileAnalysis);

        if (misplacedTypes.length === 0) {
          return;
        }

        // Report the first misplaced type with an auto-fix
        context.report({
          node: misplacedTypes[0],
          messageId: 'typeNotAtTop',
          fix: (fixer) => createAutoFix(fixer, misplacedTypes, node.body, sourceCode)
        });

        // Report remaining misplaced types without fixes (to show all errors)
        for (const misplacedType of misplacedTypes.slice(1)) {
          context.report({
            node: misplacedType,
            messageId: 'typeNotAtTop'
          });
        }
      }
    };
  }
});
