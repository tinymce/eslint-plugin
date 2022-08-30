import { RuleTester } from 'eslint';
import { noMainModuleImports } from '../../main/ts/rules/NoMainModuleImports';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
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
      errors: [{ message: 'Direct import to Main module is forbidden.' }]
    },
    {
      code: 'import { B } from \'../api/Main\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ message: 'Direct import to Main module is forbidden.' }]
    },
    {
      code: 'import { A } from \'ephox/swag/api/Main\';',
      filename: 'src/test/ts/File.ts',
      errors: [{ message: 'Direct import to Main module is forbidden.' }]
    },
    {
      code: 'import { A } from \'ephox/swag/api/Main\';',
      filename: 'src/demo/ts/Demo.ts',
      errors: [{ message: 'Direct import to Main module is forbidden.' }]
    },
    // Windows filepaths
    {
      code: 'import { A } from \'./Main\';',
      filename: 'src\\main\\ts\\api\\File.ts',
      errors: [{ message: 'Direct import to Main module is forbidden.' }]
    },
    {
      code: 'import { B } from \'../api/Main\';',
      filename: 'src\\main\\ts\\core\\File.ts',
      errors: [{ message: 'Direct import to Main module is forbidden.' }]
    }
  ]
});