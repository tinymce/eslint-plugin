// import { RuleTester } from 'eslint';
import { noPathAliasImports } from '../../main/ts/rules/NoPathAliasImports';
import * as RuleTester from './RuleTester';

const ruleTester = RuleTester.setup();

// const ruleTester = new RuleTester({
//   parser: require.resolve('@typescript-eslint/parser'),
//   parserOptions: { sourceType: 'module' }
// });

ruleTester.run('no-path-alias-imports', noPathAliasImports, {
  valid: [
    {
      code: 'import { A } from \'ephox/something/something\';',
      filename: 'src/demo/ts/asdf/File.ts',
    },
    {
      code: 'import { B } from \'tiny/something/something\';',
      filename: 'src/demo/ts/File.ts',
    },
    {
      code: 'import { C } from \'tinymce/something/something\';',
      filename: 'src/demo/ts/File.ts',
    },
    {
      code: 'import { A } from \'ephox/something/something\';',
      filename: 'src/test/ts/asdf/File.ts',
    },
    {
      code: 'import { B } from \'tiny/something/something\';',
      filename: 'src/test/ts/File.ts',
    },
    {
      code: 'import { C } from \'tinymce/something/something\';',
      filename: 'src/test/ts/File.ts',
    },
    {
      code: 'import { D } from \'something/something\';',
      filename: 'src/main/ts/core/File.ts',
    },
    {
      code: 'import { E } from \'@ephox/something/something\';',
      filename: 'src/main/ts/core/File.ts',
    }
  ],

  invalid: [
    {
      code: 'import { A } from \'ephox/something/something\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ message: 'Imports with path aliases within src/main is forbidden.' }],
    },
    {
      code: 'import { B } from \'tiny/something/something\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ message: 'Imports with path aliases within src/main is forbidden.' }],
    },
    {
      code: 'import { C } from \'tinymce/something/something\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ message: 'Imports with path aliases within src/main is forbidden.' }],
    }
  ]
});
