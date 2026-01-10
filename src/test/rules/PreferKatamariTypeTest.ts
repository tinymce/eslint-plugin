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
    },
    // Test configurable options - these should not trigger when disabled
    {
      code: 'typeof value === "string"',
      options: [{ string: false }]
    },
    {
      code: 'typeof value === "number"',
      options: [{ number: false }]
    },
    {
      code: 'typeof value === "boolean"',
      options: [{ boolean: false }]
    },
    {
      code: 'typeof value === "function"',
      options: [{ function: false }]
    },
    {
      code: 'value === null',
      options: [{ null: false }]
    },
    {
      code: 'value === undefined',
      options: [{ undefined: false }]
    },
    {
      code: 'value == null',
      options: [{ nullable: false }]
    },
    {
      code: 'value != null',
      options: [{ nonNullable: false }]
    },
    {
      code: 'value !== null',
      options: [{ null: false }]
    },
    {
      code: 'value !== undefined',
      options: [{ undefined: false }]
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
      if (typeof count !== 'number') {
        throw new Error('Expected number');
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeNumber' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isNumber(count)) {
        throw new Error('Expected number');
      }
      `
    },
    {
      code: `
      if (typeof flag !== 'boolean') {
        throw new Error('Expected boolean');
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeBoolean' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isBoolean(flag)) {
        throw new Error('Expected boolean');
      }
      `
    },
    {
      code: `
      if (typeof callback !== 'function') {
        throw new Error('Expected function');
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeFunction' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isFunction(callback)) {
        throw new Error('Expected function');
      }
      `
    },
    {
      code: `
      if (typeof obj !== 'object') {
        throw new Error('Expected object');
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeObject' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isObject(obj)) {
        throw new Error('Expected object');
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
    // Test reverse operand order for typeof checks
    {
      code: `
      if ('string' === typeof value) {
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
      if ('number' !== typeof count) {
        throw new Error('Expected number');
      }
      `,
      errors: [{ messageId: 'negatedPreferTypeNumber' }],
      output: `
      import { Type } from '@ephox/katamari';
if (!Type.isNumber(count)) {
        throw new Error('Expected number');
      }
      `
    },
    // Test null/undefined with reversed operands
    {
      code: `
      if (null === value) {
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
      if (null !== value) {
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
      if (undefined === value) {
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
      if (undefined !== value) {
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
      if (null == value) {
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
      if (null != value) {
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
    // Test with and without import
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
      import { Arr } from '@ephox/katamari';
      if (typeof value === 'string') {
        console.log('already has import');
      }
      if (typeof value === 'number') {
        console.log('already has import');
      }
      `,
      errors: [{ messageId: 'preferTypeString' }, { messageId: 'preferTypeNumber' }],
      output: `
      import { Arr, Type } from '@ephox/katamari';
      if (Type.isString(value)) {
        console.log('already has import');
      }
      if (Type.isNumber(value)) {
        console.log('already has import');
      }
      `
    },
    {
      code: `
      import { Something } from '@other/package';
      if (typeof value === 'boolean') {
        console.log('has other imports');
      }
      `,
      errors: [{ messageId: 'preferTypeBoolean' }],
      output: `
      import { Something } from '@other/package';
import { Type } from '@ephox/katamari';
      if (Type.isBoolean(value)) {
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
    },
    // Test that explicit enable works even when other options are disabled
    {
      code: 'typeof value === "string"',
      options: [{ string: true, number: false, boolean: false }],
      errors: [{ messageId: 'preferTypeString' }],
      output: `import { Type } from '@ephox/katamari';
Type.isString(value)`
    }
  ]
});
