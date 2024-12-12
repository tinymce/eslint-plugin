// import { RuleTester } from 'eslint';
import { noUnimportedPromise } from '../../main/ts/rules/NoUnimportedPromise';
import * as RuleTester from './RuleTester';

const ruleTester = RuleTester.setup();

// const ruleTester = new RuleTester({
//   parser: require.resolve('@typescript-eslint/parser'),
//   parserOptions: { sourceType: 'module' }
// });

ruleTester.run('no-unimported-promise', noUnimportedPromise, {
  valid: [
    {
      code: `
      import Promise from 'promise';
      const a = Promise.resolve(123);
      `
    }, {
      code: `
      import Promise from 'promise';
      const b = new Promise((resolve) => {});
      `
    }, {
      code: 'const c = SomethingElse.resolve();'
    }, {
      code: 'const d = new SomethingElse();'
    }, {
      code: `
      const Promise = function() { return {}; };
      const e = new Promise();
      const f = Promise.resolve();
      `
    }, {
      code: `
      const Promise = () => ({}) as unknown as PromiseConstructor;
      const g = new Promise();
      const h = Promise.resolve();
      `
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
    },
    {
      code: `
      const fn = function() {
        const Promise = function() { return {}; };
        const c = new Promise();
        const d = Promise.resolve();
      };
      const e = new Promise();
      const f = Promise.resolve();
      `,
      errors: [
        { line: 7, message: 'Promise needs a featurefill import since IE 11 doesn\'t have native support.' },
        { line: 8, message: 'Promise needs a featurefill import since IE 11 doesn\'t have native support.' }
      ]
    }
  ]
});
