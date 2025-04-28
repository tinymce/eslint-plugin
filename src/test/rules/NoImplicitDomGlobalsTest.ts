import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noImplicitDomGlobals } from '../../main/ts/rules/NoImplicitDomGlobals';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    sourceType: 'module'
  }
});

ruleTester.run('no-implicit-dom-globals', noImplicitDomGlobals, {
  valid: [
    {
      code: 'const a = new Blob([ "a" ]);'
    },
    {
      code: 'const b = window.name;'
    },
    {
      code: 'const c = window.fetch("url", {});'
    },
    {
      code: 'const d = Node.DOCUMENT_POSITION_PRECEDING;',
    },
    {
      code: 'window.history.pushState({}, "", "url");'
    },
    {
      code: `
      const f = (str: string): void => {};
      const name = 'Test';
      f(name);
      `
    }
  ],
  invalid: [
    {
      code: 'const a = name;',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const a = window.name;'
    },
    {
      code: 'const b = HTMLElement.prototypeOf("");',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const b = window.HTMLElement.prototypeOf("");'
    },
    {
      code: 'const c = fetch("url", { });',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const c = window.fetch("url", { });'
    },
    {
      code: 'const d = Element.DOCUMENT_POSITION_PRECEDING;',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const d = window.Element.DOCUMENT_POSITION_PRECEDING;'
    },
    {
      code: 'const e = new URLSearchParams();',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const e = new window.URLSearchParams();'
    },
    {
      code: 'history.pushState({}, "", "url");',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'window.history.pushState({}, "", "url");'
    },
    {
      code: `
      const f = (str: string): void => {};
      f(name);
      `,
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: `
      const f = (str: string): void => {};
      f(window.name);
      `
    },
    {
      code: `
      let g: string;
      g = name;
      `,
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: `
      let g: string;
      g = window.name;
      `
    },
    {
      code: 'const h = [ name ];',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const h = [ window.name ];'
    },
    {
      code: 'const i = { test: name };',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'const i = { test: window.name };'
    },
    {
      code: 'return location.href;',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'return window.location.href;'
    },
    {
      code: 'const j = a ? name : location.href;',
      errors: [
        { messageId: 'noImplicitDomGlobals' },
        { messageId: 'noImplicitDomGlobals' }
      ],
      output: 'const j = a ? window.name : window.location.href;'
    },
    {
      code: 'HTMLInputElement.prototype.click = props.click;',
      errors: [{ messageId: 'noImplicitDomGlobals' }],
      output: 'window.HTMLInputElement.prototype.click = props.click;'
    },
  ]
});
