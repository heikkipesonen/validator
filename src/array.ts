import { array } from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";

import { ValidationError, Validator, ValidatorInfo, AP } from "./validation";

export function arrayV<T, ValidatedT>(
  path: ReadonlyArray<string>,
  itemValidator: (path: ReadonlyArray<string>) => Validator<T, ValidatedT>
): Validator<T[], ValidatedT[]> {
  return (ts: ReadonlyArray<T>) =>
    array.sequence(AP)(ts.map((t, i) => itemValidator([...path, `${i}`])(t)));
}

export function arrayMinLength<T>(
  path: ReadonlyArray<string>,
  minLength: number
): Validator<T[] | undefined, T[]> {
  return (value?: T[]) => {
    if (value === undefined || value.length < minLength) {
      return E.left([
        new ValidationError(path, new ArrayMinLengthInfo(minLength)),
      ]);
    }
    return E.right(value);
  };
}

class ArrayMinLengthInfo implements ValidatorInfo {
  public readonly type = "arrayMinLength";
  constructor(readonly minLength: number) {}
}

// nonEmptyArray is semantically same as arrayMinLength with minLength of 1.
// However, this special case exists here explicitly as it makes some use cases simpler,
// e.g. displaying more user friendly error messages in UI
export function nonEmptyArray<T>(
  path: ReadonlyArray<string>
): Validator<T[] | undefined, T[]> {
  return (value?: T[]) => {
    if (value === undefined || value.length === 0) {
      return E.left([new ValidationError(path, new NonEmptyArrayInfo())]);
    }
    return E.right(value);
  };
}
class NonEmptyArrayInfo implements ValidatorInfo {
  public readonly type = "nonEmptyArray";
}
