import { Linter, Rule } from 'eslint';
import { standard } from '../configs/Standard';
import { noDirectImports } from '../rules/NoDirectImports';
import { noMainModuleImports } from '../rules/NoMainModuleImports';
import { noPathAliasImports } from '../rules/NoPathAliasImports';
import { noUnimportedPromise } from '../rules/NoUnimportedPromise';
import { noEnumsInExportSpecifier } from '../rules/NoEnumsInExportSpecifier';

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