import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { preferMcAgarTinyDom } from '../../main/ts/rules/PreferMcAgarTinyDom';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    sourceType: 'module'
  }
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
        { messageId: 'preferTinyDomDocument' },
        { messageId: 'preferTinyDomBody' },
        { messageId: 'preferTinyDomContainer' },
        { messageId: 'preferTinyDomContentAreaContainer' },
        { messageId: 'preferTinyDomTargetElement' }
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
