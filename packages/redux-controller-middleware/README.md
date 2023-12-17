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

> **_NOTE:_**
> Controller - is a place for a piece of logic in your application.
> The differences from Saga (in `redux-saga`) is your methods is not static!
> It allows you to use dependency injection technics and simplify tests.

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

To use dependency injection you need provide `container` to `controllerMiddleware` function. Read more on <a href="https://github.com/tomas-light/cheap-di/tree/master/packages/cheap-di">cheap-di</a> README page

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { container } from 'cheap-di';
import { controllerMiddleware } from 'redux-controller-middleware';

export const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      controllerMiddleware({
        container,
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
	constructor(private logger: Logger) {
	}

	async get() {
		this.logger.log('[my api] fetching users list');
		return ['user-1', 'user-2'];
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
  constructor(private logger: Logger) {
  }

  async get() {
    this.logger.log('[my api] fetching users list');
    return ['user-1', 'user-2'];
  }
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

> **_NOTE:_** such instantiation technic is called Service Locator and it is counted as anti-pattern, that is why we recommend to use <a href="#dependency-injection-oop">OOP variant</a> of dependency injection.

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

    this.updateStoreSlice({
      usersList: users,
    });
  }
}

// this type casting is required, because decorator can't change signature of the class =(
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

You can chain action one by one:

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