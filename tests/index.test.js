import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { all, takeLatest } from "@krutoo/typed-redux-saga";
import { test } from "node:test";
import assert from "node:assert";

test("Combinator effects should works properly", () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    (state = 0) => state,
    applyMiddleware(sagaMiddleware)
  );

  const log = [];

  function* mainSaga() {
    log.push("before all()");

    yield* all([
      // parallel effects shoulde works wen its passed to array without yield or yield*
      takeLatest("HI", sayHi),
      takeLatest("BYE", sayBye),
    ]);

    log.push("after all()");
  }

  function sayHi() {
    log.push("Hi!");
  }

  function sayBye() {
    log.push("Bye!");
  }

  const task = sagaMiddleware.run(mainSaga);

  assert.deepEqual(log, [
    // expected
    "before all()",
    "after all()",
  ]);

  store.dispatch({ type: "HI" });
  assert.deepEqual(log, [
    // expected
    "before all()",
    "after all()",
    "Hi!",
  ]);

  store.dispatch({ type: "BYE" });
  assert.deepEqual(log, [
    // expected
    "before all()",
    "after all()",
    "Hi!",
    "Bye!",
  ]);

  task.cancel();
});
