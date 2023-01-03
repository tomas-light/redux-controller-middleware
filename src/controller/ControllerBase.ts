import { Dispatch } from 'redux';
import { Middleware } from '../Middleware';
import { Action, Controller } from '../types';

// simple decorator allows Reflect-metadata to scan classes ang get its metadata
// it is needed to auto resolve Middleware dependency
const metadata = <T>(constructor: T): T => constructor;

@metadata
export class ControllerBase<State extends {} = {}> implements Controller<State> {
	protected readonly dispatch: Dispatch<Action>;
	protected readonly getState: () => State;

	constructor(middleware: Middleware<State>) {
		if (new.target === ControllerBase) {
			throw new Error('Cannot construct ControllerBase instance directly');
		}

		this.dispatch = middleware.dispatch;
		this.getState = () => middleware.getState();
	}
}
