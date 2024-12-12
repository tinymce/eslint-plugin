// import { RuleTester } from 'eslint';
import { noPublicApiModuleImports } from '../../main/ts/rules/NoPublicApiModuleImports';
import * as RuleTester from './RuleTester';

const ruleTester = RuleTester.setup();

// const ruleTester = new RuleTester({
//   parser: require.resolve('@typescript-eslint/parser'),
//   parserOptions: { sourceType: 'module' }
// });

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
      errors: [{ message: 'Direct import to PublicApi module is forbidden outside demos.' }]
    },
    {
      code: 'import { B } from \'../api/PublicApi\';',
      filename: 'src/main/ts/core/File.ts',
      errors: [{ message: 'Direct import to PublicApi module is forbidden outside demos.' }]
    },
    {
      code: 'import { A } from \'ephox/swag/api/PublicApi\';',
      filename: 'src/test/ts/File.ts',
      errors: [{ message: 'Direct import to PublicApi module is forbidden outside demos.' }]
    }
  ]
});
