import { Linter, Rule } from 'eslint';
import { standard } from '../configs/ConfigStandard';
import { noDirectImports } from '../rules/RuleNoDirectImports';
import { noMainModuleImports } from '../rules/RuleNoMainModuleImports';

const rules: Record<string, Rule.RuleModule> = {
  'no-direct-imports': noDirectImports,
  'no-main-module-imports': noMainModuleImports
};

const configs: Record<string, Linter.Config> = {
  standard
}

module.exports = {
  rules,
  configs
};