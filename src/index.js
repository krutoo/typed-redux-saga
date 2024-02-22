import {
  // effects
  take as rawTake,
  takeMaybe as rawTakeMaybe,
  takeEvery as rawTakeEvery,
  takeLatest as rawTakeLatest,
  takeLeading as rawTakeLeading,
  put as rawPut,
  putResolve as rawPutResolve,
  call as rawCall,
  apply as rawApply,
  cps as rawCps,
  fork as rawFork,
  spawn as rawSpawn,
  join as rawJoin,
  cancel as rawCancel,
  select as rawSelect,
  actionChannel as rawActionChannel,
  flush as rawFlush,
  cancelled as rawCancelled,
  setContext as rawSetContext,
  getContext as rawGetContext,
  delay as rawDelay,
  throttle as rawThrottle,
  debounce as rawDebounce,
  retry as rawRetry,

  // effect combinators
  all as rawAll,
  race as rawRace,
} from "redux-saga/effects";

function wrapEffect(effectFactory) {
  return (...args) => {
    // implement behavior of effects from typed-redux-saga - it can be used with `yield*` instead of `yield`
    const fn = function* () {
      const result = yield effectFactory(...args);
      return result;
    };

    const gen = fn();

    // IMPORTANT: this method is necessary for the combinators to work the same way as with redux saga
    gen._effect = () => effectFactory(...args);

    return gen;
  };
}

function wrapEffectCombinator(effectFactory) {
  return (effects) => {
    // IMPORTANT: checking for service property in order for the combinators to work as intended in the redux saga
    const mapper = (item) =>
      typeof item?._effect === "function" ? item._effect() : item;

    const mapEffects = () => {
      if (Array.isArray(effects)) {
        return effects.map(mapper);
      } else {
        Object.fromEntries(
          Object.entries(effects).map(([key, value]) => [key, mapper(value)])
        );
      }
    };

    // implement behavior of effects from typed-redux-saga - it can be used with `yield*` instead of `yield`
    const fn = function* () {
      const result = yield effectFactory(mapEffects(effects));
      return result;
    };

    const gen = fn();

    gen._effect = () => effectFactory(mapEffects(effects));

    return gen;
  };
}

// effects
export const actionChannel = wrapEffect(rawActionChannel);
export const apply = wrapEffect(rawApply);
export const call = wrapEffect(rawCall);
export const cancel = wrapEffect(rawCancel);
export const cancelled = wrapEffect(rawCancelled);
export const cps = wrapEffect(rawCps);
export const debounce = wrapEffect(rawDebounce);
export const delay = wrapEffect(rawDelay);
export const flush = wrapEffect(rawFlush);
export const fork = wrapEffect(rawFork);
export const getContext = wrapEffect(rawGetContext);
export const join = wrapEffect(rawJoin);
export const put = wrapEffect(rawPut);
export const putResolve = wrapEffect(rawPutResolve);
export const retry = wrapEffect(rawRetry);
export const select = wrapEffect(rawSelect);
export const setContext = wrapEffect(rawSetContext);
export const spawn = wrapEffect(rawSpawn);
export const take = wrapEffect(rawTake);
export const takeEvery = wrapEffect(rawTakeEvery);
export const takeLatest = wrapEffect(rawTakeLatest);
export const takeLeading = wrapEffect(rawTakeLeading);
export const takeMaybe = wrapEffect(rawTakeMaybe);
export const throttle = wrapEffect(rawThrottle);

// effect combinators
export const all = wrapEffectCombinator(rawAll);
export const race = wrapEffectCombinator(rawRace);
