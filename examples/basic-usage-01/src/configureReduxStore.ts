import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { combineReducers } from 'redux';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';
import { UserSlice } from './redux/User.slice.js';

function makeReducers() {
  return getReducersFromStoreSlices({
    users: UserSlice,
  });
}

export type State = InferState<ReturnType<typeof makeReducers>>;

export function configureReduxStore() {
  const rootReducer = combineReducers(makeReducers());

  const middleware = controllerMiddleware<State>({
    container,
  });

  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  });
}
