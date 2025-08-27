import tsParser from '@typescript-eslint/parser';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { preferType } from '../../main/ts/rules/PreferKatamariType';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { sourceType: 'module' }
  }
});

ruleTester.run('prefer-katamari-type', preferType, {
  valid: [
    {
      code: `
      import { Type } from '@ephox/katamari';
      if (Type.isString(value)) {
        console.log('is string');
      }
      `
    },
    {
      code: `
      import { Type } from '@ephox/katamari';
      const result = Type.isNumber(x) && !Type.isNull(y);
      `
    },
    {
      code: `
      import { Type } from '@ephox/katamari';
      if (!Type.isNull(obj)) {
        return obj.property;
      }
      `
    },
    {
      code: `
      // Complex expressions should not trigger the rule
      if (typeof getValue() === 'string') {
        console.log('complex expression');
      }
      `
    }
  ],
  invalid: [
    {
      code: `
      if (typeof value === 'string') {
        console.log('is string');
      }
      `,
      errors: [{ messageId: 'preferTypeString' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isString(value)) {
        console.log('is string');
      }
      `
    },
    {
      code: `
      if (typeof count === 'number') {
        return count + 1;
      }
      `,
      errors: [{ messageId: 'preferTypeNumber' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isNumber(count)) {
        return count + 1;
      }
      `
    },
    {
      code: `
      if (typeof flag === 'boolean') {
        return flag;
      }
      `,
      errors: [{ messageId: 'preferTypeBoolean' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isBoolean(flag)) {
        return flag;
      }
      `
    },
    {
      code: `
      if (typeof callback === 'function') {
        callback();
      }
      `,
      errors: [{ messageId: 'preferTypeFunction' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isFunction(callback)) {
        callback();
      }
      `
    },
    {
      code: `
      if (typeof obj === 'object') {
        return obj.prop;
      }
      `,
      errors: [{ messageId: 'preferTypeObject' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isObject(obj)) {
        return obj.prop;
      }
      `
    },
    {
      code: `
      if (typeof value !== 'string') {
        throw new Error('Expected string');
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeString' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isString(value)) {
        throw new Error('Expected string');
      }
      `
    },
    {
      code: `
      if (value === null) {
        return 'null value';
      }
      `,
      errors: [{ messageId: 'preferTypeNull' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isNull(value)) {
        return 'null value';
      }
      `
    },
    {
      code: `
      if (value !== null) {
        return value.toString();
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeNull' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isNull(value)) {
        return value.toString();
      }
      `
    },
    {
      code: `
      if (value === undefined) {
        return 'undefined value';
      }
      `,
      errors: [{ messageId: 'preferTypeUndefined' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isUndefined(value)) {
        return 'undefined value';
      }
      `
    },
    {
      code: `
      if (value !== undefined) {
        return value.toString();
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeUndefined' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isUndefined(value)) {
        return value.toString();
      }
      `
    },
    {
      code: `
      if (value == null) {
        return 'nullable';
      }
      `,
      errors: [{ messageId: 'preferTypeNullable' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isNullable(value)) {
        return 'nullable';
      }
      `
    },
    {
      code: `
      if (value != null) {
        return value.toString();
      }
      `,
      errors: [{ messageId: 'preferTypeNonNullable' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isNonNullable(value)) {
        return value.toString();
      }
      `
    },
    {
      code: `
      if (value !== null && value !== undefined) {
        return value.toString();
      }
      `,
      errors: [{ messageId: 'preferTypeNonNullableStrict' }],
      output: `
      import { Type } from '@ephox/katamari';
if (Type.isNonNullable(value)) {
        return value.toString();
      }
      `
    },
    {
      code: `
      import { Type } from '@ephox/katamari';
      if (typeof value === 'string') {
        console.log('already has import');
      }
      `,
      errors: [{ messageId: 'preferTypeString' }],
      output: `
      import { Type } from '@ephox/katamari';
      if (Type.isString(value)) {
        console.log('already has import');
      }
      `
    },
    {
      code: `
      import { Something } from '@other/package';
      if (typeof value === 'string') {
        console.log('has other imports');
      }
      `,
      errors: [{ messageId: 'preferTypeString' }],
      output: `
      import { Something } from '@other/package';
import { Type } from '@ephox/katamari';
      if (Type.isString(value)) {
        console.log('has other imports');
      }
      `
    },
    {
      code: `
      const obj = { prop: 'value' };
      if (typeof obj.prop === 'string') {
        console.log('member expression');
      }
      `,
      errors: [{ messageId: 'preferTypeString' }],
      output: `
      import { Type } from '@ephox/katamari';
const obj = { prop: 'value' };
      if (Type.isString(obj.prop)) {
        console.log('member expression');
      }
      `
    }
  ]
});
