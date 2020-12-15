import { RuleTester } from 'eslint';
import { preferFun } from '../../main/ts/rules/PreferFun';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
});

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
      const d = () => 'some string';
      const e = { a: () => d };
      const f = function () { return 6; };
      `
    },
    {
      filename: 'katamari/api/Fun.ts',
      code: `
      const noop = () => { };
      const never = () => false;
      const always = () => true;
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
    }
  ]
});