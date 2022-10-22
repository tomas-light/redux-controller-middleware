import { AnyAction, Reducer as ReduxReducer } from 'redux';
import { Action } from './types';

function Reducer<TStore>(initialStore: TStore, updateActionType: string) {
	return ((store: TStore = initialStore, action: Action): TStore => {
		if (action.type !== updateActionType) {
			return store;
		}

		if (typeof action.payload === 'object') {
			return {
				...store,
				...action.payload,
			};
		}

		return {
			...store,
		};
	}) as ReduxReducer<TStore, AnyAction>;
}

export { Reducer };
