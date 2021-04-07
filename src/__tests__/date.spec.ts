import * as D from "../date";
import * as E from "fp-ts/lib/Either";
import { ValidationError } from "../validation";
import { pipe } from "fp-ts/lib/pipeable";

const now = () => new Date();
const days = (count: number) => 24 * 60 * 60 * 1000 * count;
const add = (x: number) => (dt: Date) => new Date(dt.valueOf() + x);

const assertRight = (x: E.Either<ValidationError[], unknown>) =>
  expect(E.isRight(x)).toEqual(true);
const assertError = (x: E.Either<ValidationError[], unknown>) =>
  expect(E.isLeft(x)).toEqual(true);

describe("Date", () => {
  it("after", () => {
    const d = now();
    const v = D.dateAfter(["path", "to", "value"], d);

    assertRight(pipe(d, add(1), v));
    assertRight(pipe(d, add(days(1)), v));

    assertError(pipe(d, add(-1), v));
    assertError(pipe(d, add(days(-1)), v));
  });

  it("before", () => {
    const d = now();
    const v = D.dateBefore(["path", "to", "value"], d);

    assertRight(pipe(d, add(-1), v));
    assertRight(pipe(d, add(days(-1)), v));

    assertError(pipe(d, add(1), v));
    assertError(pipe(d, add(days(1)), v));
  });

  it("dateEqual", () => {
    const d = now();
    const v = D.dateEqual(["path", "to", "value"], d);

    assertRight(pipe(d, v));
    assertError(pipe(d, add(-1), v));
    assertError(pipe(d, add(days(-1)), v));

    assertError(pipe(d, add(1), v));
    assertError(pipe(d, add(days(1)), v));
  });

  it("dateSameOrAfter", () => {
    const d = now();
    const v = D.dateSameOrAfter(["path", "to", "value"], d);

    assertRight(pipe(d, v));
    assertRight(pipe(d, add(1), v));
    assertRight(pipe(d, add(days(1)), v));

    assertError(pipe(d, add(-1), v));
    assertError(pipe(d, add(days(-1)), v));
  });

  it("dateSameOrBefore", () => {
    const d = now();
    const v = D.dateSameOrBefore(["path", "to", "value"], d);

    assertRight(pipe(d, v));
    assertRight(pipe(d, add(-1), v));
    assertRight(pipe(d, add(days(-1)), v));

    assertError(pipe(d, add(1), v));
    assertError(pipe(d, add(days(1)), v));
  });

  it("dateWithinRange", () => {
    const d = now();
    const d2 = pipe(1, days, add)(d);

    const v = D.dateWithinRange(["path", "to", "value"], d, d2);

    assertRight(pipe(d, v));
    assertRight(pipe(d, add(1), v));
    assertRight(pipe(d2, v));
    assertRight(pipe(add(-1)(d2), v));

    assertError(pipe(add(-1)(d), v));
    assertError(pipe(add(1)(d2), v));
  });

  it("isDate", () => {
    const d = now();
    const v = D.isDate(["path", "to", "value"]);

    assertRight(pipe(d.toISOString(), v));
    assertError(pipe("", v));
  });
});
