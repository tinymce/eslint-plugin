import { ESLintUtils, TSESTree, TSESLint, AST_NODE_TYPES } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

interface Options {
  string?: boolean;
  number?: boolean;
  boolean?: boolean;
  function?: boolean;
  object?: boolean;
  null?: boolean;
  undefined?: boolean;
  nullable?: boolean;
  nonNullable?: boolean;
  nonNullableStrict?: boolean;
}

/**
 * Report a violation if the option is enabled
 */
type MessageIds = 'preferTypeString' | 'preferTypeNumber' | 'preferTypeBoolean' | 'preferTypeFunction' | 'preferTypeObject' |
                 'preferTypeNull' | 'preferTypeUndefined' | 'preferTypeNullable' | 'preferTypeNonNullable' | 'preferTypeNonNullableStrict' |
                 'negatedPreferTypeString' | 'negatedPreferTypeNumber' | 'negatedPreferTypeBoolean' | 'negatedPreferTypeFunction' |
                 'negatedPreferTypeObject' | 'negatedPreferTypeNull' | 'negatedPreferTypeUndefined';

interface TypeCheckConfig {
  func: string;
  messageId: MessageIds;
  negatedMessageId: MessageIds;
  optionKey: keyof Options;
}

const DEFAULT_OPTIONS: [Options] = [{
  string: true,
  number: true,
  boolean: true,
  function: true,
  object: true,
  null: true,
  undefined: true,
  nullable: true,
  nonNullable: true,
  nonNullableStrict: true
}];

