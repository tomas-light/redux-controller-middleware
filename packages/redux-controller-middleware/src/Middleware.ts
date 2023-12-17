import { Dispatch, MiddlewareAPI } from 'redux';
import { Action } from './types/index.js';

// this class is needed to be able to resolve redux middleware via DI
// class is used as a token for such resolving
class Middleware<State = any> implements MiddlewareAPI<Dispatch<Action<unknown>>, State> {
  constructor() {
    throw new Error(
      'This class is just token for resolving Redux middleware via Dependency Injection. You should not to create it directly'
    );
  }

  dispatch: Dispatch<Action<unknown>> = () => {
    throw new Error('Not implemented');
  };

  getState(): State {
    throw new Error('Not implemented');
  }
}

export { Middleware };
