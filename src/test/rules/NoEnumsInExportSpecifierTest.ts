import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noEnumsInExportSpecifier } from '../../main/ts/rules/NoEnumsInExportSpecifier';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    }
  }
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
      errors: [{ messageId: 'noEnumsInExportSpecifier' }]
    },
    {
      code: `
      const enum B { A, B, C };
      export {
        B
      };
      `,
      errors: [{ messageId: 'noEnumsInExportSpecifier' }]
    }
  ]
});
