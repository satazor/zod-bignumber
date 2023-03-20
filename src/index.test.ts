/* eslint-disable @typescript-eslint/naming-convention */

import BigNumber from 'bignumber.js';
import {it, expect, describe, beforeEach} from 'vitest';
import {z} from 'zod';
import {zBigNumber} from '.';

beforeEach(() => {
  BigNumber.DEBUG = false;
});

it('should error if input is not a string', () => {
  const result = zBigNumber().safeParse(1);

  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "number",
        "path": [],
        "message": "Expected string, received number"
      }
    ]],
      "success": false,
    }
  `);
});

it('should error if input is not a valid number', () => {
  const result = zBigNumber().safeParse('aaa');

  expect(result).toMatchInlineSnapshot(`
    {
      "error": [ZodError: [
      {
        "code": "invalid_type",
        "message": "Not a number: aaa",
        "expected": "number",
        "received": "nan",
        "path": []
      }
    ]],
      "success": false,
    }
  `);
});

it('should properly restore DEBUG value', () => {
  BigNumber.DEBUG = 'foo';

  zBigNumber().safeParse('aaa');

  expect(BigNumber.DEBUG).toBe('foo');

  BigNumber.DEBUG = null;

  zBigNumber().safeParse('aaa');

  expect(BigNumber.DEBUG).toBe(null);
});

it('should work correctly for a valid number', () => {
  const result = zBigNumber().safeParse('2.91');

  expect(result).toMatchInlineSnapshot(`
    {
      "data": "2.91",
      "success": true,
    }
  `);
});

it('should work correctly for a exponentiated number', () => {
  const result = zBigNumber().safeParse('2.2222222222222222e+52');

  expect(result).toMatchInlineSnapshot(`
    {
      "data": "22222222222222222000000000000000000000000000000000000",
      "success": true,
    }
  `);
});

describe('min()', () => {
  it('should be an alias to `gte()`', () => {
    expect(zBigNumber().min).toBe(zBigNumber().gte);
  });
});

describe('gte()', () => {
  it('should error if number is below the specified value', () => {
    const result = zBigNumber().gte('3').safeParse('2');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_small",
          "exact": false,
          "inclusive": true,
          "message": "Number must be greater than or equal to 3",
          "minimum": 3,
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is equal to the specified value', () => {
    const result = zBigNumber().gte('3').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "3",
        "success": true,
      }
    `);
  });

  it('should not error if number is higher than the specified value', () => {
    const result = zBigNumber().gte('3').safeParse('4');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "4",
        "success": true,
      }
    `);
  });
});

describe('gt()', () => {
  it('should error if number is below the specified value', () => {
    const result = zBigNumber().gt('3').safeParse('2');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_small",
          "exact": false,
          "inclusive": false,
          "message": "Number must be greater than 3",
          "minimum": 3,
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should error if number is equal to the specified value', () => {
    const result = zBigNumber().gt('3').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_small",
          "exact": false,
          "inclusive": false,
          "message": "Number must be greater than 3",
          "minimum": 3,
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is higher than the specified value', () => {
    const result = zBigNumber().gt('3').safeParse('4');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "4",
        "success": true,
      }
    `);
  });
});

describe('max()', () => {
  it('should be an alias to `lte()`', () => {
    expect(zBigNumber().max).toBe(zBigNumber().lte);
  });
});

describe('lte()', () => {
  it('should error if number is higher the specified value', () => {
    const result = zBigNumber().lte('2').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_big",
          "exact": false,
          "inclusive": true,
          "maximum": 2,
          "message": "Number must be less than or equal to 2",
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is equal to the specified value', () => {
    const result = zBigNumber().lte('3').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "3",
        "success": true,
      }
    `);
  });

  it('should not error if number is lower than the specified value', () => {
    const result = zBigNumber().lte('4').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "3",
        "success": true,
      }
    `);
  });
});

