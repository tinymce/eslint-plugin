import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { typesAtTop } from '../../main/ts/rules/TypesAtTop';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' },
  }
});

ruleTester.run('types-at-top', typesAtTop, {
  valid: [
    {
      code: `
      import { Something } from 'somewhere';

      interface MyInterface {
        value: string;
      }

      type MyType = string;

      enum MyEnum {
        A, B, C
      }

      const myVariable = 'test';

      function myFunction() {
        return 'hello';
      }
      `
    },
    {
      code: `
      import { A } from 'a';
      import { B } from 'b';

      interface First {
        prop: string;
      }

      type Second = number;

      const code = 'after types';
      `
    },
    {
      code: `
      const onlyCode = 'no types here';
      `
    },
    {
      code: `
      import { Test } from 'test';

      const noTypes = 'just code after imports';
      `
    },
    {
      code: `
      import { Utils } from 'utils';

      interface Config {
        name: string;
      }

      type Handler = () => void;

      enum Status {
        ACTIVE,
        INACTIVE
      }

      export const createHandler = (): Handler => {
        return () => {};
      };
      `
    }
  ],
  invalid: [
    {
      code: `
      import { Something } from 'somewhere';

      const myVariable = 'test';

      interface MyInterface {
        value: string;
      }
      `,
      errors: [{ messageId: 'typeNotAtTop' }]
    },
    {
      code: `
      import { A } from 'a';

      function myFunction() {
        return 'hello';
      }

      type MyType = string;
      `,
      errors: [{ messageId: 'typeNotAtTop' }]
    },
    {
      code: `
      import { Test } from 'test';

      const first = 'code';

      interface TestInterface {
        prop: string;
      }

      const second = 'more code';

      enum TestEnum {
        A, B
      }
      `,
      errors: [
        { messageId: 'typeNotAtTop' },
        { messageId: 'typeNotAtTop' }
      ]
    },
    {
      code: `
      import { Utils } from 'utils';

      export const value = 'exported';

      interface Config {
        setting: boolean;
      }
      `,
      errors: [{ messageId: 'typeNotAtTop' }]
    }
  ]
});
