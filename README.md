# FOR VALIDATION

A "simple" fp-ts based validation for forms

## usage

```typescript
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import * as V from 'v-validation'


// first we create a draft model, this is the model used in form input
// it allows null and empty values
type DraftUser = t.type({
  type: t.literal('DRAFT'),
  firstName: t.union([t.string, t.null]),
  lastName: t.union([t.string, t.null]),
  birthDate: t.union([t.string, t.null]),
})

// the valid user modal, this has no null values and field lengths can be set in validator
type User = t.type({
  type: t.literal('USER'),
  firstName: t.string,
  lastName: t.string,
  birthDate: t.number,
})


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

```
