import { TSESTree } from '@typescript-eslint/utils';
import { RuleContext, Scope } from '@typescript-eslint/utils/ts-eslint';
import { Identifier } from 'estree';

export const findVariableFromScope = (context: RuleContext<string, readonly unknown[]>, name: string, node: TSESTree.Node): Scope.Variable | undefined => {
  let scope: Scope.Scope | null | undefined = context.sourceCode.getScope(node);
  while (scope && scope.type !== Scope.ScopeType.global) {
    const foundVar = scope.variables.find((v) => v.name === name);
    if (foundVar !== undefined) {
      return foundVar;
    }
    scope = scope.upper;
  }
  return undefined;
};

export const hasVariableInScope = (context: RuleContext<string, readonly unknown[]>, name: string, node: TSESTree.Node) =>
  findVariableFromScope(context, name, node) !== undefined;

export const isConstantVariable = (variable: Scope.Variable) => {
  const def = variable.defs[0];
  if (def !== undefined && def.parent?.type === TSESTree.AST_NODE_TYPES.VariableDeclaration) {
    return def.parent.kind === 'const';
  } else {
    return false;
  }
};

export const isVarUsedBeforeDeclaration = (identifier: Identifier, definition: Scope.Variable) => {
  const definitionLoc = definition.identifiers[0]?.loc?.start;
  const currentLoc = identifier.loc?.start;
  if (definitionLoc !== undefined && currentLoc !== undefined) {
    return definitionLoc.line >= currentLoc.line;
  } else {
    // We don't know the location, so just assume the identifier is used before the variable declaration
    return true;
  }
};
