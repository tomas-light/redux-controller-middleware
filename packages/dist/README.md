# redux-controller-middleware

Adjust Redux middleware to be able to use controllers with Dependency Injection to handle actions.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mui/material-ui/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/redux-controller-middleware/latest.svg)](https://img.shields.io/npm/v/redux-controller-middleware/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/redux-controller-middleware/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/redux-controller-middleware)

* [Installation](#installation)
* [Include in redux middleware](#include-to-redux-middleware)
* [How to use](#how-to-use)
  * [Functional approach](#functional-approach)
  * [OOP approach](#oop-approach)
  * [Dependency injection](#dependency-injection)
    * [Functional variant](#dependency-injection-functional)
  * [createAction](#createAction)
  * [Chaining actions](#chaining-action)

## <a name="installation"></a> Installation
npm
```shell
npm install redux-controller-middleware
```
yarn
```shell
yarn add redux-controller-middleware
```

## <a name="include-to-redux-middleware"></a> Include in redux middleware

Add redux-controller-middleware middleware to redux.
```ts
// store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';

// add user slice reducer
const makeReducers = () =>
  getReducersFromStoreSlices({
    users: UsersSlice, // read bellow what is it
    // ...
  });

export type RootState = InferState<ReturnType<typeof makeReducers>>;

export const store = configureStore({
  reducer: combineReducers(makeReducers()),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(controllerMiddleware()),
});
```

## <a name="how-to-use"></a> How to use

### <a name="functional-approach"></a> Functional approach

```ts
// addUser.ts
import { createReducer, storeSlice, updateStoreSlice } from 'redux-controller-middleware';

export type User = {
  userId: string;
  userName: string;
};

@storeSlice
export class UsersSlice {
  usersList: User[] = [];
}

export const addUser = createReducer<{ name: string }, { users: UsersSlice }>(
  'addUser',
  async ({ action, dispatch, getState }) => {
    const newUserResponse = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        username: action.payload.name
      })
    });

    const newUser = await newUserResponse.json();

    const { usersList } = getState().users;
    dispatch(
      updateStoreSlice(UsersSlice)({
        usersList: usersList.concat(newUser)
      })
    );
  }
);
```

```tsx
// your component
const Users = () => {
  const dispatch = useDispatch();

  const { usersList } = useAppSelector((state) => state.users);
  const [userNumber, setUserNumber] = useState(0);

  return (
    <div>
      <div>
        {usersList.map((user) => (
          <p key={user.userId}>{user.userName}</p>
        ))}
      </div>

      <button
        onClick={() => {
          setUserNumber((prev) => prev + 1);
          dispatch(addUser({ name: `new-user-${userNumber + 1}` }));
        }}
      >
        add user
      </button>
    </div>
  );
};
```

```ts
// store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { controllerMiddleware, getReducersFromStoreSlices, InferState } from 'redux-controller-middleware';
import { UsersSlice } from './addUser.ts';

// add user slice reducer
const makeReducers = () =>
  getReducersFromStoreSlices({
    users: UsersSlice,
  });

export const store = configureStore({
  reducer: combineReducers(makeReducers()),
  // add redux-controller-middleware to redux
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables warnings on chaining functions in Action
    }).concat(controllerMiddleware()),
});

export type RootState = InferState<ReturnType<typeof makeReducers>>;
```


### <a name="oop-approach"></a> OOP approach

```ts
// UsersController.ts
import {
  ControllerBase,
  Middleware,
  storeSlice,
  controller,
  reducer,
  Action,
  WatchedController,
} from 'redux-controller-middleware';

export type User = {
  userId: string;
  userName: string;
};

@storeSlice
export class UsersSlice {
  usersList: User[] = [];
}

@controller
class UsersController extends ControllerBase<UsersSlice, { users: UsersSlice }> {
  constructor(middleware: Middleware<{ users: UsersSlice }>) {
    super(middleware, UsersSlice);
  }

  @reducer
  async addUser(action: Action<{ name: string }>) {
    const newUser = await Promise.resolve().then(() => ({
      userId: new Date().valueOf().toString(),
      userName: action.payload.name,
    }));

    const { usersList } = this.getState().users;

    this.updateStoreSlice({
      usersList: usersList.concat(newUser),
    });
  }
}

// this type casting is required, because decorator can't change signature of the class =(
const userController = UsersController as unknown as WatchedController<UsersController>;
export { userController as UsersController };
```

```tsx
// your component
const Users = () => {
  const dispatch = useDispatch();
  // ...

  return (
    <div>
      {/*...*/}

      <button
        onClick={() => {
          dispatch(UsersController.addUser({ name: `new-user-${userNumber + 1}` }));
        }}
      >
        add user
      </button>
    </div>
  );
};
```

## <a name="dependency-injection"></a> Dependency injection

### <a name="dependency-injection-functional"></a> Functional variant

To use dependency injection you need provide `getContainer` to `controllerMiddleware` function. Read more on <a href="https://github.com/tomas-light/cheap-di/tree/master/packages/cheap-di">cheap-di</a> README page

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { controllerMiddleware } from 'redux-controller-middleware';

export const store = configureStore({
  reducer: {},
  // add redux-controller-middleware to redux
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables warnings on chaining functions in Action
    }).concat(
      controllerMiddleware({
        getContainer: () => container,
      })
    ),
});
```


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
