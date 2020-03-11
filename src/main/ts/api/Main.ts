import { noDirectImports } from '../rules/RuleNoDirectImports';
import { standard } from "../configs/ConfigStandard";
import { Rule, Linter } from 'eslint';

const rules: Record<string, Rule.RuleModule> = {
  'no-direct-imports': noDirectImports
};

const configs: Record<string, Linter.Config> = {
  standard
}

module.exports = {
  rules,
  configs
};