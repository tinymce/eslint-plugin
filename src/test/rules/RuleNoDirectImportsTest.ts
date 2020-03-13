import { RuleTester } from 'eslint';
import { noDirectImports } from '../../main/ts/rules/RuleNoDirectImports';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
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
      errors: [{ message: 'Direct import to @ephox/katmari/lib/main/api/Arr is forbidden.' }]
    },
    {
      code: 'import { Unicode } from \'@ephox/katamari/src/main/ts/ephox/katamari/api/Unicode\';',
      errors: [{ message: 'Direct import to @ephox/katamari/src/main/ts/ephox/katamari/api/Unicode is forbidden.' }]
    }
  ]
});