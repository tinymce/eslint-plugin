import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noPublicApiModuleImports } from '../../main/ts/rules/NoPublicApiModuleImports';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
});

ruleTester.run('no-publicapi-module-imports', noPublicApiModuleImports, {
  valid: [
    {
      code: 'import { A } from \'./PublicApi\';',
      filename: 'src/demo/ts/File.ts',
    },
    {
      code: 'import { B } from \'../api/PublicApi\';',
      filename: 'src/demo/ts/File.ts',
    },
    {
      code: 'import { A } from \'./PublicApi\';',
      filename: 'src/test/ts/File.ts',
    },
    {
      code: 'import { B } from \'../api/PublicApi\';',
      filename: 'src/test/ts/File.ts',
    },
    {
      code: 'import { A } from \'./SomethingNotPublicApi\';',
      filename: 'src/main/ts/api/File.ts'
    },
    {
      code: 'import { B } from \'../api/SomethingNotPublicApi\';',
      filename: 'src/main/ts/core/File.ts',
    },
    {
      code: 'import { A } from \'ephox/swag/api/PublicApi\';',
      filename: 'src/demo/ts/Demo.ts'
    }
  ],
  invalid: [
    {
      code: 'import { A } from \'./PublicApi\';',
      filename: 'src/main/ts/api/File.ts',
      errors: [{ messageId: 'noPublicApiImport' }]
    },
    {
      code: 'import { B } from \'../api/PublicApi\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ messageId: 'noPublicApiImport' }]
    },
    {
      code: 'import { A } from \'ephox/swag/api/PublicApi\';',
      filename: 'src/test/ts/File.ts',
      errors: [{ messageId: 'noPublicApiImport' }]
    }
  ]
});
