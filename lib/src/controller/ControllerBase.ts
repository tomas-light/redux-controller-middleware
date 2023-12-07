import { Dispatch } from 'redux';
import { Middleware } from '../Middleware.js';
import { Action, Controller } from '../types/index.js';

export class ControllerBase<State extends {} = {}> implements Controller<State> {
  protected readonly dispatch: Dispatch<Action<any>>;
  protected readonly getState: () => State;

  constructor(middleware: Middleware<State>) {
    if (new.target === ControllerBase) {
      throw new Error('Cannot construct ControllerBase instance directly');
    }

    this.dispatch = middleware?.dispatch;
    this.getState = () => middleware?.getState();
  }
}
