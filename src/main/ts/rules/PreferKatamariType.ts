import { ESLintUtils, TSESTree, TSESLint, AST_NODE_TYPES } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

export const preferType = createRule({
  name: 'prefer-katamari-type',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using Type utility functions from katamari instead of manual type checks',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      // {
      //   type: "object",
      //   properties: {
      //     importName: {
      //       type: "string",
      //       description: "The name to use for Type imports (default: 'Type')"
      //     },
      //     modulePath: {
      //       type: "string",
      //       description: "The module path for Type imports (default: '@ephox/katamari')"
      //     }
      //   },
      //   additionalProperties: false
      // }
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
    // const options = context.options[0] || {};
    // const importName = options.importName || 'Type';
    // const modulePath = options.modulePath || '@ephox/katamari';
    const importName = 'Type';
    const modulePath = '@ephox/katamari';
    const sourceCode = context.sourceCode;

    /**
     * Get the variable name from a node (handles complex expressions)
     */
    const getVariableName = (node: TSESTree.Node): string => sourceCode.getText(node);

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
      if (hasTypeImport()) {
        return null; // Return null instead of empty array when no fix is needed
      }

      const program = sourceCode.ast;
      const imports = program.body.filter((node) => node.type === AST_NODE_TYPES.ImportDeclaration);

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

    return {
      LogicalExpression: (node) => {
        // foo !== null && foo !== undefined -> Type.isNonNullable(foo)
        // Handle this with higher priority to avoid conflicts with individual binary expressions
        if (node.operator === '&&' &&
          node.left.type === AST_NODE_TYPES.BinaryExpression && node.left.operator === '!==' &&
          node.right.type === AST_NODE_TYPES.BinaryExpression && node.right.operator === '!==') {

          let variable1; let variable2; let isNullCheck = false; let isUndefinedCheck = false;

          // Check left side: foo !== null
          if (node.left.right.type === AST_NODE_TYPES.Literal && node.left.right.value === null) {
            variable1 = getVariableName(node.left.left);
            isNullCheck = true;
          } else if (node.left.left.type === AST_NODE_TYPES.Literal && node.left.left.value === null) {
            variable1 = getVariableName(node.left.right);
            isNullCheck = true;
          }

          // Check right side: foo !== undefined
          if (node.right.right.type === AST_NODE_TYPES.Identifier && node.right.right.name === 'undefined') {
            variable2 = getVariableName(node.right.left);
            isUndefinedCheck = true;
          } else if (node.right.left.type === AST_NODE_TYPES.Identifier && node.right.left.name === 'undefined') {
            variable2 = getVariableName(node.right.right);
            isUndefinedCheck = true;
          }

          // If both checks are on the same variable and cover null and undefined
          if (isNullCheck && isUndefinedCheck && variable1 === variable2) {
            context.report({
              node,
              messageId: 'preferTypeNonNullableStrict',
              data: { variable: variable1 },
              fix: createFix(node, `${importName}.isNonNullable(${variable1})`)
            });
            return; // Don't process child binary expressions
          }
        }
      },

      BinaryExpression: (node) => {
        // Skip if this binary expression is part of a logical expression we've already handled
        if (node.parent && node.parent.type === AST_NODE_TYPES.LogicalExpression) {
          const parent = node.parent;
          if (parent.operator === '&&' &&
            parent.left.type === AST_NODE_TYPES.BinaryExpression && parent.left.operator === '!==' &&
            parent.right.type === AST_NODE_TYPES.BinaryExpression && parent.right.operator === '!==') {
            // Let the LogicalExpression handler deal with this
            return;
          }
        }
        const { left, operator, right } = node;

        // typeof checks: typeof foo === 'string', typeof foo !== 'string'
        if (left.type === AST_NODE_TYPES.UnaryExpression && left.operator === 'typeof' &&
          (operator === '===' || operator === '!==' || operator === '==' || operator === '!=') &&
          right.type === AST_NODE_TYPES.Literal && typeof right.value === 'string') {

          // Skip complex expressions that are not simple identifiers or member expressions
          if (left.argument.type !== AST_NODE_TYPES.Identifier && left.argument.type !== AST_NODE_TYPES.MemberExpression) {
            return;
          }

          const variable = getVariableName(left.argument);
          const typeValue = right.value;
          const isNegated = operator === '!==' || operator === '!=';

          type MessageId = 'preferTypeString' | 'preferTypeNumber' | 'preferTypeBoolean' | 'preferTypeFunction' | 'preferTypeObject' |
            'negatedPreferTypeString' | 'negatedPreferTypeNumber' | 'negatedPreferTypeBoolean' | 'negatedPreferTypeFunction' | 'negatedPreferTypeObject';

          const typeMap: Record<string, { func: string; messageId: MessageId }> = {
            string: { func: 'isString', messageId: isNegated ? 'negatedPreferTypeString' : 'preferTypeString' },
            number: { func: 'isNumber', messageId: isNegated ? 'negatedPreferTypeNumber' : 'preferTypeNumber' },
            boolean: { func: 'isBoolean', messageId: isNegated ? 'negatedPreferTypeBoolean' : 'preferTypeBoolean' },
            function: { func: 'isFunction', messageId: isNegated ? 'negatedPreferTypeFunction' : 'preferTypeFunction' },
            object: { func: 'isObject', messageId: isNegated ? 'negatedPreferTypeObject' : 'preferTypeObject' }
          };

          if (typeMap[typeValue]) {
            const { func, messageId } = typeMap[typeValue];
            const replacement = isNegated ? `!${importName}.${func}(${variable})` : `${importName}.${func}(${variable})`;

            context.report({
              node,
              messageId,
              data: { variable },
              fix: createFix(node, replacement)
            });
          }
        }

        // null checks: foo === null, foo !== null
        if (((left.type === AST_NODE_TYPES.Identifier || left.type === AST_NODE_TYPES.MemberExpression) &&
          right.type === AST_NODE_TYPES.Literal && right.value === null) ||
          (left.type === AST_NODE_TYPES.Literal && left.value === null &&
            (right.type === AST_NODE_TYPES.Identifier || right.type === AST_NODE_TYPES.MemberExpression))) {

          const variable = left.type === AST_NODE_TYPES.Literal ? getVariableName(right) : getVariableName(left);
          const isNegated = operator === '!==';

          if (operator === '===' || operator === '!==') {
            const messageId = isNegated ? 'negatedPreferTypeNull' : 'preferTypeNull';
            const replacement = isNegated ? `!${importName}.isNull(${variable})` : `${importName}.isNull(${variable})`;

            context.report({
              node,
              messageId,
              data: { variable },
              fix: createFix(node, replacement)
            });
          }
        }

        // undefined checks: foo === undefined, foo !== undefined
        if (((left.type === AST_NODE_TYPES.Identifier || left.type === AST_NODE_TYPES.MemberExpression) &&
          right.type === AST_NODE_TYPES.Identifier && right.name === 'undefined') ||
          (left.type === AST_NODE_TYPES.Identifier && left.name === 'undefined' &&
            (right.type === AST_NODE_TYPES.Identifier || right.type === AST_NODE_TYPES.MemberExpression))) {

          const variable = (left.type === AST_NODE_TYPES.Identifier && left.name === 'undefined') ? getVariableName(right) : getVariableName(left);
          const isNegated = operator === '!==';

          if (operator === '===' || operator === '!==') {
            const messageId = isNegated ? 'negatedPreferTypeUndefined' : 'preferTypeUndefined';
            const replacement = isNegated ? `!${importName}.isUndefined(${variable})` : `${importName}.isUndefined(${variable})`;

            context.report({
              node,
              messageId,
              data: { variable },
              fix: createFix(node, replacement)
            });
          }
        }

        // nullable checks: foo == null, foo != null
        if (((left.type === AST_NODE_TYPES.Identifier || left.type === AST_NODE_TYPES.MemberExpression) &&
          right.type === AST_NODE_TYPES.Literal && right.value === null) ||
          (left.type === AST_NODE_TYPES.Literal && left.value === null &&
            (right.type === AST_NODE_TYPES.Identifier || right.type === AST_NODE_TYPES.MemberExpression))) {

          const variable = left.type === AST_NODE_TYPES.Literal ? getVariableName(right) : getVariableName(left);

          if (operator === '==') {
            context.report({
              node,
              messageId: 'preferTypeNullable',
              data: { variable },
              fix: createFix(node, `${importName}.isNullable(${variable})`)
            });
          } else if (operator === '!=') {
            context.report({
              node,
              messageId: 'preferTypeNonNullable',
              data: { variable },
              fix: createFix(node, `${importName}.isNonNullable(${variable})`)
            });
          }
        }
      }
    };
  }
});
