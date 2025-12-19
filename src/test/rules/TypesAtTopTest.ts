import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { typesAtTop } from '../../main/ts/rules/TypesAtTop';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' },
  },
});

ruleTester.run('types-at-top', typesAtTop, {
  valid: [
    {
      code: `
import { Something } from 'somewhere';

interface MyInterface {
  value: string;
}

type MyType = string;

enum MyEnum {
  A, B, C
}

const myVariable = 'test';

function myFunction() {
  return 'hello';
}`,
    },
    {
      code: `
import { A } from 'a';
import { B } from 'b';

interface First {
  prop: string;
}

type Second = number;

const code = 'after types';`,
    },
    {
      code: `
const onlyCode = 'no types here';`,
    },
    {
      code: `
import { Test } from 'test';

const noTypes = 'just code after imports';`,
    },
    {
      code: `
import { Utils } from 'utils';

interface Config {
  name: string;
}

type Handler = () => void;

enum Status {
  ACTIVE,
  INACTIVE
}

export const createHandler = (): Handler => {
  return () => {};
};`,
    },
    {
      code: `
import { Utils } from 'utils';

export interface ExportedInterface {
  name: string;
}

export type ExportedType = string;

export enum ExportedEnum {
  A, B, C
}

const afterExportedTypes = 'after exported types';`,
    },
    {
      code: `
import { Something } from 'somewhere';

// This is a comment between imports and types
// Multiple line comments should also be fine
/* Block comment is also allowed */

interface MyInterface {
  value: string;
}

// Comment between types is also fine
type MyType = string;

/**
 * JSDoc comments should work too
 */
enum MyEnum {
  A, B, C
}

// Comment before code
const myVariable = 'test';`,
    },
    {
      code: `
import * as Loader from '../loader/Loader';
import { readPlugins, registerPlugins } from '../loader/Plugins';
import * as TinyVersions from '../loader/Versions';

export { TEST_LICENSE_KEY } from '../loader/Constants';

export type SuccessCallback = (v: any) => void;
export type FailureCallback = (err: Error) => void;

const someCode = 'after types';`,
    },
    {
      code: `
import { Utils } from 'utils';

export { helper } from './helper';
export * from './constants';

interface Config {
  name: string;
}

type Handler = () => void;

const implementation = 'code after types';`,
    },
    {
      code: `
import { Something } from 'somewhere';

declare let globalVar: string;
declare const GLOBAL_CONSTANT: number;

interface MyInterface {
  value: string;
}

type MyType = string;

const myVariable = 'test';`,
    },
    {
      code: `
import { Utils } from 'utils';

declare let customElement: HTMLElement;

interface Config {
  name: string;
}

const code = 'after types and declares';`,
    },
    {
      code: `
import { Test } from 'test';

export declare const EXPORTED_GLOBAL: string;

export interface ExportedInterface {
  name: string;
}

const implementation = 'code';`,
    },
  ],
  invalid: [
    {
      code: `
import { Something } from 'somewhere';

const myVariable = 'test';

interface MyInterface {
  value: string;
}`,
      errors: [{ messageId: 'typeNotAtTop' }],
      output: `
import { Something } from 'somewhere';

interface MyInterface {
  value: string;
}

const myVariable = 'test';`,
    },
    {
      code: `
import { A } from 'a';

function myFunction() {
  return 'hello';
}

type MyType = string;`,
      errors: [{ messageId: 'typeNotAtTop' }],
      output: `
import { A } from 'a';

type MyType = string;

function myFunction() {
  return 'hello';
}`,
    },
    {
      code: `
import { Test } from 'test';

const first = 'code';

interface TestInterface {
  prop: string;
}

const second = 'more code';

enum TestEnum {
  A, B
}`,
      errors: [{ messageId: 'typeNotAtTop' }, { messageId: 'typeNotAtTop' }],
      output: `
import { Test } from 'test';

interface TestInterface {
  prop: string;
}

enum TestEnum {
  A, B
}

const first = 'code';


const second = 'more code';`,
    },
    {
      code: `
import { Utils } from 'utils';

export const value = 'exported';

interface Config {
  setting: boolean;
}`,
      errors: [{ messageId: 'typeNotAtTop' }],
      output: `
import { Utils } from 'utils';

interface Config {
  setting: boolean;
}

export const value = 'exported';`,
    },
    {
      code: `
import { Utils } from 'utils';

export const value = 'exported code';

export interface Config {
  setting: boolean;
}

export type MyType = string;

export enum Status {
  ACTIVE, INACTIVE
}`,
      errors: [
        { messageId: 'typeNotAtTop' },
        { messageId: 'typeNotAtTop' },
        { messageId: 'typeNotAtTop' },
      ],
      output: `
import { Utils } from 'utils';

export interface Config {
  setting: boolean;
}

export type MyType = string;

export enum Status {
  ACTIVE, INACTIVE
}

export const value = 'exported code';`,
    },
    {
      code: `
import { Utils } from 'utils';

export const regularExport = 'this should trigger error';

interface Config<T extends Object> {
  setting: boolean;
}`,
      errors: [{ messageId: 'typeNotAtTop' }],
      output: `
import { Utils } from 'utils';

interface Config<T extends Object> {
  setting: boolean;
}

export const regularExport = 'this should trigger error';`,
    },
    {
      code: `
/**
 * @summary
 * This class parses HTML code into a DOM like structure of nodes it will remove redundant whitespace and make
 * sure that the node tree is valid according to the specified schema.
 *
 * @example
 * const parser = tinymce.html.DomParser({ validate: true }, schema);
 * const rootNode = parser.parse('<h1>content</h1>');
 *
 * @class tinymce.html.DomParser
 * @version 3.4
 */

const extraBlockLikeElements = [ 'script', 'style', 'template', 'param', 'meta', 'title', 'link' ];

interface Test {
  readonly foo: string;
}
      `,
      errors: [{ messageId: 'typeNotAtTop' }],
      output: `
interface Test {
  readonly foo: string;
}

/**
 * @summary
 * This class parses HTML code into a DOM like structure of nodes it will remove redundant whitespace and make
 * sure that the node tree is valid according to the specified schema.
 *
 * @example
 * const parser = tinymce.html.DomParser({ validate: true }, schema);
 * const rootNode = parser.parse('<h1>content</h1>');
 *
 * @class tinymce.html.DomParser
 * @version 3.4
 */

const extraBlockLikeElements = [ 'script', 'style', 'template', 'param', 'meta', 'title', 'link' ];`
    },
    {
      code: `
import { Something } from 'somewhere';

const myVariable = 'test';

declare let globalVar: string;

interface MyInterface {
  value: string;
}`,
      errors: [{ messageId: 'typeNotAtTop' }, { messageId: 'typeNotAtTop' }],
      output: `
import { Something } from 'somewhere';

declare let globalVar: string;

interface MyInterface {
  value: string;
}

const myVariable = 'test';`,
    },
    {
      code: `
import { Utils } from 'utils';

const code = 'some code';

declare const GLOBAL: number;

type MyType = string;`,
      errors: [{ messageId: 'typeNotAtTop' }, { messageId: 'typeNotAtTop' }],
      output: `
import { Utils } from 'utils';

declare const GLOBAL: number;

type MyType = string;

const code = 'some code';`,
    },
    {
      code: `
import { Test } from 'test';

export const value = 'exported';

export declare let exportedGlobal: string;

export interface Config {
  setting: boolean;
}`,
      errors: [{ messageId: 'typeNotAtTop' }, { messageId: 'typeNotAtTop' }],
      output: `
import { Test } from 'test';

export declare let exportedGlobal: string;

export interface Config {
  setting: boolean;
}

export const value = 'exported';`,
    },
    {
      code: `
import { Utils } from 'utils';

const implementation = 'code';

export declare const GLOBAL_CONFIG: Record<string, unknown>;`,
      errors: [{ messageId: 'typeNotAtTop' }],
      output: `
import { Utils } from 'utils';

export declare const GLOBAL_CONFIG: Record<string, unknown>;

const implementation = 'code';`,
    },
  ],
});
