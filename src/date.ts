import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { ValidationError, Validator, ValidatorInfo } from "./validation";

export const isDate = (
  path: ReadonlyArray<string>
): Validator<string, Date> => (value: string) =>
  pipe(
    value,
    (x: string) => pipe(x, Date.parse, O.fromPredicate(isFinite)),
    O.map((x) => new Date(x)),
    E.fromOption(() => [new ValidationError([...path], new InvalidDateInfo())])
  );

class InvalidDateInfo implements ValidatorInfo {
  public readonly type = "InvalidDate";
}

export const dateBefore = (
  path: ReadonlyArray<string>,
  max: Date
): Validator<Date, Date> => (value: Date) =>
  pipe(max, (x) =>
    value.valueOf() < x.valueOf()
      ? E.right(value)
      : E.left([new ValidationError([...path], new DateBeforeInfo(value, max))])
  );

class DateBeforeInfo implements ValidatorInfo {
  public readonly type = "DateBefore";
  constructor(public readonly actual: Date, public readonly max: Date) {}
}

export const dateAfter = (
  path: ReadonlyArray<string>,
  min: Date
): Validator<Date, Date> => (value: Date) =>
  pipe(min, (x) =>
    value.valueOf() > x.valueOf()
      ? E.right(value)
      : E.left([new ValidationError([...path], new DateAfterInfo(value, min))])
  );

class DateAfterInfo implements ValidatorInfo {
  public readonly type = "DateAfter";
  constructor(public readonly actual: Date, public readonly min: Date) {}
}

export const dateEqual = (
  path: ReadonlyArray<string>,
  date: Date
): Validator<Date, Date> => (value: Date) =>
  pipe(date, (x) =>
    value.valueOf() === x.valueOf()
      ? E.right(value)
      : E.left([new ValidationError([...path], new DateEqualInfo(value, date))])
  );

class DateEqualInfo implements ValidatorInfo {
  public readonly type = "DateEqual";
  constructor(public readonly actual: Date, public readonly date: Date) {}
}

export const dateSameOrBefore = (
  path: ReadonlyArray<string>,
  max: Date
): Validator<Date, Date> => (value: Date) =>
  pipe(
    value,
    dateEqual([...path], max),
    E.fold(() => dateBefore([...path], max)(value), E.right),
    E.mapLeft(() => [
      new ValidationError([...path], new DateSameOrBeforeInfo(value, max)),
    ])
  );

class DateSameOrBeforeInfo implements ValidatorInfo {
  public readonly type = "DateSameOrBefore";
  constructor(public readonly actual: Date, public readonly max: Date) {}
}

export const dateSameOrAfter = (
  path: ReadonlyArray<string>,
  min: Date
): Validator<Date, Date> => (value: Date) =>
  pipe(
    value,
    dateEqual([...path], min),
    E.fold(() => dateAfter([...path], min)(value), E.right),
    E.mapLeft(() => [
      new ValidationError([...path], new DateSameOrAfterInfo(value, min)),
    ])
  );

class DateSameOrAfterInfo implements ValidatorInfo {
  public readonly type = "DateSameOrAfter";
  constructor(public readonly actual: Date, public readonly min: Date) {}
}

export const dateWithinRange = (
  path: ReadonlyArray<string>,
  min: Date,
  max: Date
): Validator<Date, Date> => (value: Date) =>
  pipe(
    value,
    dateSameOrAfter([...path], min),
    E.chain(dateSameOrBefore([...path], max)),
    E.mapLeft(() => [
      new ValidationError([...path], new DateWithinRangeInfo(value, min, max)),
    ])
  );

class DateWithinRangeInfo implements ValidatorInfo {
  public readonly type = "DateWithinRange";
  constructor(
    public readonly actual: Date,
    public readonly min: Date,
    public readonly max: Date
  ) {}
}
