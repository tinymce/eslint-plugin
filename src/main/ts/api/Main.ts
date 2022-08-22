import { Linter, Rule } from 'eslint';
import { editor } from '../configs/Editor';
import { standard } from '../configs/Standard';
import { noDirectEditorOptions } from '../rules/NoDirectEditorOptions';
import { noDirectImports } from '../rules/NoDirectImports';
import { noEnumsInExportSpecifier } from '../rules/NoEnumsInExportSpecifier';
import { noImplicitDomGlobals } from '../rules/NoImplicitDomGlobals';
import { noMainModuleImports } from '../rules/NoMainModuleImports';
import { noPathAliasImports } from '../rules/NoPathAliasImports';
import { noUnimportedPromise } from '../rules/NoUnimportedPromise';
import { preferFun } from '../rules/PreferFun';
import { preferMcAgar } from '../rules/PreferMcAgar';

const rules: Record<string, Rule.RuleModule> = {
  'no-direct-editor-options': noDirectEditorOptions,
  'no-direct-imports': noDirectImports,
  'no-enums-in-export-specifier': noEnumsInExportSpecifier,
  'no-main-module-imports': noMainModuleImports,
  'no-path-alias-imports': noPathAliasImports,
  'no-unimported-promise': noUnimportedPromise,
  'no-implicit-dom-globals': noImplicitDomGlobals,
  'prefer-fun': preferFun,
  'prefer-mcagar': preferMcAgar
};

const configs: Record<string, Linter.Config> = {
  standard,
  editor
};

module.exports = {
  rules,
  configs
};