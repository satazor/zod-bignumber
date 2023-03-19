import BigNumber from 'bignumber.js';
import {
  INVALID,
  z,
  type ParseInput,
  type ZodTypeDef,
  type RawCreateParams,
} from 'zod';
import {
  messageToString,
  processCreateParameters,
  type ErrorMessage,
} from './utils';

export type ZodBigNumberCheck =
  | {kind: 'min'; value: BigNumber.Value; inclusive: boolean; message?: string}
  | {kind: 'max'; value: BigNumber.Value; inclusive: boolean; message?: string}
  | {kind: 'int'; message?: string}
  | {kind: 'multipleOf'; value: BigNumber.Value; message?: string}
  | {kind: 'finite'; message?: string};

export type ZodBigNumberDef = {
  checks: ZodBigNumberCheck[];
  typeName: 'ZodBigNumber';
  coerce: boolean;
  base: number;
} & ZodTypeDef;

export type ZodBigNumberInput = BigNumber.Value;

export type ZodBigNumberOutput = string | BigNumber.Instance;

export class ZodBigNumber extends z.ZodType<string, ZodBigNumberDef> {
  static create = (
    parameters?: RawCreateParams & {coerce?: boolean; base?: number},
  ): ZodBigNumber =>
    new ZodBigNumber({
      checks: [],
      typeName: 'ZodBigNumber',
      coerce: parameters?.coerce ?? false,
      base: parameters?.base === undefined ? 10 : parameters.base,
      ...processCreateParameters(parameters),
    });

  min = this.gte;
  max = this.lte;
  step = this.multipleOf;

  _parse(input: ParseInput) {
    const ctx = this._getOrReturnCtx(input);

    if (this._def.coerce) {
      input.data = String(input.data);
    }

    // Only accept strings, numbers or big numbers.
    if (typeof input.data !== 'string') {
      z.addIssueToContext(ctx, {
        code: z.ZodIssueCode.invalid_type,
        expected: 'string',
        received: z.getParsedType(input.data),
      });

      return INVALID;
    }

    // Check if data is an invalid big number.
    // Please note that `Infinity` is still valid at this point and `finite()` should be used.
    const bigNumber = new BigNumber(input.data as unknown);

    if (bigNumber.isNaN()) {
      z.addIssueToContext(ctx, {
        code: z.ZodIssueCode.invalid_type,
        message: 'Not a valid big number',
      });

      return INVALID;
    }

    // Process checks in order.
    const status = new z.ParseStatus();

    for (const check of this._def.checks) {
      switch (check.kind) {
        case 'int': {
          if (!bigNumber.isInteger()) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.invalid_type,
              expected: 'integer',
              message: check.message,
              received: 'float',
            });
            status.dirty();
          }

          break;
        }

        case 'min': {
          const tooSmall = check.inclusive
            ? bigNumber.lt(check.value)
            : bigNumber.lte(check.value);

          if (tooSmall) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.too_small,
              exact: false,
              inclusive: check.inclusive,
              message: check.message,
              minimum: check.value,
              type: 'number',
            });
            status.dirty();
          }

          break;
        }

        case 'max': {
          const tooBig = check.inclusive
            ? bigNumber.gt(check.value)
            : bigNumber.gte(check.value);

          if (tooBig) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.too_big,
              exact: false,
              inclusive: check.inclusive,
              maximum: check.value,
              message: check.message,
              type: 'number',
            });
            status.dirty();
          }

          break;
        }

        case 'multipleOf': {
          if (!bigNumber.modulo(check.value).isZero()) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.not_multiple_of,
              message: check.message,
              multipleOf: check.value,
            });
            status.dirty();
          }

          break;
        }

        case 'finite': {
          if (!bigNumber.isFinite()) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.not_finite,
              message: check.message,
            });
            status.dirty();
          }

          break;
        }

        default: {
          throw new Error('Unsupported check');
        }
      }
    }

    return {status: status.value, value: bigNumber.toString(this._def.base)};
  }

  _addCheck(check: ZodBigNumberCheck) {
    return new ZodBigNumber({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  gte(value: BigNumber.Instance, message?: ErrorMessage) {
    return this._addCheck({
      inclusive: true,
      kind: 'min',
      message: messageToString(message),
      value,
    });
  }

  gt(value: BigNumber.Instance, message?: ErrorMessage) {
    return this._addCheck({
      inclusive: false,
      kind: 'min',
      message: messageToString(message),
      value,
    });
  }

  lte(value: BigNumber.Instance, message?: ErrorMessage) {
    return this._addCheck({
      inclusive: true,
      kind: 'max',
      message: messageToString(message),
      value,
    });
  }

  lt(value: BigNumber.Instance, message?: ErrorMessage) {
    return this._addCheck({
      inclusive: false,
      kind: 'max',
      message: messageToString(message),
      value,
    });
  }

  int(message?: ErrorMessage) {
    return this._addCheck({
      kind: 'int',
      message: messageToString(message),
    });
  }

  positive(message?: ErrorMessage) {
    return this._addCheck({
      inclusive: false,
      kind: 'min',
      message: messageToString(message),
      value: 0,
    });
  }

  negative(message?: ErrorMessage) {
    return this._addCheck({
      inclusive: false,
      kind: 'max',
      message: messageToString(message),
      value: 0,
    });
  }

  nonpositive(message?: ErrorMessage) {
    return this._addCheck({
      inclusive: true,
      kind: 'max',
      message: messageToString(message),
      value: 0,
    });
  }

  nonnegative(message?: ErrorMessage) {
    return this._addCheck({
      inclusive: true,
      kind: 'min',
      message: messageToString(message),
      value: 0,
    });
  }

  multipleOf(value: BigNumber.Instance, message?: ErrorMessage) {
    return this._addCheck({
      kind: 'multipleOf',
      message: messageToString(message),
      value,
    });
  }

  finite(message?: ErrorMessage) {
    return this._addCheck({
      kind: 'finite',
      message: messageToString(message),
    });
  }
}

export const zBigNumber = ZodBigNumber.create;
