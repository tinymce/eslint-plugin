import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { RuleContext, Scope } from '@typescript-eslint/utils/ts-eslint';
import * as path from 'path';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { findVariableFromScope, isConstantVariable, isVarUsedBeforeDeclaration } from '../utils/ScopeUtils';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/tinymce/eslint-plugin'
);

type FuncExpression = TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression;

type Option =
  | 'Noop'
  | 'Never'
  | 'Always'
  | 'Constant'
  | 'Identity';

const isKatamariFunModule = (filePath: string): boolean => {
  const pathWithoutExt = filePath.replace(/\.[tj]s$/, '');
  return pathWithoutExt.endsWith(path.join('katamari', 'api', 'Fun'));
};

const isKatamariFunConstant = (context: RuleContext<
  'preferNoop' | 'preferAlways' | 'preferNever' | 'preferConstant' | 'preferIdentity', [{
    noop: boolean;
    always: boolean;
    never: boolean;
    constant: boolean;
    identity: boolean;
  }]
>, node: TSESTree.MemberExpression) => {
  const property = node.property;
  const object = node.object;

  const isFunModule = object.type === TSESTree.AST_NODE_TYPES.Identifier && object.name === 'Fun';
  const isConstantFunction = property.type === TSESTree.AST_NODE_TYPES.Identifier && property.name === 'constant';

  if (isFunModule && isConstantFunction) {
    // Ensure the Fun identifier is referring to the import from katamari
    const funVar = findVariableFromScope(context, 'Fun', node);
    if (funVar !== undefined && funVar.defs.length > 0) {
      const def = funVar.defs[0];
      const parent = def.parent;
      if (def.type === Scope.DefinitionType.ImportBinding && parent?.type === TSESTree.AST_NODE_TYPES.ImportDeclaration) {
        return extractModuleSpecifier(parent).includes('katamari');
      }
    }
  }

  return false;
};

const isRegExpLiteral = (literal: TSESTree.Literal): literal is TSESTree.RegExpLiteral =>
  Object.prototype.hasOwnProperty.call(literal, 'regex');

const isBooleanLiteral = (expr: TSESTree.Expression | TSESTree.SpreadElement): expr is TSESTree.Literal => {
  if (expr.type === TSESTree.AST_NODE_TYPES.Literal) {
    return expr.raw === 'false' || expr.raw === 'true';
  } else {
    return false;
  }
};

const isConstant = (context: RuleContext<
  'preferNoop' | 'preferAlways' | 'preferNever' | 'preferConstant' | 'preferIdentity', [{
    noop: boolean;
    always: boolean;
    never: boolean;
    constant: boolean;
    identity: boolean;
  }]
>, func: FuncExpression, obj: TSESTree.Expression, node: TSESTree.Node): boolean => {
  if (func.params.length !== 0 || hasTypeParameters(func)) {
    // If the function has type generics or arguments then treat it as not being constant
    return false;
  } else if (obj.type === TSESTree.AST_NODE_TYPES.Literal) {
    // Regexes can maintain state, so they aren't considered a constant
    return !isRegExpLiteral(obj);
  } else if (obj.type === TSESTree.AST_NODE_TYPES.TemplateLiteral) {
    // If a template does variable replacement, then it's not a constant
    return obj.expressions.length === 0;
  } else if (obj.type === TSESTree.AST_NODE_TYPES.Identifier) {
    const variable = findVariableFromScope(context, obj.name, node);
    return variable !== undefined && isConstantVariable(variable) && !isVarUsedBeforeDeclaration(obj, variable);
  } else {
    return false;
  }
};

const isIdentity = (func: FuncExpression, expr: TSESTree.Expression) => {
  if (func.params.length === 1 && !hasTypeParameters(func)) {
    const param = func.params[0];
    return param.type === TSESTree.AST_NODE_TYPES.Identifier && expr.type === TSESTree.AST_NODE_TYPES.Identifier && param.name === expr.name;
  } else {
    return false;
  }
};

const hasTypeParameters = (func: FuncExpression): boolean => {
  const params = (func as TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression).typeParameters;
  if (params?.type === TSESTree.AST_NODE_TYPES.TSTypeParameterDeclaration) {
    return params.params.length > 0;
  } else {
    return false;
  }
};

