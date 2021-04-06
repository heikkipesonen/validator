# ValidationThing - For Validation

A "simple" fp-ts based validation for forms and explicitly typed objects, only the TypeSafe truth, and nothing but the truth.

***Does this validator support Async and html and email and xlsx and***

no

## The problem

1. Validation will fail on runtime only
1. Infinitely hard to verify literal types (type safe)
1. Some validators validate things and return some sort of thing, usually `any` or casting of an type, the object produced cannot be trusted to be as the type
1. or the validation process itself is not type safe, or some safety is achieved by casting types to another, the validated object can be changed, and the validation will not fail
1. some completely irrelevant shite...
1. result is not easily parsed to any usable form

### Solution

A validation in general, is a relatively simple problem, you take Model, which can have some values, and ValidModel which will have explicitly typed values, a validator should guarantee that the model prouced, will match the given type, validatedT, in this case `Validator(DraftModel) => E.Either<ValidationErrors[], ValidModel>` where

- `Left` is ValidationErrors, which describe where the error occurred,
- `Right` if object was valid, will contain ValidatedT

Type safe validation will allow to create a better type safety application in js, as any form or other object based data can be validated and will produce a type safe model without casting or other shady practises.

1. Validation will fail on TS and on runtime
1. TS will fail if produced object does not match to ValidatedT (any key, does not match to ValidatedT)
1. TS will fail if validation model does not match to ValidatedT

The end result, is an either key-value object, where key is the given `path` to an value, and value is an `ValidationError`, or the explicitly described, excact validated model.

## Usage

```typescript
import { pipe } from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import * as V from 'validation'


// first we create a draft model, this is the model used in form input
// it allows null and empty values
interface DraftUser {
  type: 'DRAFT'
  firstName: string | null
  lastName: string | null
  birthDate: string | null
}

// the valid user modal, this has no null values and field lengths can be set in validator
interface User {
  type: 'USER'
  firstName: string,
  lastName: string,
  birthDate: number,
}


// the validation
// Validator<T, ValidatedT> => E.Either<ValidationError[], ValidatedT>
export const userV: Validator<DraftUser, User> =>(model) => V.validate({
  type: E.right('USER'),
  firstName: pipe(
    model.firstName,
    V.nonNullable(['firstName']),
    E.chain(
      V.minLength(['firstName'], 3)
    ),
    E.chain(
      V.maxLength(['firstName'], 30)
    ),
  ),
  lastName: pipe(
    model.lastName,
    V.nonNullable(['lastName']),
    E.chain(
      V.minLength(['lastName'], 3)
    ),
    E.chain(
      V.maxLength(['lastName'], 30)
    ),
  ),
  birthDate: pipe(
    model.birthDate,
    V.isDate(['birthDate']),
    E.chain(
      V.dateInRange(['birthDate'], new Date(), new Date(Date.now() + 10 * 24 * 3600 * 1000)),
    ),
  )
})

// E.Either<Record<"Path.To.Error.Field", ValidationError>, User>
const maybeUserErrors = V.getErrors(userV(maybeValidUserModel)) 

```

## Creating custom validators

A `Validator` is a function, which will validate a value, it will take in T and return `E.Either<ValidationError[], ValidatedT>`

```typescript
export type Validator<T, ValidatedT> = (
  t: T
) => E.Either<ValidationError[], ValidatedT>;
```

`ValidationError` is an interface for error messages, will contain a `type`, and error message container class `ValidatorInfo` which in turn can be used to produce user interface error messages

***Date validation for Example:***

```typescript

import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { ValidationError, Validator, ValidatorInfo } from 'validation'


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
```
