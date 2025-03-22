import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noDirectImports } from '../../main/ts/rules/NoDirectImports';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
});

ruleTester.run('no-direct-imports', noDirectImports, {
  valid: [
    {
      code: 'import { Fun } from \'@ephox/katmari\';'
    }
  ],

  invalid: [
    {
      code: 'import { Arr } from \'@ephox/katmari/lib/main/api/Arr\';',
      errors: [{ messageId: 'noDirectImport' }]
    },
    {
      code: 'import { Unicode } from \'@ephox/katamari/src/main/ts/ephox/katamari/api/Unicode\';',
      errors: [{ messageId: 'noDirectImport' }]
    }
  ]
});
