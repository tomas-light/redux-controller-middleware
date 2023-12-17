# redux-controller-middleware

Adjust Redux middleware to be able to use controllers with Dependency Injection to handle actions.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mui/material-ui/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/redux-controller-middleware/latest.svg)](https://img.shields.io/npm/v/redux-controller-middleware/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/redux-controller-middleware/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/redux-controller-middleware)

* [Installation](#installation)
* [Include in redux middleware](#include-to-redux-middleware)
* [How to use](#how-to-use)
  * [Dependency injection](#dependency-injection)
  * [createAction](#createAction)
  * [Chaining actions](#chaining-action)

## <a name="installation"></a> Installation
npm
```cmd
npm install redux-controller-middleware
```
yarn
```cmd
yarn add redux-controller-middleware
```

## <a name="include-to-redux-middleware"></a> Include in redux middleware

Add redux-controller-middleware middleware to redux.
```ts
// configureReduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import { controllerMiddleware} from 'redux-controller-middleware';

export function configureReduxStore() {
  return configureStore({
    //
    middleware: (getDefaultMiddleware) =>
      // add react-redux-controller middleware to redux
      getDefaultMiddleware().concat(controllerMiddleware()),
  });
}
```

## <a name="how-to-use"></a> How to use

### <a name="simple-reducer"></a> Only logical reducer (without data storing)

```tsx
import { createReducer } from 'redux-controller-middleware';

const createUser = createReducer<{ name: string }>('createUser', async ({ action, dispatch, getState }) => {
  await fetch('/user/new', {
    method: 'POST',
    body: JSON.stringify({
      username: action.payload.name,
    }),
  });

  dispatch(/* some other action */);
  getState(); // get redux state
});

// somehere in your code 
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // create action and dispatch it in one line
    dispatch(createUser({ name: '' }));
  }, []);
  
  return /* you layout */;
};
```

### <a name="reducer-and-store"></a> Reducer with store slice
Create your store
```ts
// Users.slice.ts
import { storeSlice } from 'redux-controller-middleware';

@storeSlice
class UsersSlice {
  users: string[] = [];
  usersAreLoading = false;
}
```

Register the slice in redux state.
```ts
// configureReduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { combineReducers } from 'redux';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';

import { UsersSlice } from './Users.slice';

function makeReducers() {
  return getReducersFromStoreSlices({
    // register store slices
    user: UsersSlice,
  });
}

// the State type may need you somewhere...
export type State = InferState<ReturnType<typeof makeReducers>>

export function configureReduxStore() {
  const rootReducer = combineReducers(makeReducers());

  return configureStore({
    reducer: rootReducer,
    // ...
  });
}
```

```tsx
import { createReducer, updateStoreSlice } from 'redux-controller-middleware';
import { UsersSlice } from './Users.slice';

const setUserName = createReducer<{ name: string }>('setUserName', async ({ action, dispatch }) => {
  dispatch(
    updateStoreSlice(UserSlice)({
      name: action.payload.name,
    })
  );
});
```

### <a name="reducer-di"></a> Reducers with store slice and dependencies injection

Controller - is a place for a piece of logic in your application.
The differences from Saga (in `redux-saga`) is your methods is not static!
It allows you to use dependency injection technics and simplify tests.

You can also register DI container, that allows you to inject services in controllers.
```ts
// configureReduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { controllerMiddleware } from 'redux-controller-middleware';

export function configureReduxStore() {
  const middleware = controllerMiddleware<State>({
    // use cheap-di container for Dependency Injection
    getContainer: () => container,
  });

  return configureStore({
    // ...
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
  });
}
```

> **_NOTE:_** you need to adjust tsconfig.json to use stage 2 decorators:
> ```json
> {
>   "compilerOptions": {
>     // ...
>     "experimentalDecorators": true
>   }
> }
> ```

Create a controller to encapsulate a piece of application logic.
```ts
// User.controller.ts
import { createAction, ControllerBase, controller, reducer, updateStore } from 'redux-controller-middleware';
import { State } from './configureReduxStore';
import { UsersSlice } from './Users.slice';

// prepare the class to use static methods for creating of actions
@controller
export class UserController extends ControllerBase<State> {
  // add action creator with name of the method: { type: 'loadUserList' }
  @reducer
  async loadUserList() {
    this.dispatch(
      updateStore(UsersSlice)({
        usersAreLoading: true,
      })
    );

    const response = await fetch('/api/users');
    if (!response.ok) {
      this.dispatch(
        updateStore(UsersSlice)({
          usersAreLoading: false,
        })
      );

      // show error notification or something else
      return;
    }

    const users = await response.json();

    this.dispatch(
      updateStore(UsersSlice)({
        usersAreLoading: false,
        users,
      })
    );
  }
  
  @reducer loadProfile(action: Action<{ userID: string }>) {/*...*/}
  @reducer loadSomethingElse() {/*...*/}
}

// there are restrictions from decorators in TS - it cannot to change type of the decorated class,
// so we should manually cast types
// WatchedController takes all public methods of the class and adds type definition for static action creators
const userController = UserController as unknown as WatchedController<UserController>;
export { userController as UserController };
```

And now you can dispatch the controller actions from a component.
```tsx
import { useDispatch } from 'react-redux';
import { UserController } from './User.controller';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // create action and dispatch it in one line
    dispatch(UserController.loadUsers());
    dispatch(UserController.loadProfile({ userID: '123' }));
  }, []);

  return /* you layout */;
};
```

### <a name="dependency-injection"></a> Dependency injection

```ts
// api.ts
export class UserApi {
  loadUsers() {
    return fetch('/api/users');
  }
}

export abstract class AccessKey {
  abstract key: string;
}

export class UserStorage {
  constructor(private readonly accessKey: AccessKey) {}
  
  store(value: string) {
    localStorage.set(this.accessKey.key, value);
  }
}
```

```ts
// App.tsx
import { container } from 'cheap-di';
import { useEffect } from 'react';
import { AccessKey } from './api';

const App = () => {
  useEffect(() => {
    container.registerInstance({ key: 'my-secure-key' }).as(AccessKey);
  }, []);

  return /* your layout */;
}
```

```ts
// User.controller.ts
import { ControllerBase, Middleware, controller, reducer, updateStore } from 'redux-controller-middleware';
import { UserApi, UserStorage } from './api';
import { State } from './configureReduxStore';

@controller
export class UserController extends ControllerBase<State> {
  constructor(
    middleware: Middleware<State>,
    private readonly api: UserApi, // will be instantiated automaticly
    private readonly storage: UserStorage // will be instantiated with registered AccessKey
  ) {
    super(middleware);
  }

  @reducer
  async loadUserList() {
    const response = await this.api.loadUsers();
    this.storage.store(response.data);
    // ...
  }
}

const userController = UserController as unknown as WatchedController<UserController>;
export { userController as UserController };
```

### <a name="create-action"></a> createAction

You can define action creators by yourself;
```ts
import { createAction } from 'redux-controller-middleware';

export class UsersActions {
  static LOAD_USER_LIST = 'LOAD_USER_LIST';
  static loadUserList = () => createAction(UsersActions.LOAD_USER_LIST);

  static LOAD_USER = 'LOAD_USER';
  static loadUser = (data: { userID: string }) => createAction(UsersActions.LOAD_USER, data);
}
```

### <a name="chaining-action"></a> Chaining actions

You can chain action one by one:

```tsx
import { useDispatch } from 'react-redux';
import { chainActions } from 'redux-controller-middleware';
import { UserController } from './User.controller';

const UserList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const action = chainActions(
      UserController.loadProfile({ userID: '123' }),
      UserController.openUserPage({ userID: '123' }),
      // ... any other
    );
    // same as
    const action = UserController.loadProfile({ userID: '123' });
    action.addNextActions(
      UserController.openUserPage({ userID: '123' }),
      // ... any other
    );

    dispatch(action);
  }, []);

  return /* your layout */;
};
```
