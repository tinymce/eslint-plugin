import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { preferMcAgarTinyAssertions } from '../../main/ts/rules/PreferMcAgarTinyAssertions';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
});

ruleTester.run('prefer-mcagar-tiny-assertions', preferMcAgarTinyAssertions, {
  valid: [
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import { TinyAssertions } from '@ephox/mcagar';
      TinyAssertions.assertContent(editor, '<p></p>');
      TinyAssertions.assertContent(editor, '<p></p>', { no_events: true });
      TinyAssertions.assertRawContent(editor, '<p><br></p>');
      `
    },
    {
      filename: 'src/test/ts/MyTest.ts',
      code: `
      import assert from 'chai';
      assert.equal(editor.getContent({ format: 'tree' }), expectedTree);
      assert.equal(editor.getContent({ format: 'text' }), 'plain text');
      assert.equal(editor.getContent({ format: 'raw', no_events: true }), '<p><br></p>');
      assert.equal(editor.selection.getContent(), 'a');
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
        { messageId: 'preferAssertContent' },
        { messageId: 'preferAssertContent' },
        { messageId: 'preferAssertContent' },
        { messageId: 'preferAssertContent' },
        { messageId: 'preferAssertContent' }
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
        { messageId: 'preferAssertContent' },
        { messageId: 'preferAssertContent' }
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
      assert.equal(ed.getContent({ format: 'raw' }), '<p><br></p>');
      assert.equal(editor.getContent({ format: 'raw' }), '<p><br></p>');
      assert.deepEqual(editor.getContent({ format: 'raw' }), '<p><br></p>');
      assert.equal(editor.getBody().innerHTML, '<p><br></p>');
      `,
      errors: [
        { messageId: 'preferAssertRawContent' },
        { messageId: 'preferAssertRawContent' },
        { messageId: 'preferAssertRawContent' },
        { messageId: 'preferAssertRawContent' }
      ],
      // Note: The fixer doesn't touch imports
      output: `
      import assert from 'chai';
      TinyAssertions.assertRawContent(ed, '<p><br></p>');
      TinyAssertions.assertRawContent(editor, '<p><br></p>');
      TinyAssertions.assertRawContent(editor, '<p><br></p>');
      TinyAssertions.assertRawContent(editor, '<p><br></p>');
      `
    }
  ]
});
