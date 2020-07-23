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
  ]
});