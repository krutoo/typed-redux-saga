# Typed Redux Saga

An attempt to fix implicit behavior of popular library - [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga).

## Install

```bash
# maybe soon if the problem is not fixed in the typed-redux-saga
npm i -S redux-saga @krutoo/typed-redux-saga
```

## Usage

Because effect factories now returns extended generators you can write the code just like you did with **typed-redux-saga/macro**:

```ts
// 1. use effects from this library
import { call } from "@krutoo/typed-redux-saga";

function* mySaga() {
  // 2. use yield* (with star character) when you want to get result of effect
  const response = yield* call(fetch, "/something");

  // 3. use just effect factory call (without `yield` or `yield*`) when you want to pass it to combinator (all or race)
  const [a, b] = yield* all([
    // parallel calls
    call(computeA),
    call(computeB),
  ]);
}
```

## Background

Original library - [redux-saga](https://redux-saga.js.org/) - is the best way to declare and perform Redux side effects as i think.

Unfortunately, due to the way it is designed, it is not as convenient to use in TypeScript as we would like.

For example this code:

```ts
import { call } from "redux-saga/effects";

function* mySaga() {
  const response = yield call(fetch, "/something");
}
```

Will provide TS compile time error:

```
'yield' expression implicitly results in an 'any' type because
its containing generator lacks a return-type annotation.
ts(7057)
```

Package **typed-redux-saga** provides way to fix this - it provides analogs of effects from the **redux-saga/effects** that are wrapped in generator functions that return the result of the effect but not effect itself.

This allows you to write your saga code like this:

```ts
// 1. we change imports
import { call } from "typed-redux-saga";

function* mySaga() {
  // 2. we change `yield <effect factory>` to `yield* <effect factory>`
  const response = yield* call(fetch, "/something");
}
```

Such code will better infer types yielding effects and not cause the errors shown earlier.

### The problem

This approach creates a **problem when using effect combinators** such as `all` or `race`.

> We cannot use effects from `typed-redux-saga` in combinators because its factories returns not effect instructions but generators

For example such code:

```ts
import { all, takeLatest } from "typed-redux-saga";

function* mySaga() {
  yield* all([
    // parallel calls
    takeLatest("HI", sayHi),
    takeLatest("BYE", sayBye),
  ]);
}
```

Will not works because instead of return effect instruction `call` now returns generator.

despite the fact that code: that uses original effects

```ts
import { all, call } from "redux-saga/effects";

function* mySaga() {
  yield all([
    // parallel calls
    takeLatest("HI", sayHi),
    takeLatest("BYE", sayBye),
  ]);
}
```

Will work as expected.

### Important detail

Package `typed-redux-saga` also provides a _Babel macro_ to make `yield* <typed effect>` calls turn into `yield <original effect>` calls.

In this case it works as expected.

### Solution

This project contains an attempt to solve the previously stated problem and make the work of typed effects the way it was intended in the original **redux-saga** package.

Generators that return from factories of this library contain special private markers that allow them to work both with the `yield*` and with the combinators like `all` and `race`.
