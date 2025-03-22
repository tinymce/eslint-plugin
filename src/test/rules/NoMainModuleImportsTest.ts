import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noMainModuleImports } from '../../main/ts/rules/NoMainModuleImports';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    sourceType: 'module'
  }
});

ruleTester.run('no-main-module-imports', noMainModuleImports, {
  valid: [
    {
      code: 'import { A } from \'./Main\';',
      filename: 'src/demo/ts/File.ts',
    },
    {
      code: 'import { B } from \'../api/Main\';',
      filename: 'src/demo/ts/File.ts',
    },
    {
      code: 'import { A } from \'./Main\';',
      filename: 'src/test/ts/File.ts',
    },
    {
      code: 'import { B } from \'../api/Main\';',
      filename: 'src/test/ts/File.ts',
    },
    {
      code: 'import { A } from \'./SomethingNotMain\';',
      filename: 'src/main/ts/api/File.ts'
    },
    {
      code: 'import { B } from \'../api/SomethingNotMain\';',
      filename: 'src/main/ts/core/File.ts',
    },
    // Windows filepaths
    {
      code: 'import { A } from \'./SomethingNotMain\';',
      filename: 'src\\main\\ts\\api\\File.ts',
    },
    {
      code: 'import { B } from \'../api/SomethingNotMain\';',
      filename: 'src\\main\\ts\\core\\File.ts',
    }
  ],
  invalid: [
    {
      code: 'import { A } from \'./Main\';',
      filename: 'src/main/ts/api/File.ts',
      errors: [{ messageId: 'noMainImport' }]
    },
    {
      code: 'import { B } from \'../api/Main\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ messageId: 'noMainImport' }]
    },
    {
      code: 'import { A } from \'ephox/swag/api/Main\';',
      filename: 'src/test/ts/File.ts',
      errors: [{ messageId: 'noMainImport' }]
    },
    {
      code: 'import { A } from \'ephox/swag/api/Main\';',
      filename: 'src/demo/ts/Demo.ts',
      errors: [{ messageId: 'noMainImport' }]
    },
    // Windows filepaths
    {
      code: 'import { A } from \'./Main\';',
      filename: 'src\\main\\ts\\api\\File.ts',
      errors: [{ messageId: 'noMainImport' }]
    },
    {
      code: 'import { B } from \'../api/Main\';',
      filename: 'src\\main\\ts\\core\\File.ts',
      errors: [{ messageId: 'noMainImport' }]
    }
  ]
});