const extractFunctionBodyExpression =
  (func: FuncExpression, body: TSESTree.Statement | TSESTree.Expression | null): TSESTree.Statement | TSESTree.Expression | null => {
    if (body === null) {
      return body;
    } else if (body.type === TSESTree.AST_NODE_TYPES.BlockStatement) {
      const funcBody = body.body;
      if (funcBody.length === 1) {
        return extractFunctionBodyExpression(func, funcBody[0]);
      } else if (funcBody.length === 0) {
        return null;
      } else {
        return body;
      }
    } else if (body.type === TSESTree.AST_NODE_TYPES.ReturnStatement && body.argument !== undefined) {
      return extractFunctionBodyExpression(func, body.argument);
    } else {
      return body;
    }
  };

export const preferFun = createRule({
  name: 'prefer-fun',
  defaultOptions: [{
    noop: true,
    always: true,
    never: true,
    constant: true,
    identity: true
  }],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using the Katamari Fun helper functions, instead of inline functions.'
    },
    messages: {
      preferNoop: 'Use `Fun.noop` instead of redeclaring a no-op function, eg: `() => {}`',
      preferAlways: 'Use `Fun.always` instead of redeclaring a function that always returns true, eg: `() => true`',
      preferNever: 'Use `Fun.never` instead of redeclaring a function that always returns false, eg: `() => false`',
      preferConstant: 'Use `Fun.constant` instead of redeclaring a function that always returns the same value, eg: `() => 0`',
      preferIdentity: 'Use `Fun.identity` instead of redeclaring a function that always returns the arguments, eg: `(x) => x`'
    },
    schema: [
      {
        type: 'object',
        properties: {
          noop: { type: 'boolean' },
          always: { type: 'boolean' },
          never: { type: 'boolean' },
          constant: { type: 'boolean' },
          identity: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ]
  },
  create: (context) => {
    const options = context.options[0] || {};

    const report = (func: TSESTree.CallExpression | FuncExpression, type: Option) => {
      const lowercaseType = type.toLowerCase() as keyof typeof options;
      if (options[lowercaseType] !== false) {
        context.report({
          node: func,
          messageId: `prefer${type}`
        });
      }
    };

    const reportIfRequired = (func: FuncExpression, expr: TSESTree.Expression | null, node: TSESTree.Node) => {
      const numArgs = func.params.length;
      if (numArgs === 0) {
        if (expr === null) {
          report(func, 'Noop');
        } else if (isBooleanLiteral(expr)) {
          report(func, expr.raw === 'true' ? 'Always' : 'Never');
        // We're dealing with an identifier, primitive value, regex or similar here
        } else if (isConstant(context, func, expr, node)) {
          report(func, 'Constant');
        }
      } else if (numArgs === 1) {
        if (expr !== null && isIdentity(func, expr)) {
          report(func, 'Identity');
        }
      }
    };

    const validateFunctionBody = (func: FuncExpression, body: TSESTree.Statement | TSESTree.Expression, node: TSESTree.Node) => {
      const returnExpr = extractFunctionBodyExpression(func, body);
      if (returnExpr === null ||
        returnExpr.type === TSESTree.AST_NODE_TYPES.Literal ||
        returnExpr.type === TSESTree.AST_NODE_TYPES.Identifier ||
        returnExpr.type === TSESTree.AST_NODE_TYPES.TemplateLiteral) {
        reportIfRequired(func, returnExpr, node);
      }
    };

    // Ignore cases in the actual Katamari Fun module
    if (isKatamariFunModule(context.filename)) {
      return {};
    } else {
      return {
        FunctionExpression: (node) => {
          if (node.type === TSESTree.AST_NODE_TYPES.FunctionExpression && node.params.length <= 1) {
            validateFunctionBody(node, node.body, node);
          }
        },
        ArrowFunctionExpression: (node) => {
          if (node.type === TSESTree.AST_NODE_TYPES.ArrowFunctionExpression && node.params.length <= 1) {
            validateFunctionBody(node, node.body, node);
          }
        },
        CallExpression: (node) => {
          if (node.type === TSESTree.AST_NODE_TYPES.CallExpression) {
            const callee = node.callee;
            if (callee.type === TSESTree.AST_NODE_TYPES.MemberExpression && node.arguments.length === 1 && isKatamariFunConstant(context, callee)) {
              const arg = node.arguments[0];
              // We only care about Fun.constant(false) or Fun.constant(true) here
              if (isBooleanLiteral(arg)) {
                report(node, arg.raw === 'true' ? 'Always' : 'Never');
              }
            }
          }
        }
      };
    }
  }
});
