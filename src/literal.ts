import { pipe } from "fp-ts/lib/pipeable";
import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import { ValidationError, Validator, ValidatorInfo } from "./validation";

export const literal = <T extends string>(
  path: readonly string[],
  type: T
): Validator<unknown, T> => (value: unknown) =>
  pipe(
    value,
    t.literal(type).decode,
    E.mapLeft(() => [new ValidationError([...path], new LiteralInfo(value))])
  );

class LiteralInfo<T> implements ValidatorInfo {
  public readonly type = "literal";
  constructor(public readonly actual: unknown) {}
}
