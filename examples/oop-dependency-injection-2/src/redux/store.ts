import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';
import { UsersSlice } from './UsersController.ts';

const makeReducers = () =>
  getReducersFromStoreSlices({
    users: UsersSlice,
  });

export const store = configureStore({
  reducer: combineReducers(makeReducers()),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      controllerMiddleware({
        container,
      })
    ),
});

export type RootState = InferState<ReturnType<typeof makeReducers>>;
