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
    * [OOP variant](#dependency-injection-oop)
  * [createAction](#createAction)
  * [Chaining actions](#chaining-action)
  * [How about tests?](#tests)

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
import { faker } from '@faker-js/faker';
import { useDispatch } from 'react-redux';
import { addUser } from './addUser.ts';
import { useAppSelector } from './store.ts';

const Users = () => {
  const dispatch = useDispatch();

  const { usersList } = useAppSelector((state) => state.users);

  return (
    <div>
      <div>
        {usersList.map((user) => (
          <p key={user.userId}>{user.userName}</p>
        ))}
      </div>

      <button
        onClick={() => {
          dispatch(addUser({ name: faker.person.fullName() }));
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
import { TypedUseSelectorHook, useSelector } from 'react-redux';
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
    getDefaultMiddleware().concat(controllerMiddleware()),
});

export type RootState = InferState<ReturnType<typeof makeReducers>>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```


### <a name="oop-approach"></a> OOP approach

> **_NOTE:_**
> Controller - is a place for a piece of logic in your application.
> The differences from Saga (in `redux-saga`) is your methods is not static!
> It allows you to use dependency injection technics and simplify tests.

```ts
// Users.controller.ts
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
    const newUserResponse = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        username: action.payload.name
      })
    });

    const newUser = await newUserResponse.json();

    const { usersList } = this.getState().users;

    this.updateStoreSlice({
      usersList: usersList.concat(newUser),
    });
  }
}

// this type casting is required because the decorator can't change the signature of the class =(
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
          dispatch(
            // action creator looks like static method of the controller class
            UsersController.addUser({ name: faker.person.fullName() })
          );
        }}
      >
        add user
      </button>
    </div>
  );
};
```

## <a name="dependency-injection"></a> Dependency injection

To use dependency injection, you need to provide `container` to `controllerMiddleware` function. Read more on <a href="https://github.com/tomas-light/cheap-di/tree/master/packages/cheap-di">cheap-di</a> README page

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { controllerMiddleware } from 'redux-controller-middleware';

export const store = configureStore({
  reducer: {...},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      controllerMiddleware({
        container, // DI container attached to middleware
      })
    ),
});
```

Configure <a href="https://github.com/tomas-light/cheap-di/tree/master/packages/cheap-di-ts-transform">cheap-di-ts-transform</a> to generate dependencies metadata.
```ts
// services.ts
export class Logger {
  log(...messages: unknown[]) {
    console.log(...messages);
  }
}

export class UserApi {
  constructor(private logger: Logger) {}
  
  async get() {
    this.logger.log('[my api] fetching users list');
    const response = await fetch('/api/user');
    return response.json();
  }
}
// services.ts
```

Or use `@inject` decorator to register dependencies yourself
```ts
import { inject } from 'cheap-di';

export class Logger {
  log(...messages: unknown[]) {
    console.log(...messages);
  }
}

@inject(Logger)
export class UserApi {
  constructor(private logger: Logger) {}

  async get() {
    this.logger.log('[my api] fetching users list');
    const response = await fetch('/api/user');
    return response.json();
  }
}
```

> **_NOTE:_** To use stage 2 decorators, you need to adjust your tsconfig.json like this:
> ```json
> {
>   "compilerOptions": {
>     // ...
>     "experimentalDecorators": true
>   }
> }
> ```
> To use stage 3 decorators, you don't need extra setup.

### <a name="dependency-injection-functional"></a> Functional variant

You may instantiate the service inside your reducer like this:
```ts
import { createReducer, storeSlice, updateStoreSlice } from 'redux-controller-middleware';
import { UserApi } from './services.ts';

@storeSlice
export class UsersSlice {
  usersList: string[] = [];
}

export const fetchUsers = createReducer('fetchUsers', async ({ container, dispatch }) => {
  const userApi = container?.resolve(UserApi);
  if (!userApi) {
    return;
  }

  const users = await userApi.get();

  dispatch(
    updateStoreSlice(UsersSlice)({
      usersList: users,
    })
  );
});
```

> **_NOTE:_** such instantiation technic is called Service Locator, and it is counted as anti-pattern that is why we recommend using the <a href="#dependency-injection-oop">OOP variant</a> of dependency injection.

### <a name="dependency-injection-oop"></a> OOP variant

