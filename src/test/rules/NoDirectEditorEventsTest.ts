// import { RuleTester } from 'eslint';
// import { RuleTester } from '@typescript-eslint/rule-tester';
import { noDirectEditorEvents } from '../../main/ts/rules/NoDirectEditorEvents';

import * as RuleTester from './RuleTester';

const ruleTester = RuleTester.setup();

// import * as typescriptParser from '@typescript-eslint/parser';

// const ruleTester = new RuleTester({
//   languageOptions: {
//     parser: typescriptParser,
//     ecmaVersion: 5,
//     sourceType: "module"
//   }
// });

// const ruleTester = new RuleTester({
//   languageOptions: {
//     sourceType: 'module'
//   }
//  });

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
        { message: 'Dispatching events is forbidden outside api/Events.ts.' },
        { message: 'Dispatching events is forbidden outside api/Events.ts.' },
        { message: 'Dispatching events is forbidden outside api/Events.ts.' }
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
        { message: 'Dispatching events is forbidden outside api/Events.ts.' },
        { message: 'Dispatching events is forbidden outside api/Events.ts.' },
        { message: 'Dispatching events is forbidden outside api/Events.ts.' }
      ]
    }
  ]
});
