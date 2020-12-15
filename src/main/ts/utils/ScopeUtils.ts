import { Rule, Scope } from 'eslint';
import { exists } from './Arr';
import Variable = Scope.Variable;

export const hasVariableInScope = (context: Rule.RuleContext, name: string) => {
  let scope: Scope.Scope | null = context.getScope();
  while (scope && scope.type !== 'global') {
    if (exists(scope.variables, (v) => v.name === name)) {
      return true;
    }
    scope = scope.upper;
  }
  return false;
};

export const findVariableFromScope = (context: Rule.RuleContext, name: string): Variable | undefined => {
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