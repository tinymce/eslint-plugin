import { RuleTester } from 'eslint';
import { noImplicitDomGlobals } from '../../main/ts/rules/NoImplicitDomGlobals';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
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
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const a = window.name;'
    },
    {
      code: 'const b = HTMLElement.prototypeOf("");',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const b = window.HTMLElement.prototypeOf("");'
    },
    {
      code: 'const c = fetch("url", { });',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const c = window.fetch("url", { });'
    },
    {
      code: 'const d = Element.DOCUMENT_POSITION_PRECEDING;',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const d = window.Element.DOCUMENT_POSITION_PRECEDING;'
    },
    {
      code: 'const e = new URLSearchParams();',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const e = new window.URLSearchParams();'
    },
    {
      code: 'history.pushState({}, "", "url");',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'window.history.pushState({}, "", "url");'
    },
    {
      code: `
      const f = (str: string): void => {};
      f(name);
      `,
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
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
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: `
      let g: string;
      g = window.name;
      `
    },
    {
      code: 'const h = [ name ];',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const h = [ window.name ];'
    },
    {
      code: 'const i = { test: name };',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'const i = { test: window.name };'
    },
    {
      code: 'return location.href;',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'return window.location.href;'
    },
    {
      code: 'const j = a ? name : location.href;',
      errors: [
        { message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' },
        { message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }
      ],
      output: 'const j = a ? window.name : window.location.href;'
    },
    {
      code: 'HTMLInputElement.prototype.click = props.click;',
      errors: [{ message: 'Don\'t use implicit dom globals. Access the global via the window object instead.' }],
      output: 'window.HTMLInputElement.prototype.click = props.click;'
    }
  ]
});