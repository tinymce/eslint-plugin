import { RuleTester } from 'eslint';
import { preferMcAgar } from '../../main/ts/rules/PreferMcAgar';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
});

ruleTester.run('prefer-mcagar', preferMcAgar, {
  valid: [
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import { TinyAssertions } from '@ephox/mcagar';
      TinyAssertions.assertContent(editor, '<p></p>');
      TinyAssertions.assertContent(editor, '<p></p>', { no_events: true });
      `
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import assert from 'chai';
      assert.equal(editor.getContent({ format: 'tree' }), expectedTree);
      assert.equal(editor.getContent({ format: 'text' }), 'plain text');
      assert.equal(editor.selection.getContent(), 'a');
      `
    },
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
      import assert from 'chai';
      assert.equal(ed.getContent(), '<p></p>');
      assert.equal(editor.getContent(), '<p></p>');
      assert.deepEqual(editor.getContent(), '<p></p>');
      assert.equal(editor.getContent({ format: 'html' }), '<p></p>');
      assert.equal(editor.getContent({ no_events: true }), '<p></p>');
      `,
      errors: [
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' },
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' },
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' },
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' },
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' }
      ],
      // Note: The fixer doesn't touch imports
      output: `
      import assert from 'chai';
      TinyAssertions.assertContent(ed, '<p></p>');
      TinyAssertions.assertContent(editor, '<p></p>');
      TinyAssertions.assertContent(editor, '<p></p>');
      TinyAssertions.assertContent(editor, '<p></p>', { format: 'html' });
      TinyAssertions.assertContent(editor, '<p></p>', { no_events: true });
      `
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import assert from 'chai';
      assert.equal(
        ed.getContent(),
        '<p></p>'
      );
      assert.equal(
        ed.getContent({ no_events: true }),
        '<p></p>'
      );
      `,
      errors: [
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' },
        { message: 'Use `TinyAssertions.assertContent` instead of manually asserting the content.' }
      ],
      // Note: The fixer doesn't touch imports
      output: `
      import assert from 'chai';
      TinyAssertions.assertContent(
        ed,
        '<p></p>'
      );
      TinyAssertions.assertContent(
        ed,
        '<p></p>',
        { no_events: true }
      );
      `
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import assert from 'chai';
      assert.equal(ed.getContent({ format: 'raw' }), '<p></p>');
      assert.equal(editor.getContent({ format: 'raw' }), '<p></p>');
      assert.deepEqual(editor.getContent({ format: 'raw' }), '<p></p>');
      assert.equal(editor.getContent({ format: 'raw', no_events: true }), '<p></p>');
      `,
      errors: [
        { message: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.' },
        { message: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.' },
        { message: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.' },
        { message: 'Use `TinyAssertions.assertRawContent` instead of manually asserting the raw content.' }
      ],
      // Note: The fixer doesn't touch imports
      output: `
      import assert from 'chai';
      TinyAssertions.assertRawContent(ed, '<p></p>');
      TinyAssertions.assertRawContent(editor, '<p></p>');
      TinyAssertions.assertRawContent(editor, '<p></p>');
      TinyAssertions.assertRawContent(editor, '<p></p>', { no_events: true });
      `
    },
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