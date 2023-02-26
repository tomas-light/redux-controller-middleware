# redux-controller-middleware

Adjust Redux middleware to be able to use controllers with Dependency Injection to handle actions.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mui/material-ui/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/redux-controller-middleware/latest.svg)](https://img.shields.io/npm/v/redux-controller-middleware/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/redux-controller-middleware/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/redux-controller-middleware)

* [Installation](#installation)
* [How to use](#how-to-use)
  * [Custom action names](#custom-action-names)
  * [Dependency injection](#dependency-injection)
  * [createAction](#createAction)
  * [Chaining actions](#chaining-action)
  * [Without decorators](#without-decorators)

## <a name="installation"></a> Installation
npm
```cmd
npm install redux-controller-middleware
```
yarn
```cmd
yarn add redux-controller-middleware
```

## <a name="how-to-use"></a> How to use

Controller - is a place for a piece of logic in your application. 
The differences from Saga (in `redux-saga`) is your methods is not static! 
It allows you to use dependency injection technics and simplify tests. 

Create your store
```ts
// User.store.ts
import { createReducer } from 'redux-controller-middleware';

class UserStore {
  users: string[] = [];
  usersAreLoading = false;

  static update = 'USER_update_store';
  static reducer = createReducer(new UserStore(), UserStore.update);
}
```

Register store reducer and add redux-controller-middleware middleware to redux. 
You can also register DI container, that allows you to inject services in controllers.
```ts
// configureReduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { combineReducers } from 'redux';
import { controllerMiddleware, InferState } from 'redux-controller-middleware';

import { UserStore } from './User.store';

function makeReducers() {
  return {
    // register our reducers
    user: UserStore.reducer,
  };
}

export type State = InferState<ReturnType<typeof makeReducers>>

export function configureReduxStore() {
  const rootReducer = combineReducers(makeReducers());

  const middleware = controllerMiddleware<State>({
    // use cheap-di container for Dependency Injection
    container,
  });

  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // add react-redux-controller middleware to redux
      getDefaultMiddleware().concat([middleware]),
  });
}
```

Create a controller to encapsulate a piece of application logic.
```ts
// User.controller.ts
import { createAction, ControllerBase, watch } from 'redux-controller-middleware';
import { State } from './configureReduxStore';
import { UserStore } from './User.store';

// prepare the class to use static methods for creating of actions
@watch
export class UserController extends ControllerBase<State> {
  // just to shortcat store update calls
  private updateStore(partialStore: Partial<UserStore>) {
    this.dispatch(createAction(UserStore.update, partialStore));
  }

  // add action creator with name of the method: { type: 'loadUserList' }
  @watch
  async loadUserList() {
    this.updateStore({
      usersAreLoading: true,
    });

    const response = await fetch('/api/users');
    if (!response.ok) {
      this.updateStore({
        usersAreLoading: false,
      });

      // show error notification or something else
      return;
    }

    const users = await response.json();
    
    this.updateStore({
      usersAreLoading: false,
      users,
    });
  }
  
  @watch loadProfile(action: Action<{ userID: string }>) {/*...*/}
  @watch loadSomethingElse() {/*...*/}
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

const UserList = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // create action and dispatch it in one line
    dispatch(UserController.loadUsers());
    dispatch(UserController.loadProfile({ userID: '123' }));
  }, []);
  
  return <>...</>;
};
```

That's it!


### <a name="custom-action-names"></a> Custom action names

You can use custom action name, like `@watch('myCustomActionName')`.
In this case you should to pass name mapper type as second argument of `WatchedController`

```ts
import { ControllerBase, watch, WatchedController } from 'redux-controller-middleware';
import { State } from './configureReduxStore';

@watch
export class UserController extends ControllerBase<State> {
  /* ... */

  @watch loadUser(action: Action<{ userID: string }>) {/* ... */}
  @watch('loadChatById') loadChatByIdFromSpecialStorage(action: Action<{ chatId: string }>) {/* ... */}
}

const userController = UserController as unknown as WatchedController<UserController, {
  loadChatByIdFromSpecialStorage: 'loadChatById', // map original method name to the new one
}>;
export { userController as UserController };
```

### <a name="dependency-injection"></a> Dependency injection

```ts
// api.ts
const metadata = <T>(constructor: T): T => constructor;

export class UserApi {
  loadUsers() {
    return fetch('/api/users');
  }
}

export abstract class AccessKey {
  abstract key: string;
}

// need any decorator for adding metadata to the constructor
// https://github.com/tomas-light/cheap-di#typescript
@metadata
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
import { ControllerBase, Middleware, watch } from 'redux-controller-middleware';
import { UserApi, UserStorage } from './api';
import { State } from './configureReduxStore';

@watch
export class UserController extends ControllerBase<State> {
  constructor(
    middleware: Middleware<State>,
    private readonly api: UserApi, // will be instantiated automaticly
    private readonly storage: UserStorage // will be instantiated with registered AccessKey
  ) {
    super(middleware);
  }

  @watch
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
  
  return <>...</>;
};
```

### <a name="without-decorators"></a> Without decorators

If you can't use decorators, you have to add watcher to your controller.

```ts
// User.watcher.ts
import { watcher } from 'redux-controller-middleware';
import { UserActions } from './User.actions';
import { UserController } from './User.controller';

export const UserWatcher = watcher(UserController,
{
  [UserActions.LOAD_USER_LIST]: 'loadUserList', // typescript will check that this string corresponds to real method name in your controller
  [UserActions.LOAD_USER]: 'loadUser',
  //...
});
```

```ts
// controllerWatchers.ts
import { Watcher } from 'redux-controller-middleware';
import { UserWatcher } from '/User.watcher';

const controllerWatchers: Watcher[] = [
  UserWatcher,
  // rest watchers
];

export { controllerWatchers };
```
```ts
// configRedux.ts
import { combineReducers } from 'redux';
import { controllerMiddleware } from 'redux-controller-middleware';
import { controllerWatchers } from './controllerWatchers';

export function configureRedux() {
  const rootReducer = combineReducers(/*...*/);

  const middleware = controllerMiddleware<State>({
    container,
    watchers: controllerWatchers,
  });

  // ...

  return store;
}
```
