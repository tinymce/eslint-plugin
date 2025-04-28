import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noDirectEditorOptions } from '../../main/ts/rules/NoDirectEditorOptions';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
});

ruleTester.run('no-direct-editor-options', noDirectEditorOptions, {
  valid: [
    {
      filename: 'src/main/ts/api/Options.ts',
      code: `
      editor.options.register('my_option', { processor: 'string', default: 'test' });
      editor.options.get('my_option');
      editor.getParam('my_option');
      `
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: 'editor.options.get("my_option");'
    },
    {
      filename: 'src/demo/ts/Demo.ts',
      code: 'editor.options.get("my_option");'
    },
    // Windows filepath
    {
      filename: 'src\\main\\ts\\api\\Options.ts',
      code: `
      editor.options.register('my_option', { processor: 'string', default: 'test' });
      editor.options.get('my_option');
      editor.getParam('my_option');
      `
    },
    // Legacy case
    {
      filename: 'src/main/ts/color/Options.ts',
      code: 'editor.options.get("my_option");'
    },
    {
      filename: 'src\\main\\ts\\color\\Options.ts',
      code: 'editor.options.get("my_option");'
    }
  ],

  invalid: [
    {
      filename: 'src/main/ts/core/Actions.ts',
      code: `
      editor.options.get("my_option");
      editor.getParam("my_option");
      `,
      errors: [
        { messageId: 'noDirectEditorOption' },
        { messageId: 'noDirectEditorOption' }
      ]
    },
    {
      filename: 'src/main/ts/Plugin.ts',
      code: 'editor.options.register("my_option", { processor: \'string\', default: \'test\' });',
      errors: [{ messageId: 'noRegisterEditorOption' }]
    },
    // Windows filepath
    {
      filename: 'src\\main\\ts\\core\\Actions.ts',
      code: `
      editor.options.get("my_option");
      editor.getParam("my_option");
      `,
      errors: [
        { messageId: 'noDirectEditorOption' },
        { messageId: 'noDirectEditorOption' }
      ]
    },
    {
      filename: 'src\\main\\ts\\Plugin.ts',
      code: 'editor.options.register("my_option", { processor: \'string\', default: \'test\' });',
      errors: [{ messageId: 'noRegisterEditorOption' }]
    }
  ]
});
