import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import { ValidationError, Validator, ValidatorInfo } from "./validation";

export const gte = (
  path: readonly string[],
  min: number
): Validator<number, number> => (value: number) => {
  if (value < min) {
    return E.left([new ValidationError(path, new GteInfo(value, min))]);
  }
  return E.right(value);
};

class GteInfo implements ValidatorInfo {
  public readonly type = "greaterThanOrEqual";
  constructor(readonly actual: number, readonly min: number) {}
}

export const lte = (
  path: readonly string[],
  max: number
): Validator<number, number> => (value: number) => {
  if (value > max) {
    return E.left([new ValidationError(path, new LteInfo(value, max))]);
  }
  return E.right(value);
};

class LteInfo implements ValidatorInfo {
  public readonly type = "lessThanOrEqual";
  constructor(readonly actual: number, readonly max: number) {}
}

export const range = (
  path: readonly string[],
  min: number,
  max: number
): Validator<number, number> => (value: number) =>
  pipe(
    value,
    gte([...path], min),
    E.chain(lte([...path], max)),
    E.mapLeft(() => [new ValidationError(path, new RangeInfo(value, min, max))])
  );

class RangeInfo implements ValidatorInfo {
  public readonly type = "withinRange";
  constructor(
    readonly actual: number,
    readonly min: number,
    readonly max: number
  ) {}
}
