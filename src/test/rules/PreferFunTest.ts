import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { preferFun } from '../../main/ts/rules/PreferFun';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
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
        { messageId: 'preferNoop' },
        { messageId: 'preferNoop' },
        { messageId: 'preferNoop' },
        { messageId: 'preferNoop' }
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
        { messageId: 'preferAlways' },
        { messageId: 'preferAlways' },
        { messageId: 'preferAlways' },
        { messageId: 'preferAlways' }
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
        { messageId: 'preferNever' },
        { messageId: 'preferNever' },
        { messageId: 'preferNever' },
        { messageId: 'preferNever' }
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
        { messageId: 'preferConstant' },
        { messageId: 'preferConstant' },
        { messageId: 'preferConstant' },
        { messageId: 'preferConstant' }
      ],
    },
    {
      code: `
      const q = function(x) { return x; };
      const r = [].map((x) => x);
      `,
      errors: [
        { messageId: 'preferIdentity' },
        { messageId: 'preferIdentity' },
      ],
    }
  ]
});
