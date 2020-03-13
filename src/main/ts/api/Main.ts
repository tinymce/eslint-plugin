import { Linter, Rule } from 'eslint';
import { standard } from '../configs/ConfigStandard';
import { noDirectImports } from '../rules/RuleNoDirectImports';
import { noMainModuleImports } from '../rules/RuleNoMainModuleImports';
import { noPathAliasImports } from '../rules/RuleNoPathAliasImports';
import { noUnimportedPromise } from '../rules/RuleNoUnimportedPromise';
import { noEnumsInExportSpecifier } from '../rules/RuleNoEnumsInExportSpecifier';

const rules: Record<string, Rule.RuleModule> = {
  'no-direct-imports': noDirectImports,
  'no-enums-in-export-specifier': noEnumsInExportSpecifier,
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