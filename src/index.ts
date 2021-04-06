import * as E from "fp-ts/lib/Either";

import { ValidationError } from "./validation";

export const isValid = <T>(x: E.Either<ValidationError[], T>): boolean =>
  E.isRight(x);

export * from "./array";
export * from "./date";
export * from "./email";
export * from "./non-nullable";
export * from "./number";
export * from "./phone";
export * from "./string";
export * from "./validation";
export * from "./literal";
