import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';
import { UsersSlice } from './addUser.ts';

const makeReducers = () =>
  getReducersFromStoreSlices({
    users: UsersSlice,
  });

export const store = configureStore({
  reducer: combineReducers(makeReducers()),
  // add redux-controller-middleware to redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(controllerMiddleware()),
});

export type RootState = InferState<ReturnType<typeof makeReducers>>;
