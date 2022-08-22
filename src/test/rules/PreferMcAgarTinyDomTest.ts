import { RuleTester } from 'eslint';
import { preferMcAgarTinyDom } from '../../main/ts/rules/PreferMcAgarTinyDom';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
});

ruleTester.run('prefer-mcagar-tiny-dom', preferMcAgarTinyDom, {
  valid: [
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import { TinyDom } from '@ephox/mcagar';
      const doc = TinyDom.document(editor);
      const body = TinyDom.body(editor);
      const container = TinyDom.container(editor);
      const contentArea = TinyDom.contentAreaContainer(editor);
      const target = TinyDom.targetElement(editor);
      `
    }
  ],
  invalid: [
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import { SugarElement } from '@ephox/sugar';
      const doc = SugarElement.fromDom(editor.getDoc());
      const body = SugarElement.fromDom(editor.getBody());
      const container = SugarElement.fromDom(editor.getContainer());
      const contentArea = SugarElement.fromDom(editor.getContentAreaContainer());
      const target = SugarElement.fromDom(editor.getElement());
      `,
      errors: [
        { message: 'Use `TinyDom.document` instead of manually converting the editor document to a Sugar element.' },
        { message: 'Use `TinyDom.body` instead of manually converting the editor body to a Sugar element.' },
        { message: 'Use `TinyDom.container` instead of manually converting the editor container to a Sugar element.' },
        { message: 'Use `TinyDom.contentAreaContainer` instead of manually converting the editor content area container to a Sugar element.' },
        { message: 'Use `TinyDom.targetElement` instead of manually converting the editor target element to a Sugar element.' }
      ],
      // Note: The fixer doesn't touch imports
      output: `
      import { SugarElement } from '@ephox/sugar';
      const doc = TinyDom.document(editor);
      const body = TinyDom.body(editor);
      const container = TinyDom.container(editor);
      const contentArea = TinyDom.contentAreaContainer(editor);
      const target = TinyDom.targetElement(editor);
      `
    }
  ]
});