describe('lt()', () => {
  it('should error if number is higher the specified value', () => {
    const result = zBigNumber().lt('2').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_big",
          "exact": false,
          "inclusive": false,
          "maximum": 2,
          "message": "Number must be less than 2",
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should error if number is equal to the specified value', () => {
    const result = zBigNumber().lt('3').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_big",
          "exact": false,
          "inclusive": false,
          "maximum": 3,
          "message": "Number must be less than 3",
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is lower than the specified value', () => {
    const result = zBigNumber().lt('4').safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "3",
        "success": true,
      }
    `);
  });
});

describe('int()', () => {
  it('should error if number is not an integer', () => {
    const result = zBigNumber().int().safeParse('1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "invalid_type",
          "expected": "integer",
          "message": "Expected integer, received float",
          "received": "float",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is an integer', () => {
    const result = zBigNumber().int().safeParse('1');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "1",
        "success": true,
      }
    `);
  });
});

describe('positive()', () => {
  it('should error if number is not positive', () => {
    const result = zBigNumber().positive().safeParse('-1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_small",
          "exact": false,
          "inclusive": false,
          "message": "Number must be greater than 0",
          "minimum": 0,
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is positive', () => {
    const result = zBigNumber().positive().safeParse('1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "1.1",
        "success": true,
      }
    `);
  });

  it('should not error if number is positive with `+` sign', () => {
    const result = zBigNumber().positive().safeParse('+1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "1.1",
        "success": true,
      }
    `);
  });
});

describe('negative()', () => {
  it('should error if number is negative', () => {
    const result = zBigNumber().negative().safeParse('1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_big",
          "exact": false,
          "inclusive": false,
          "maximum": 0,
          "message": "Number must be less than 0",
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is negative', () => {
    const result = zBigNumber().negative().safeParse('-1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "-1.1",
        "success": true,
      }
    `);
  });
});

describe('nonpositive()', () => {
  it('should error if number is positive', () => {
    const result = zBigNumber().nonpositive().safeParse('1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_big",
          "exact": false,
          "inclusive": true,
          "maximum": 0,
          "message": "Number must be less than or equal to 0",
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is 0', () => {
    const result = zBigNumber().nonpositive().safeParse('0');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "0",
        "success": true,
      }
    `);
  });

  it('should not error if number is +0', () => {
    const result = zBigNumber().nonpositive().safeParse('+0');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "0",
        "success": true,
      }
    `);
  });

  it('should not error if number is -0', () => {
    const result = zBigNumber().nonpositive().safeParse('-0');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "0",
        "success": true,
      }
    `);
  });

  it('should not error if number is negative', () => {
    const result = zBigNumber().nonpositive().safeParse('-1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "-1.1",
        "success": true,
      }
    `);
  });
});

describe('nonnegative()', () => {
  it('should error if number is negative', () => {
    const result = zBigNumber().nonnegative().safeParse('-1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_small",
          "exact": false,
          "inclusive": true,
          "message": "Number must be greater than or equal to 0",
          "minimum": 0,
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error if number is 0', () => {
    const result = zBigNumber().nonnegative().safeParse('0');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "0",
        "success": true,
      }
    `);
  });

  it('should not error if number is +0', () => {
    const result = zBigNumber().nonnegative().safeParse('+0');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "0",
        "success": true,
      }
    `);
  });

  it('should not error if number is -0', () => {
    const result = zBigNumber().nonnegative().safeParse('-0');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "0",
        "success": true,
      }
    `);
  });

  it('should not error if number is positive', () => {
    const result = zBigNumber().nonnegative().safeParse('1.1');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "1.1",
        "success": true,
      }
    `);
  });
});

describe('finite()', () => {
  it('should error if number is Infinity', () => {
    const result = zBigNumber().finite().safeParse('Infinity');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "not_finite",
          "message": "Number must be finite",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should error if number is -Infinity', () => {
    const result = zBigNumber().nonnegative().safeParse('-Infinity');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "too_small",
          "exact": false,
          "inclusive": true,
          "message": "Number must be greater than or equal to 0",
          "minimum": 0,
          "type": "number",
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });
});

describe('multipleOf()', () => {
  it('should error if number is not a multiple of the specified value', () => {
    const result = zBigNumber().multipleOf(2).safeParse('3');

    expect(result).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "not_multiple_of",
          "message": "Number must be a multiple of 2",
          "multipleOf": 2,
          "path": []
        }
      ]],
        "success": false,
      }
    `);
  });

  it('should not error fi number is a multiple of the specified value', () => {
    const result = zBigNumber().multipleOf(3).safeParse('6');

    expect(result).toMatchInlineSnapshot(`
      {
        "data": "6",
        "success": true,
      }
    `);
  });
});

