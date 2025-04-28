import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noPathAliasImports } from '../../main/ts/rules/NoPathAliasImports';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
});

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
      errors: [{ messageId: 'noPathAliasImport' }],
    },
    {
      code: 'import { B } from \'tiny/something/something\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ messageId: 'noPathAliasImport' }],
    },
    {
      code: 'import { C } from \'tinymce/something/something\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ messageId: 'noPathAliasImport' }],
    }
  ]
});
