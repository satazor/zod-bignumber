/* eslint-disable @typescript-eslint/naming-convention */

import {type z} from 'zod';

export const processCreateParameters = (
  parameters: z.RawCreateParams,
): z.ProcessedCreateParams => {
  if (!parameters) {
    return {};
  }

  const {errorMap, invalid_type_error, required_error, description} =
    parameters;
  if (errorMap && (invalid_type_error ?? required_error)) {
    throw new Error(
      'Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.',
    );
  }

  if (errorMap) {
    return {errorMap, description};
  }

  const customMap: z.ZodErrorMap = (iss, ctx) => {
    if (iss.code !== 'invalid_type') {
      return {message: ctx.defaultError};
    }

    if (typeof ctx.data === 'undefined') {
      return {message: required_error ?? ctx.defaultError};
    }

    return {message: invalid_type_error ?? ctx.defaultError};
  };

  return {errorMap: customMap, description};
};

export type ErrorMessage = string | {message?: string};

export const messageToString = (message?: ErrorMessage) =>
  typeof message === 'string' ? message : message?.message;