describe('params', () => {
  describe('`coerce` param', () => {
    it('should coerce when enabled', () => {
      const result = zBigNumber({coerce: true}).safeParse(2);

      expect(result).toMatchInlineSnapshot(`
        {
          "data": "2",
          "success": true,
        }
      `);
    });

    it('should error if unable to coerce', () => {
      // eslint-disable-next-line unicorn/numeric-separators-style
      const result = zBigNumber({coerce: true}).safeParse(823456789123456.3);

      expect(result).toMatchInlineSnapshot(`
        {
          "error": [ZodError: [
          {
            "code": "invalid_type",
            "message": "Number primitive has more than 15 significant digits: 823456789123456.2",
            "expected": "number",
            "received": "nan",
            "path": []
          }
        ]],
          "success": false,
        }
      `);
    });

    it('should not coerce when disabled', () => {
      const result = zBigNumber({coerce: false}).safeParse(2);

      expect(result).toMatchInlineSnapshot(`
        {
          "error": [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "number",
            "path": [],
            "message": "Expected string, received number"
          }
        ]],
          "success": false,
        }
      `);
    });
  });

  describe('`base` param', () => {
    it('should default to base of 10', () => {
      const result = zBigNumber().safeParse('2.2222222222222222e+52');

      expect(result).toMatchInlineSnapshot(`
        {
          "data": "22222222222222222000000000000000000000000000000000000",
          "success": true,
        }
      `);
    });

    it('should support a custom base', () => {
      const result = zBigNumber({base: 2}).safeParse('10');

      expect(result).toMatchInlineSnapshot(`
        {
          "data": "1010",
          "success": true,
        }
      `);
    });

    it('should support `null` to avoid converting altogether`', () => {
      const result = zBigNumber({base: null}).safeParse(
        '2.2222222222222222e+52',
      );

      expect(result).toMatchInlineSnapshot(`
        {
          "data": "2.2222222222222222e+52",
          "success": true,
        }
      `);
    });
  });

  describe('error params', () => {
    it('should support `required_error` param', () => {
      const result = z
        .object({big: zBigNumber({required_error: 'foo'})})
        .safeParse({});

      expect(result).toMatchInlineSnapshot(`
        {
          "error": [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "big"
            ],
            "message": "foo"
          }
        ]],
          "success": false,
        }
      `);
    });

    it('should support `invalid_type_error` param', () => {
      const result = zBigNumber({invalid_type_error: 'foo'}).safeParse({});

      expect(result).toMatchInlineSnapshot(`
        {
          "error": [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [],
            "message": "foo"
          }
        ]],
          "success": false,
        }
      `);
    });

    it('should support `errorMap` param', () => {
      const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_type) {
          return {message: 'bad type!'};
        }

        return {message: ctx.defaultError};
      };

      const result = zBigNumber({errorMap: customErrorMap}).safeParse({});

      expect(result).toMatchInlineSnapshot(`
        {
          "error": [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [],
            "message": "bad type!"
          }
        ]],
          "success": false,
        }
      `);
    });

    it('should support global error map', () => {
      const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_type) {
          return {message: 'bad type!'};
        }

        return {message: ctx.defaultError};
      };

      z.setErrorMap(customErrorMap);

      const result = zBigNumber().safeParse({});

      expect(result).toMatchInlineSnapshot(`
        {
          "error": [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [],
            "message": "bad type!"
          }
        ]],
          "success": false,
        }
      `);
    });
  });
});
