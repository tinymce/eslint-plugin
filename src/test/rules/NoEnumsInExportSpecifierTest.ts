import { RuleTester } from 'eslint';
import { noEnumsInExportSpecifier } from '../../main/ts/rules/NoEnumsInExportSpecifier';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
});

ruleTester.run('no-enums-in-export-specifier', noEnumsInExportSpecifier, {
  valid: [
    {
      code: 'enum A { A, B, C };'
    },
    {
      code: 'const enum B { A, B, C };'
    },
    {
      code: 'export const enum C { A, B, C };'
    },
    {
      code: `
      const NotEnum = true;
      export {
        NotEnum
      };
      `
    },
    {
      code: `
      const isPrototypeOf = 'a';

      export {
        isPrototypeOf
      };
      `
    }
  ],

  invalid: [
    {
      code: `
      enum A { A, B, C };
      export {
        A
      };
      `,
      errors: [{ message: 'Exports of enums needs to be where it\'s being declared.' }]
    },
    {
      code: `
      const enum B { A, B, C };
      export {
        B
      };
      `,
      errors: [{ message: 'Exports of enums needs to be where it\'s being declared.' }]
    }
  ]
});