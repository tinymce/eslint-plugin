// import { RuleTester } from 'eslint';
import { preferFun } from '../../main/ts/rules/PreferFun';
import * as RuleTester from './RuleTester';

const ruleTester = RuleTester.setup();

// const ruleTester = new RuleTester({
//   parser: require.resolve('@typescript-eslint/parser'),
//   parserOptions: { sourceType: 'module' }
// });

// const ruleTester = new RuleTester({
//   language: '@typescript-eslint/parser',
//   languageOptions: {
//     ecmaVersion: 5,
//     sourceType: "module"
//   }
// });

ruleTester.run('prefer-fun', preferFun, {
  valid: [
    {
      code: `
      import { Fun } from '@ephox/katamari';
      const a = Fun.noop;
      `
    },
    {
      code: `
      import { Fun } from '@ephox/katamari';
      const b = Fun.always;
      `
    },
    {
      code: `
      import { Fun } from '@ephox/katamari';
      const c = Fun.never;
      `
    },
    {
      code: `
      const d = Fun.constant('some string');
      const e = { a: Fun.constant(d) };
      const f = Fun.constant(6);
      `
    },
    {
      filename: 'katamari/api/Fun.ts',
      code: `
      const noop = () => { };
      const never = () => false;
      const always = () => true;
      `
    },
    {
      code: `
      let g = 'word';
      const h = () => g;
      const i = () => j;
      const j = { };
      const k = function() { return /a+/; };
      const l = () => \`\${g}\`;
      `
    },
    {
      code: `
      const m = '';
      const n = <T>(): Maybe<T> => l;
      `
    }
  ],
  invalid: [
    {
      code: `
      const a = () => {};
      const b = function () {};
      const c = function () { return; };
      const d = { action() {} };
      `,
      errors: [
        { message: 'Use `Fun.noop` instead of redeclaring a no-op function, eg: `() => {}`' },
        { message: 'Use `Fun.noop` instead of redeclaring a no-op function, eg: `() => {}`' },
        { message: 'Use `Fun.noop` instead of redeclaring a no-op function, eg: `() => {}`' },
        { message: 'Use `Fun.noop` instead of redeclaring a no-op function, eg: `() => {}`' }
      ],
    },
    {
      code: `
      import { Fun } from '@ephox/katamari';
      const e = () => true;
      const f = function () { return true; };
      const g = { a: function () { return true; } };
      const h = Fun.constant(true);
      `,
      errors: [
        { message: 'Use `Fun.always` instead of redeclaring a function that always returns true, eg: `() => true`' },
        { message: 'Use `Fun.always` instead of redeclaring a function that always returns true, eg: `() => true`' },
        { message: 'Use `Fun.always` instead of redeclaring a function that always returns true, eg: `() => true`' },
        { message: 'Use `Fun.always` instead of redeclaring a function that always returns true, eg: `() => true`' }
      ],
    },
    {
      code: `
      import { Fun } from '@ephox/katamari';
      const i = () => false;
      const j = function () { return false; };
      const k = { a: () => false };
      const l = Fun.constant(false);
      `,
      errors: [
        { message: 'Use `Fun.never` instead of redeclaring a function that always returns false, eg: `() => false`' },
        { message: 'Use `Fun.never` instead of redeclaring a function that always returns false, eg: `() => false`' },
        { message: 'Use `Fun.never` instead of redeclaring a function that always returns false, eg: `() => false`' },
        { message: 'Use `Fun.never` instead of redeclaring a function that always returns false, eg: `() => false`' }
      ],
    },
    {
      code: `
      const m = () => 'some string';
      const n = { a: () => m };
      const o = function () { return 6; };
      const p = () => \`template\`;
      `,
      errors: [
        { message: 'Use `Fun.constant` instead of redeclaring a function that always returns the same value, eg: `() => 0`' },
        { message: 'Use `Fun.constant` instead of redeclaring a function that always returns the same value, eg: `() => 0`' },
        { message: 'Use `Fun.constant` instead of redeclaring a function that always returns the same value, eg: `() => 0`' },
        { message: 'Use `Fun.constant` instead of redeclaring a function that always returns the same value, eg: `() => 0`' }
      ],
    },
    {
      code: `
      const q = function(x) { return x; };
      const r = [].map((x) => x);
      `,
      errors: [
        { message: 'Use `Fun.identity` instead of redeclaring a function that always returns the arguments, eg: `(x) => x`' },
        { message: 'Use `Fun.identity` instead of redeclaring a function that always returns the arguments, eg: `(x) => x`' }
      ],
    }
  ]
});
