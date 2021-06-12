import { Rule, Scope } from 'eslint';
import { Identifier } from 'estree';

export const findVariableFromScope = (context: Rule.RuleContext, name: string): Scope.Variable | undefined => {
  let scope: Scope.Scope | null = context.getScope();
  while (scope && scope.type !== 'global') {
    const foundVar = scope.variables.find((v) => v.name === name);
    if (foundVar !== undefined) {
      return foundVar;
    }
    scope = scope.upper;
  }
  return undefined;
};

export const hasVariableInScope = (context: Rule.RuleContext, name: string) =>
  findVariableFromScope(context, name) !== undefined;

export const isConstantVariable = (variable: Scope.Variable) => {
  const def = variable.defs[0];
  if (def !== undefined && def.parent?.type === 'VariableDeclaration') {
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