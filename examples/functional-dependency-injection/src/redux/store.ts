import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';
import { UsersSlice } from './fetchUsers.ts';

const makeReducers = () =>
  getReducersFromStoreSlices({
    users: UsersSlice,
  });

export const store = configureStore({
  reducer: combineReducers(makeReducers()),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables warnings on chaining functions in Action
    }).concat(
      controllerMiddleware({
        container,
      })
    ),
});

export type RootState = InferState<ReturnType<typeof makeReducers>>;
