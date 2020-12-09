import { Rule } from 'eslint';
import { ArrowFunctionExpression, Expression, FunctionExpression, Literal, Statement } from 'estree';
import * as path from 'path';

const isKatamariFunModule = (filePath: string): boolean => {
  const pathWithoutExt = filePath.replace(/\.[tj]s$/, '');
  return pathWithoutExt.endsWith(path.join('katamari', 'api', 'Fun'));
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
      preferNever: 'Use `Fun.never` instead of redeclaring a function that always returns false, eg: `() => false`'
    }
  },
  create: (context) => {
    const reportIfRequired = (func: FunctionExpression | ArrowFunctionExpression, literal: Literal | null) => {
      if (literal === null) {
        context.report({
          node: func,
          messageId: 'preferNoop'
        });
      } else if (literal.raw === 'true') {
        context.report({
          node: func,
          messageId: 'preferAlways'
        });
      } else if (literal.raw === 'false') {
        context.report({
          node: func,
          messageId: 'preferNever'
        });
      }
    };

    const validateFunctionBody = (func: FunctionExpression | ArrowFunctionExpression, body: Statement | Expression) => {
      if (body.type === 'BlockStatement') {
        const funcBody = body.body;
        if (funcBody.length === 1) {
          validateFunctionBody(func, funcBody[0]);
        } else if (funcBody.length === 0) {
          context.report({
            node: func,
            messageId: 'preferNoop'
          });
        }
      } else if (body.type === 'ReturnStatement') {
        if (body.argument === null || body.argument?.type === 'Literal') {
          reportIfRequired(func, body.argument);
        }
      } else if (body.type === 'Literal') {
        reportIfRequired(func, body);
      }
    };

    // Ignore cases in the actual Katamari Fun module
    if (isKatamariFunModule(context.getFilename())) {
      return {};
    } else {
      return {
        FunctionExpression: (node) => {
          if (node.type === 'FunctionExpression' && node.params.length === 0) {
            validateFunctionBody(node, node.body);
          }
        },
        ArrowFunctionExpression: (node) => {
          if (node.type === 'ArrowFunctionExpression' && node.params.length === 0) {
            validateFunctionBody(node, node.body);
          }
        }
      };
    }
  }
};