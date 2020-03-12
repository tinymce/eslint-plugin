import { RuleTester } from 'eslint';
import { noUnimportedPromise } from '../../main/ts/rules/RuleNoUnimportedPromise';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
});

ruleTester.run('no-unimported-promise', noUnimportedPromise, {
  valid: [
    {
      code: 
`
import Promise from 'promise'; 

const a = Promise.resolve(123);
`
    }, {
      code:
`
import Promise from 'promise'; 

const b = new Promise((resolve) => {});
`
    }, {
      code: 'const c = SomethingElse.resolve();'
    }, {
      code: 'const d = new SomethingElse();'
    }
  ],
  invalid: [
    {
      code: 'const a = Promise.resolve(123);',
      errors: [{ message: 'Promise needs a featurefill import since IE 11 doesn\'t have native support.' }],
    },
    {
      code: 'const b = new Promise((resolve) => {});',
      errors: [{ message: 'Promise needs a featurefill import since IE 11 doesn\'t have native support.' }],
    }
  ]
});