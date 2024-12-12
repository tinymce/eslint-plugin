import { RuleTester } from 'eslint';
import { RuleTester as TypeScriptRuleTester } from '@typescript-eslint/rule-tester';

import * as TSEslintParser from '@typescript-eslint/parser';

const setup = () => new RuleTester({
  languageOptions: {
    parser: TSEslintParser,
    ecmaVersion: 5,
    sourceType: "module"
  }
});

const setupTypescriptRuleTester = () => new TypeScriptRuleTester({
    languageOptions: {
        sourceType: 'module'
    }
});

export {
    setup,
    setupTypescriptRuleTester
}
