import { RuleTester } from 'eslint';
import { noDirectEditorEvents } from '../../main/ts/rules/NoDirectEditorEvents';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
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
    // Legacy case
    {
      filename: 'src/main/ts/alien/Events.ts',
      code: 'editor.dispatch(\'mytestevent\', { value: \'test\' });'
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: 'editor.dispatch(\'mytestevent\', { value: \'test\' });'
    },
    {
      filename: 'src/demo/ts/Demo.ts',
      code: 'editor.dispatch(\'mydemoevent\');'
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
        { message: 'Dispatching events is forbidden outside api/Events.ts.' },
        { message: 'Dispatching events is forbidden outside api/Events.ts.' },
        { message: 'Dispatching events is forbidden outside api/Events.ts.' }
      ]
    }
  ]
});