import * as E from "fp-ts/lib/Either";

import { ValidationError, Validator, ValidatorInfo } from "./validation";

const rePhone = /^[+]?([\s0-9]*$)/;
const reWhitespace = /\s/;

export function phone(path: readonly string[]): Validator<string, string> {
  return (x) => {
    const match = x.match(rePhone);
    return match != null && match[1].replace(reWhitespace, "").length >= 6
      ? E.right(x)
      : E.left([new ValidationError(path, new InvalidPhoneInfo())]);
  };
}
class InvalidPhoneInfo implements ValidatorInfo {
  public readonly type = "invalidPhone";
}
