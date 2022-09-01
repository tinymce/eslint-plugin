import { RuleTester } from 'eslint';
import { noDirectEditorOptions } from '../../main/ts/rules/NoDirectEditorOptions';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
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
        { message: 'Direct access to options is forbidden outside api/Options.ts.' },
        { message: 'Direct access to options is forbidden outside api/Options.ts.' }
      ]
    },
    {
      filename: 'src/main/ts/Plugin.ts',
      code: 'editor.options.register("my_option", { processor: \'string\', default: \'test\' });',
      errors: [{ message: 'Registering options is forbidden outside api/Options.ts.' }]
    },
    // Windows filepath
    {
      filename: 'src\\main\\ts\\core\\Actions.ts',
      code: `
      editor.options.get("my_option");
      editor.getParam("my_option");
      `,
      errors: [
        { message: 'Direct access to options is forbidden outside api/Options.ts.' },
        { message: 'Direct access to options is forbidden outside api/Options.ts.' }
      ]
    },
    {
      filename: 'src\\main\\ts\\Plugin.ts',
      code: 'editor.options.register("my_option", { processor: \'string\', default: \'test\' });',
      errors: [{ message: 'Registering options is forbidden outside api/Options.ts.' }]
    }
  ]
});