import { Linter, Rule } from 'eslint';
import { standard } from '../configs/ConfigStandard';
import { noDirectImports } from '../rules/RuleNoDirectImports';
import { noMainModuleImports } from '../rules/RuleNoMainModuleImports';
import { noPathAliasImports } from '../rules/RuleNoPathAliasImports';
import { noUnimportedPromise } from '../rules/RuleNoUnimportedPromise';

const rules: Record<string, Rule.RuleModule> = {
  'no-direct-imports': noDirectImports,
  'no-main-module-imports': noMainModuleImports,
  'no-path-alias-imports': noPathAliasImports,
  'no-unimported-promise': noUnimportedPromise
};

const configs: Record<string, Linter.Config> = {
  standard
}

module.exports = {
  rules,
  configs
};