Controller gets its dependencies automatically from middleware
```ts
// User.controller.ts
import {
  controller,
  ControllerBase,
  Middleware,
  reducer,
  storeSlice,
  WatchedController,
} from 'redux-controller-middleware';
import { UserApi } from './services.ts';

@storeSlice
export class UsersSlice {
  usersList: string[] = [];
}

@controller
class UsersController extends ControllerBase<UsersSlice> {
  constructor(
    middleware: Middleware,
    private readonly userApi: UserApi
  ) {
    super(middleware, UsersSlice);
  }

  @reducer
  async fetchUsers() {
    const users = await this.userApi.get();

    // you also may wait untill the update will be applied to the redux state, if you need it
    await this.updateStoreSlice({
      usersList: users,
    });

    console.log('store has updated');

    const { usersList } = this.getState().users;
    console.log(`list is updated ${usersList === users}`); // true
  }
}

// this type casting is required because the decorator can't change the signature of the class =(
const userController = UsersController as unknown as WatchedController<UsersController>;
export { userController as UsersController };
```

### <a name="create-action"></a> createAction

You can define action creators yourself:
```ts
import { createAction } from 'redux-controller-middleware';

const loadUserList = () => createAction('load user list');

const loadUser = (data: { userID: string }) => createAction('load user', data);
```

### <a name="chaining-action"></a> Chaining actions

You can chain actions one by one:
```tsx
import { useDispatch } from 'react-redux';
import { chainActions } from 'redux-controller-middleware';
import { UserController } from './User.controller';

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const action = chainActions(
      UserController.loadProfile({ userID: '123' }),
      UserController.openUserPage({ userID: '123' }),
      // ... any other
    );

    dispatch(action);
  }, []);

  return /* your layout */;
};
```

### <a name="tests"></a> How about tests?

We prepare a few functions to simplify middleware and mocking in tests:

`getStoreSliceUpdateActionType` - helps you to extract action type of a store slice update method:
```ts
import { getStoreSliceUpdateActionType, storeSlice } from 'redux-controller-middleware';

@storeSlice
export class UserSlice {
  // ...
}

test('...', () => {
  const someActionInYourTest = /* ... */;
  
  const updateActionType = getStoreSliceUpdateActionType(UserSlice);
  expect(someActionInYourTest.type).toBe(updateActionType);
});
```

`makeActionType` - helps you to create action type with passed parameters to compare an action type in your tests
with expected value. All actions except store slice update action has unique salt in their action types
(<i>that equals current milliseconds of time by default</i>). So you may check only if your action type is started with
desired action type part.
```ts
import { createReducer, makeActionType, mockMiddlewareForTests } from 'redux-controller-middleware';

const loadUsers = createReducer('loadUsers', () => {/*...*/});

test('...', async () => {
  const mockedMiddleware = mockMiddlewareForTests();
  const { dispatch, dispatchedActions } = mockedMiddleware;
  
  await dispatch(loadUsers());
	
  const [firstAction] = dispatchedActions;

  const actionTypePart = makeActionType({
    methodName: 'loadUsers',
  });
  
  expect(firstAction?.type.startsWith(actionTypePart)).toBe(true);
});
```
```ts
import { controller, makeActionType, mockMiddlewareForTests, reducer } from 'redux-controller-middleware';

@controller
class UserController extends ControllerBase {
	// ...
  @reducer
  async loadUsers() {
		// ...
  }
}

test('...', async () => {
  const mockedMiddleware = mockMiddlewareForTests();
  const { dispatch, dispatchedActions } = mockedMiddleware;
  
  await dispatch(UserController.loadUsers());
	
  const [firstAction] = dispatchedActions;

  const actionTypePart = makeActionType({
    controllerName: 'UserController',
    // same as 
    // controllerName: 'User'
    methodName: 'loadUsers',
  });
  
  expect(firstAction?.type.startsWith(actionTypePart)).toBe(true);
});
```

`mockMiddlewareForTests` - helps you mock middleware and state, dispatch actions and analyze the process.
```ts
test('it sets opened user to null', async () => {
  const mockedMiddleware = mockMiddlewareForTests({ users: UserSlice });
  const { dispatch, state } = mockedMiddleware;

  state.users.openedUser = {
    userId: faker.number.int(),
    name: faker.person.fullName(),
  };

  // dispatch action and wait until it will be resolved
  await dispatch(UserController.clearUser());

  expect(state.users.openedUser).toBeNull();
});
```

You can find more tests examples in
<a href="https://github.com/tomas-light/redux-controller-middleware/blob/master/examples">GitHub examples</a>
