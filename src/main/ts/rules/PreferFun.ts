import { TSESTree } from '@typescript-eslint/typescript-estree';
import { Rule } from 'eslint';
import {
  ArrowFunctionExpression, CallExpression, Expression, FunctionExpression, Literal, MemberExpression, RegExpLiteral, SpreadElement, Statement
} from 'estree';
import * as path from 'path';
import { extractModuleSpecifier } from '../utils/ExtractUtils';
import { findVariableFromScope, isConstantVariable, isVarUsedBeforeDeclaration } from '../utils/ScopeUtils';

type FuncExpression = ArrowFunctionExpression | FunctionExpression;

const enum Option {
  Noop = 'Noop',
  Never = 'Never',
  Always = 'Always',
  Constant = 'Constant',
  Identity = 'Identity'
}

const isKatamariFunModule = (filePath: string): boolean => {
  const pathWithoutExt = filePath.replace(/\.[tj]s$/, '');
  return pathWithoutExt.endsWith(path.join('katamari', 'api', 'Fun'));
};

const isKatamariFunConstant = (context: Rule.RuleContext, node: MemberExpression) => {
  const property = node.property;
  const object = node.object;

  const isFunModule = object.type === 'Identifier' && object.name === 'Fun';
  const isConstantFunction = property.type === 'Identifier' && property.name === 'constant';

  if (isFunModule && isConstantFunction) {
    // Ensure the Fun identifier is referring to the import from katamari
    const funVar = findVariableFromScope(context, 'Fun');
    if (funVar !== undefined && funVar.defs.length > 0) {
      const def = funVar.defs[0];
      const parent = def.parent;
      if (def.type === 'ImportBinding' && parent?.type === 'ImportDeclaration') {
        return extractModuleSpecifier(parent).includes('katamari');
      }
    }
  }

  return false;
};

const isRegExpLiteral = (literal: Literal): literal is RegExpLiteral =>
  Object.prototype.hasOwnProperty.call(literal, 'regex');

const isBooleanLiteral = (expr: Expression | SpreadElement): expr is Literal => {
  if (expr.type === 'Literal') {
    return expr.raw === 'false' || expr.raw === 'true';
  } else {
    return false;
  }
};

const isConstant = (context: Rule.RuleContext, func: FuncExpression, obj: Expression): boolean => {
  if (func.params.length !== 0 || hasTypeParameters(func)) {
    // If the function has type generics or arguments then treat it as not being constant
    return false;
  } else if (obj.type === 'Literal') {
    // Regexes can maintain state, so they aren't considered a constant
    return !isRegExpLiteral(obj);
  } else if (obj.type === 'TemplateLiteral') {
    // If a template does variable replacement, then it's not a constant
    return obj.expressions.length === 0;
  } else if (obj.type === 'Identifier') {
    const variable = findVariableFromScope(context, obj.name);
    return variable !== undefined && isConstantVariable(variable) && !isVarUsedBeforeDeclaration(obj, variable);
  } else {
    return false;
  }
};

const isIdentity = (func: FuncExpression, expr: Expression) => {
  if (func.params.length === 1 && !hasTypeParameters(func)) {
    const param = func.params[0];
    return param.type === 'Identifier' && expr.type === 'Identifier' && param.name === expr.name;
  } else {
    return false;
  }
};

const hasTypeParameters = (func: FuncExpression): boolean => {
  const params = (func as TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression).typeParameters;
  // const params = (func as TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression).typeParameters || (func as TSESTree.CallExpression).typeArguments;
  if (params !== undefined && params.type === 'TSTypeParameterDeclaration') {
    return params.params.length > 0;
  } else {
    return false;
  }
};

const extractFunctionBodyExpression = (func: FuncExpression, body: Statement | Expression | null): Statement | Expression | null => {
  if (body === null) {
    return body;
  } else if (body.type === 'BlockStatement') {
    const funcBody = body.body;
    if (funcBody.length === 1) {
      return extractFunctionBodyExpression(func, funcBody[0]);
    } else if (funcBody.length === 0) {
      return null;
    } else {
      return body;
    }
  } else if (body.type === 'ReturnStatement' && body.argument !== undefined) {
    return extractFunctionBodyExpression(func, body.argument);
  } else {
    return body;
  }
};

export const preferFun: Rule.RuleModule = {
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

    const report = (func: CallExpression | FuncExpression, type: Option) => {
      if (options[type.toLowerCase()] !== false) {
        context.report({
          node: func,
          messageId: `prefer${type}`
        });
      }
    };

    const reportIfRequired = (func: FuncExpression, expr: Expression | null) => {
      const numArgs = func.params.length;
      if (numArgs === 0) {
        if (expr === null) {
          report(func, Option.Noop);
        } else if (isBooleanLiteral(expr)) {
          report(func, expr.raw === 'true' ? Option.Always : Option.Never);
        // We're dealing with an identifier, primitive value, regex or similar here
        } else if (isConstant(context, func, expr)) {
          report(func, Option.Constant);
        }
      } else if (numArgs === 1) {
        if (expr !== null && isIdentity(func, expr)) {
          report(func, Option.Identity);
        }
      }
    };

    const validateFunctionBody = (func: FuncExpression, body: Statement | Expression) => {
      const returnExpr = extractFunctionBodyExpression(func, body);
      if (returnExpr === null || returnExpr.type === 'Literal' || returnExpr.type === 'Identifier' || returnExpr.type === 'TemplateLiteral') {
        reportIfRequired(func, returnExpr);
      }
    };

    // Ignore cases in the actual Katamari Fun module
    if (isKatamariFunModule(context.getFilename())) {
      return {};
    } else {
      return {
        FunctionExpression: (node) => {
          if (node.type === 'FunctionExpression' && node.params.length <= 1) {
            validateFunctionBody(node, node.body);
          }
        },
        ArrowFunctionExpression: (node) => {
          if (node.type === 'ArrowFunctionExpression' && node.params.length <= 1) {
            validateFunctionBody(node, node.body);
          }
        },
        CallExpression: (node) => {
          if (node.type === 'CallExpression') {
            const callee = node.callee;
            if (callee.type === 'MemberExpression' && node.arguments.length === 1 && isKatamariFunConstant(context, callee)) {
              const arg = node.arguments[0];
              // We only care about Fun.constant(false) or Fun.constant(true) here
              if (isBooleanLiteral(arg)) {
                report(node, arg.raw === 'true' ? Option.Always : Option.Never);
              }
            }
          }
        }
      };
    }
  }
};
