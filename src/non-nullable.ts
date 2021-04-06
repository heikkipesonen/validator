import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import { ValidationError, Validator, ValidatorInfo } from "./validation";

export const nonNullable = <T>(
  path: readonly string[]
): Validator<T | undefined | null, T> => (x: T | undefined | null) =>
  pipe(x, E.fromNullable([new ValidationError(path, new NotNilInfo())]));

class NotNilInfo implements ValidatorInfo {
  public readonly type = "notNil";
}
