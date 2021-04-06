import * as E from "fp-ts/lib/Either";
import { ValidationError, Validator, ValidatorInfo } from "./validation";

export const required = (
  path: readonly string[]
): Validator<string | null | undefined, string> => {
  return (value?: string | null) => {
    if (value == null || value.trim().length === 0) {
      return E.left([new ValidationError(path, new RequiredInfo())]);
    }
    return E.right(value);
  };
};
export class RequiredInfo implements ValidatorInfo {
  public readonly type = "required";
}

export const minLength = (
  path: readonly string[],
  minLength: number
): Validator<string, string> => {
  return (value) => {
    if (value.length < minLength) {
      return E.left([
        new ValidationError(path, new MinLengthInfo(value, minLength)),
      ]);
    }
    return E.right(value);
  };
};
class MinLengthInfo implements ValidatorInfo {
  public readonly type = "minLength";
  constructor(public readonly actual: string, readonly minLength: number) {}
}

export const maxLength = (
  path: readonly string[],
  maxLength: number
): Validator<string, string> => {
  return (value) => {
    if (value.length > maxLength) {
      return E.left([
        new ValidationError(path, new MaxLengthInfo(value, maxLength)),
      ]);
    }
    return E.right(value!);
  };
};
class MaxLengthInfo implements ValidatorInfo {
  public readonly type = "maxLength";
  constructor(public readonly actual: string, readonly maxLength: number) {}
}

export const isNumeric = (
  path: readonly string[]
): Validator<string, string> => {
  return (value) => {
    if (!value.match("^[0-9]+$")) {
      return E.left([new ValidationError(path, new IsNumericInfo(value))]);
    }
    return E.right(value!);
  };
};
class IsNumericInfo implements ValidatorInfo {
  public readonly type = "isNumeric";
  constructor(public readonly actual: string) {}
}

export const isString = (
  path: readonly string[]
): Validator<unknown, string> => (value) =>
  typeof value === "string"
    ? E.right(value)
    : E.left([new ValidationError([...path], new isStringInfo(value))]);

class isStringInfo implements ValidatorInfo {
  public readonly type = "isString";
  constructor(public readonly actual: unknown) {}
}
