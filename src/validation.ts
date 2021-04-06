import { sequenceS } from "fp-ts/lib/Apply";
import { getMonoid } from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

export class ValidationError {
  constructor(
    readonly path: readonly string[],
    readonly error: ValidatorInfo
  ) {}
}

export interface ValidatorInfo {
  type: string;
}

export type Validator<T, ValidatedT> = (
  t: T
) => E.Either<ValidationError[], ValidatedT>;
export const AP = E.getValidation(getMonoid<ValidationError>());
export const validate = sequenceS(
  E.getValidation(getMonoid<ValidationError>())
);

export const toFormErrors = <T>(
  x: E.Either<ValidationError[], T>
): E.Either<Record<string, ValidatorInfo>, T> =>
  pipe(
    x,
    E.mapLeft((xs) => {
      const r: Record<string, ValidatorInfo> = {};

      xs.map((x) => {
        r[x.path.join(".")] = x.error;
      }, r);

      return r;
    })
  );
