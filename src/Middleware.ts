import { MiddlewareAPI, Dispatch } from 'redux';
import { Action } from './types';

abstract class Middleware<State> implements MiddlewareAPI<Dispatch<Action>, State> {
  abstract dispatch: Dispatch<Action>;
  abstract getState(): State;
}

export { Middleware };