export const preferType = createRule<[Options], MessageIds>({
  name: 'prefer-katamari-type',
  defaultOptions: DEFAULT_OPTIONS,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using Type utility functions from katamari instead of manual type checks',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          string: { type: 'boolean' },
          number: { type: 'boolean' },
          boolean: { type: 'boolean' },
          function: { type: 'boolean' },
          object: { type: 'boolean' },
          null: { type: 'boolean' },
          undefined: { type: 'boolean' },
          nullable: { type: 'boolean' },
          nonNullable: { type: 'boolean' },
          nonNullableStrict: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      preferTypeString: 'Use Type.isString({{variable}}) instead of typeof {{variable}} === \'string\'',
      preferTypeNumber: 'Use Type.isNumber({{variable}}) instead of typeof {{variable}} === \'number\'',
      preferTypeBoolean: 'Use Type.isBoolean({{variable}}) instead of typeof {{variable}} === \'boolean\'',
      preferTypeFunction: 'Use Type.isFunction({{variable}}) instead of typeof {{variable}} === \'function\'',
      preferTypeObject: 'Use Type.isObject({{variable}}) instead of typeof {{variable}} === \'object\'',
      preferTypeNull: 'Use Type.isNull({{variable}}) instead of {{variable}} === null',
      preferTypeUndefined: 'Use Type.isUndefined({{variable}}) instead of {{variable}} === undefined',
      preferTypeNullable: 'Use Type.isNullable({{variable}}) instead of {{variable}} == null',
      preferTypeNonNullable: 'Use Type.isNonNullable({{variable}}) instead of {{variable}} != null',
      preferTypeNonNullableStrict: 'Use Type.isNonNullable({{variable}}) instead of {{variable}} !== null && {{variable}} !== undefined',
      negatedPreferTypeString: 'Use !Type.isString({{variable}}) instead of typeof {{variable}} !== \'string\'',
      negatedPreferTypeNumber: 'Use !Type.isNumber({{variable}}) instead of typeof {{variable}} !== \'number\'',
      negatedPreferTypeBoolean: 'Use !Type.isBoolean({{variable}}) instead of typeof {{variable}} !== \'boolean\'',
      negatedPreferTypeFunction: 'Use !Type.isFunction({{variable}}) instead of typeof {{variable}} !== \'function\'',
      negatedPreferTypeObject: 'Use !Type.isObject({{variable}}) instead of typeof {{variable}} !== \'object\'',
      negatedPreferTypeNull: 'Use !Type.isNull({{variable}}) instead of {{variable}} !== null',
      negatedPreferTypeUndefined: 'Use !Type.isUndefined({{variable}}) instead of {{variable}} !== undefined'
    }
  },
  create: (context) => {
    const ctxOptions = context.options[0] ?? {};
    const options = {
      ...DEFAULT_OPTIONS[0],
      ...ctxOptions
    };

    const importName = 'Type';
    const modulePath = '@ephox/katamari';
    const sourceCode = context.sourceCode;
    let importFixAdded = false;

    // Type check configurations for typeof checks
    const typeofChecks: Record<string, TypeCheckConfig> = {
      string: { func: 'isString', messageId: 'preferTypeString', negatedMessageId: 'negatedPreferTypeString', optionKey: 'string' },
      number: { func: 'isNumber', messageId: 'preferTypeNumber', negatedMessageId: 'negatedPreferTypeNumber', optionKey: 'number' },
      boolean: { func: 'isBoolean', messageId: 'preferTypeBoolean', negatedMessageId: 'negatedPreferTypeBoolean', optionKey: 'boolean' },
      function: { func: 'isFunction', messageId: 'preferTypeFunction', negatedMessageId: 'negatedPreferTypeFunction', optionKey: 'function' },
      object: { func: 'isObject', messageId: 'preferTypeObject', negatedMessageId: 'negatedPreferTypeObject', optionKey: 'object' }
    };

    /**
     * Report a violation if the option is enabled
     */
    const report = (node: TSESTree.Node, messageId: MessageIds, data: Record<string, string>, optionKey: keyof Options, replacement: string) => {
      if (options[optionKey] === true) {
        context.report({
          node,
          messageId,
          data,
          fix: createFix(node, replacement)
        });
      }
    };

    /**
     * Get the variable name from a node (handles complex expressions)
     */
    const getVariableName = (node: TSESTree.Node): string => sourceCode.getText(node);

    /**
     * Check if node is a simple identifier or member expression
     */
    const isSimpleVariable = (node: TSESTree.Node): boolean =>
      node.type === AST_NODE_TYPES.Identifier || node.type === AST_NODE_TYPES.MemberExpression;

    /**
     * Check if there's already a Type import in the file
     */
    const hasTypeImport = () => {
      const program = sourceCode.ast;
      return program.body.some((node) => {
        if (node.type === AST_NODE_TYPES.ImportDeclaration && node.source.value === modulePath) {
          return node.specifiers.some((spec) => {
            if (spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
              return spec.local.name === importName;
            }
            if (spec.type === AST_NODE_TYPES.ImportSpecifier) {
              return spec.imported.type === AST_NODE_TYPES.Identifier && spec.imported.name === 'Type' && spec.local.name === importName;
            }
            return false;
          });
        }
        return false;
      });
    };

    /**
     * Generate import statement if needed
     */
    const generateImportFix = (fixer: TSESLint.RuleFixer): TSESLint.RuleFix | null => {
      if (importFixAdded || hasTypeImport()) {
        return null; // Return null instead of empty array when no fix is needed
      }

      importFixAdded = true;
      const program = sourceCode.ast;
      const imports = program.body.filter((node) => node.type === AST_NODE_TYPES.ImportDeclaration);

      // Check if there's already an import from the same module that we can merge with
      const existingKatamariImport = imports.find((node) =>
        node.type === AST_NODE_TYPES.ImportDeclaration &&
        node.source.value === modulePath
      );

      if (existingKatamariImport) {
        // Merge with existing import from the same module
        const sourceText = sourceCode.getText(existingKatamariImport);
        const updatedImport = sourceText.replace(
          /import\s*{\s*([^}]*?)\s*}\s*from/,
          (_match, existingImports) => {
            const cleanImports = existingImports.trim();
            return `import { ${cleanImports}, Type } from`;
          }
        );
        return fixer.replaceText(existingKatamariImport, updatedImport);
      }

      if (imports.length > 0) {
        // Insert after the last import
        const lastImport = imports[imports.length - 1];
        return fixer.insertTextAfter(lastImport, `\nimport { Type } from '${modulePath}';`);
      } else {
        // Insert at the beginning of the file
        return fixer.insertTextBefore(program, `import { Type } from '${modulePath}';\n`);
      }
    };

    /**
     * Create a fix function that replaces the expression and adds import if needed
     */
    const createFix = (node: TSESTree.Node, replacement: string) => function* (fixer: TSESLint.RuleFixer): Generator<TSESLint.RuleFix> {
      yield fixer.replaceText(node, replacement);
      const importFix = generateImportFix(fixer);
      if (importFix) {
        yield importFix;
      }
    };

    /**
     * Handle typeof checks (e.g., typeof foo === 'string' or 'string' === typeof foo)
     */
    const handleTypeofCheck = (node: TSESTree.BinaryExpression) => {
      const { left, operator, right } = node;

      // Helper to check typeof pattern
      const checkTypeofPattern = (typeofNode: TSESTree.Node, literalNode: TSESTree.Node) => {
        if (typeofNode.type !== AST_NODE_TYPES.UnaryExpression || typeofNode.operator !== 'typeof' ||
            literalNode.type !== AST_NODE_TYPES.Literal || typeof literalNode.value !== 'string') {
          return;
        }

        if (!isSimpleVariable(typeofNode.argument)) {
          return;
        }

        const variable = getVariableName(typeofNode.argument);
        const typeValue = literalNode.value;
        const isNegated = operator === '!==' || operator === '!=';
        const config = typeofChecks[typeValue];

        if (config) {
          const messageId = isNegated ? config.negatedMessageId : config.messageId;
          const replacement = isNegated ? `!${importName}.${config.func}(${variable})` : `${importName}.${config.func}(${variable})`;
          report(node, messageId, { variable }, config.optionKey, replacement);
        }
      };

      // Check for: typeof value === 'string'
      if ((operator === '===' || operator === '!==' || operator === '==' || operator === '!=')) {
        checkTypeofPattern(left, right);
        // Check for: 'string' === typeof value (reversed operands)
        checkTypeofPattern(right, left);
      }
    };

    /**
     * Handle null checks (e.g., foo === null, foo !== null)
     */
    const handleNullCheck = (node: TSESTree.BinaryExpression) => {
      const { left, operator, right } = node;

      if (((isSimpleVariable(left) && right.type === AST_NODE_TYPES.Literal && right.value === null) ||
           (left.type === AST_NODE_TYPES.Literal && left.value === null && isSimpleVariable(right))) &&
          (operator === '===' || operator === '!==')) {

        const variable = left.type === AST_NODE_TYPES.Literal ? getVariableName(right) : getVariableName(left);
        const isNegated = operator === '!==';
        const messageId = isNegated ? 'negatedPreferTypeNull' : 'preferTypeNull';
        const replacement = isNegated ? `!${importName}.isNull(${variable})` : `${importName}.isNull(${variable})`;

        report(node, messageId, { variable }, 'null', replacement);
      }
    };

    /**
     * Handle undefined checks (e.g., foo === undefined, foo !== undefined)
     */
    const handleUndefinedCheck = (node: TSESTree.BinaryExpression) => {
      const { left, operator, right } = node;

      if (((isSimpleVariable(left) && right.type === AST_NODE_TYPES.Identifier && right.name === 'undefined') ||
           (left.type === AST_NODE_TYPES.Identifier && left.name === 'undefined' && isSimpleVariable(right))) &&
          (operator === '===' || operator === '!==')) {

        const variable = (left.type === AST_NODE_TYPES.Identifier && left.name === 'undefined') ? getVariableName(right) : getVariableName(left);
        const isNegated = operator === '!==';
        const messageId = isNegated ? 'negatedPreferTypeUndefined' : 'preferTypeUndefined';
        const replacement = isNegated ? `!${importName}.isUndefined(${variable})` : `${importName}.isUndefined(${variable})`;

        report(node, messageId, { variable }, 'undefined', replacement);
      }
    };

    /**
     * Handle nullable checks (e.g., foo == null, foo != null)
     */
    const handleNullableCheck = (node: TSESTree.BinaryExpression) => {
      const { left, operator, right } = node;

      if (((isSimpleVariable(left) && right.type === AST_NODE_TYPES.Literal && right.value === null) ||
           (left.type === AST_NODE_TYPES.Literal && left.value === null && isSimpleVariable(right))) &&
          (operator === '==' || operator === '!=')) {

        const variable = left.type === AST_NODE_TYPES.Literal ? getVariableName(right) : getVariableName(left);

        if (operator === '==') {
          const replacement = `${importName}.isNullable(${variable})`;
          report(node, 'preferTypeNullable', { variable }, 'nullable', replacement);
        } else if (operator === '!=') {
          const replacement = `${importName}.isNonNullable(${variable})`;
          report(node, 'preferTypeNonNullable', { variable }, 'nonNullable', replacement);
        }
      }
    };

    /**
     * Check if a logical expression is the strict non-nullable pattern
     */
    const isStrictNonNullablePattern = (node: TSESTree.LogicalExpression): { variable: string } | null => {
      if (node.operator !== '&&' ||
          node.left.type !== AST_NODE_TYPES.BinaryExpression || node.left.operator !== '!==' ||
          node.right.type !== AST_NODE_TYPES.BinaryExpression || node.right.operator !== '!==') {
        return null;
      }

      let variable1: string | null = null;
      let variable2: string | null = null;
      let hasNullCheck = false;
      let hasUndefinedCheck = false;

      // Check left side: foo !== null
      if (node.left.right.type === AST_NODE_TYPES.Literal && node.left.right.value === null) {
        variable1 = getVariableName(node.left.left);
        hasNullCheck = true;
      } else if (node.left.left.type === AST_NODE_TYPES.Literal && node.left.left.value === null) {
        variable1 = getVariableName(node.left.right);
        hasNullCheck = true;
      }

      // Check right side: foo !== undefined
      if (node.right.right.type === AST_NODE_TYPES.Identifier && node.right.right.name === 'undefined') {
        variable2 = getVariableName(node.right.left);
        hasUndefinedCheck = true;
      } else if (node.right.left.type === AST_NODE_TYPES.Identifier && node.right.left.name === 'undefined') {
        variable2 = getVariableName(node.right.right);
        hasUndefinedCheck = true;
      }

      // If both checks are on the same variable and cover null and undefined
      if (hasNullCheck && hasUndefinedCheck && variable1 === variable2 && variable1) {
        return { variable: variable1 };
      }

      return null;
    };

    return {
      LogicalExpression: (node) => {
        // Handle foo !== null && foo !== undefined -> Type.isNonNullable(foo)
        const pattern = isStrictNonNullablePattern(node);
        if (pattern) {
          const replacement = `${importName}.isNonNullable(${pattern.variable})`;
          report(node, 'preferTypeNonNullableStrict', { variable: pattern.variable }, 'nonNullableStrict', replacement);
        }
      },

      BinaryExpression: (node) => {
        // Skip if this binary expression is part of a logical expression we've already handled
        if (node.parent && node.parent.type === AST_NODE_TYPES.LogicalExpression) {
          const parent = node.parent;
          if (isStrictNonNullablePattern(parent)) {
            return; // Let the LogicalExpression handler deal with this
          }
        }

        // Handle different types of binary expressions
        handleTypeofCheck(node);
        handleNullCheck(node);
        handleUndefinedCheck(node);
        handleNullableCheck(node);
      }
    };
  }
});
