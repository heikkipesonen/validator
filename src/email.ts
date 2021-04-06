import * as E from "fp-ts/lib/Either";

import { ValidationError, Validator, ValidatorInfo } from "./validation";

// https://emailregex.com
const reRfc5322ish = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function isValidEmail(sEmail: string): boolean {
  return reRfc5322ish.test(sEmail);
}

export function emailV(path: readonly string[]): Validator<string, string> {
  return (x) =>
    isValidEmail(x)
      ? E.right(x)
      : E.left([new ValidationError(path, new InvalidEmailInfo(x))]);
}
class InvalidEmailInfo implements ValidatorInfo {
  public readonly type = "invalidEmail";
  constructor(public readonly actual: string) {}
}
