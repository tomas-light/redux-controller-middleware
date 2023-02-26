import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { combineReducers } from 'redux';
import { controllerMiddleware } from 'redux-controller-middleware';
import { UserStore } from './redux/UserStore';

type ExtractState<ConfiguredState> = {
	[storeName in keyof ConfiguredState as storeName extends '[unknown]' | symbol | number
		? never
		: storeName]: ConfiguredState[storeName];
};

export function configureRedux() {
	const rootReducer = combineReducers({
		users: UserStore.reducer,
	});

	type ConfiguredState = ReturnType<typeof rootReducer>;

	const middleware = controllerMiddleware<ExtractState<ConfiguredState>>({
		getContainer: () => container,
	});

	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => {
			const middlewares = [];

			const defaultMiddleware = getDefaultMiddleware({
				thunk: false,
				serializableCheck: false,
			});
			middlewares.push(...defaultMiddleware);
			middlewares.push(middleware);

			return middlewares;
		},
	});

	return store;
}

type Store = ReturnType<typeof configureRedux>;
type ReduxState = ReturnType<Store['getState']>;

export type State = ExtractState<ReduxState>;
