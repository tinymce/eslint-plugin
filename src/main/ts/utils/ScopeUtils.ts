import { Rule, Scope } from 'eslint';
import { exists } from './Arr';

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