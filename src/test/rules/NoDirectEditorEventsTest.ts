import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noDirectEditorEvents } from '../../main/ts/rules/NoDirectEditorEvents';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' },
  }
});

ruleTester.run('no-direct-editor-events', noDirectEditorEvents, {
  valid: [
    {
      filename: 'src/main/ts/api/Events.ts',
      code: `
      editor.dispatch('myevent', { value: 'custom' });
      editor.dispatch('nodata');
      editor.fire('myevent', { value: 'custom' });
      `
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: 'editor.dispatch(\'mytestevent\', { value: \'test\' });'
    },
    {
      filename: 'src/demo/ts/Demo.ts',
      code: 'editor.dispatch(\'mydemoevent\');'
    },
    // Windows filepath
    {
      filename: 'src\\main\\ts\\api\\Events.ts',
      code: `
      editor.dispatch('myevent', { value: 'custom' });
      editor.dispatch('nodata');
      editor.fire('myevent', { value: 'custom' });
      `
    },
    // Legacy case
    {
      filename: 'src/main/ts/alien/Events.ts',
      code: 'editor.dispatch(\'mytestevent\', { value: \'test\' });'
    },
    {
      filename: 'src\\main\\ts\\alien\\Events.ts',
      code: 'editor.dispatch(\'mytestevent\', { value: \'test\' });'
    }
  ],

  invalid: [
    {
      filename: 'src/main/ts/Plugin.ts',
      code: `
      editor.dispatch('myevent', { value: 'custom' });
      editor.dispatch('nodata');
      editor.fire('myevent', { value: 'custom' });
      `,
      errors: [
        { messageId: 'noDirectEditorEvents' },
        { messageId: 'noDirectEditorEvents' },
        { messageId: 'noDirectEditorEvents' }
      ]
    },
    // Windows filepath
    {
      filename: 'src\\main\\ts\\Plugin.ts',
      code: `
      editor.dispatch('myevent', { value: 'custom' });
      editor.dispatch('nodata');
      editor.fire('myevent', { value: 'custom' });
      `,
      errors: [
        { messageId: 'noDirectEditorEvents' },
        { messageId: 'noDirectEditorEvents' },
        { messageId: 'noDirectEditorEvents' }
      ]
    }
  ]
});
