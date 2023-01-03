import { Dispatch, MiddlewareAPI } from 'redux';
import { Action } from './types';

// this class is needed to be able to resolve redux middleware via DI
// class is used as a token for such resolving
class Middleware<State = any> implements MiddlewareAPI<Dispatch<Action>, State> {
	constructor() {
		throw new Error(
			'This class is just token for resolving Redux middleware via DI. You should not to use it anywhere'
		);
	}

	dispatch: Dispatch<Action> = () => {
		throw new Error('Not implemented');
	};
	getState(): State {
		throw new Error('Not implemented');
	}
}

export { Middleware };
