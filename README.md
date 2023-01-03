* [Installation](#install)
* [How to use controllers](#usage)
* [Register dependencies](#controller-di)
* [Without decorators](#without-decorators)
* [Action creating](#action-creating)

### <a name="install"></a> Installation

```bash
npm install @tomas_light/react-redux-controller
```

### <a name="usage"></a> How to use controllers

Controller - is place for piece of logic in your application. 
The differences from Saga (in `redux-saga`) is your methods is not static! 
It allows you to use dependency injection technics and simplify tests in some cases. 

Create your store
```ts
// User.store.ts
import { Reducer } from '@tomas_light/react-redux-controller';

class UserStore {
  users: string[] = [];
  usersAreLoading = false;

  static update = 'USER_update_store';
  static reducer = Reducer(new UserStore(), UserStore.update);
}
```

Register store reducer and add react-redux-controller middleware to redux. 
You can also register DI container, that allows you to inject services in controllers.
```ts
// configRedux.ts
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { controllerMiddleware } from "@tomas_light/react-redux-controller";
import { container } from "cheap-di";

import { UserStore } from "./User.store";

export function configureRedux() {
  const rootReducer = combineReducers({
    // register our reducers
    user: UserStore.reducer,
  });

  const middleware = controllerMiddleware<ReturnType<typeof rootReducer>>({
    // use cheap-di container for Dependency Injection
    container,
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // add react-redux-controller middleware to redux
      getDefaultMiddleware().concat([middleware]),
  });

  return store;
}
```

```ts
// State.ts
import { configureRedux } from "./configureRedux";

// infer type from reducers registration
export type State = ReturnType<ReturnType<typeof configureRedux>["getState"]>;
```

Create a controller to encapsulate a piece of application logic.
```ts
// User.controller.ts
import { ControllerBase, createAction, watch } from '@tomas_light/react-redux-controller';
import { State } from "./State";
import { UsersStore } from "./Users.store";

// prepare the class to use static methods for creating of actions
@watch
export class UserController extends ControllerBase<State> {
  // just to shorcat store update calls
  private updateStore(partialStore: Partial<UsersStore>) {
    this.dispatch(createAction(UsersStore.update, partialStore));
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
// so we should manually do it =(
// WatchedController takes all methods of the class and adds type definition for static action creators
const typedController = (UserController as unknown) as WatchedController<UserController>;
export { typedController as UserController };
```

And now you can dispatch the controller actions from a component.
```tsx
// UserList.ts
import { useDispatch } from 'react-redux';
import { UserController } from './UserController';

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


#### <a name="usage"></a> Custom action names

You can use custom action name, like `@watch('myCustomActionName')`.
But in this case you should change definition of such method with `DecoratedWatchedController`

```ts
import { ControllerBase, watch, DecoratedWatchedController } from '@tomas_light/react-redux-controller';
import { State } from "./State";

@watch
export class UserController extends ControllerBase<State> {
  /* ... */

  @watch loadUser(action: Action<{ userID: string }>) {/* ... */}
  @watch('loadChatInfo') loadCurrentUser(action: Action<{ chat: boolean }>) {/* ... */}
}

type Controller = 
  // keep infered type for all actions except action with custom action type
  Omit<WatchedController<UserController>, 'loadCurrentUser'>
  // specify type for custom action
  & DecoratedWatchedController<[
    ['loadChatInfo', { userID: string; }]
]>;

const typedController = (UserController as unknown) as Controller;
export { typedController as UserController };
```

### <a name="controller-di"></a> Register dependencies

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

@metadata // need any decorator (read cheap-di docs)
export class UserStorage {
  constructor(private readonly accessKey: AccessKey) {}
  
  store(value: string) {
    localStorage.set(this.accessKey.key, value);
  }
}
```


```ts
// App.tsx
import { useEffect } from 'react';
import { container } from 'cheap-di';
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
import { ControllerBase, watch } from '@tomas_light/react-redux-controller';
import { State } from "./State";
import { UserApi, UserStorage } from './api';

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

const typedController = (UserController as unknown) as WatchedController<UserController>;
export { typedController as UserController };
```

### <a name="without-decorators"></a> Without decorators

If you can't use decorators, you have to add watcher to your controller.

```ts
// User.watcher.ts
import { watcher } from '@tomas_light/react-redux-controller';
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
import { Watcher } from '@tomas_light/react-redux-controller';
import { UserWatcher } from '/User.watcher';

const controllerWatchers: Watcher[] = [
  UserWatcher,
  // rest watchers
];

export { controllerWatchers };
```
```ts
// configRedux.ts
import { combineReducers } from "redux";
import { controllerMiddleware } from "@tomas_light/react-redux-controller";
import { controllerWatchers } from "./controllerWatchers";

export function configureRedux() {
  const rootReducer = combineReducers(/*...*/);

  const middleware = controllerMiddleware<ReturnType<typeof rootReducer>>({
    container,
    watchers: controllerWatchers,
  });

  // ...

  return store;
}
```

### <a name="action-creating"></a> Action creating
You can define action creators by yourself;
```ts
import { createAction } from "@tomas_light/react-redux-controller";

export class UsersActions {
  static LOAD_USER_LIST = 'LOAD_USER_LIST';
  static loadUserList = () => createAction(UsersActions.LOAD_USER_LIST);

  static LOAD_USER = 'LOAD_USER';
  static loadUser = (data: { userID: string }) => createAction(UsersActions.LOAD_USER, data);
}
```
