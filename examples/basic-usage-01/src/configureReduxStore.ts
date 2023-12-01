import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { combineReducers } from 'redux';
import { controllerMiddleware, InferState } from 'redux-controller-middleware';
import { UserStore } from './redux/UserStore';

function makeReducers() {
  return {
    users: UserStore.reducer,
  };
}

export type State = InferState<ReturnType<typeof makeReducers>>;

export function configureReduxStore() {
  const rootReducer = combineReducers(makeReducers());

  const middleware = controllerMiddleware<State>({
    getContainer: () => container,
  });

  return configureStore({
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
}
