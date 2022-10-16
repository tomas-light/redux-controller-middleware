* [install](#Installation)
* [usage](#How to use controllers)
* [controllers-di](#Register dependencies)
* [without-decorators](#Without decorators)
* [manual](#Manual action creating)

### <a name="install"></a> Installation

```bash
npm install react-redux-controller
```

### <a name="usage"></a> How to use controllers

Controller - is place for piece of logic in your application. 
The differences from Saga (in `redux-saga`) is your methods is not static! 
It allows you to use dependency injection technics and simplify tests in some cases. 

Create your store
```ts
// User.store.ts
import { Reducer } from 'react-redux-controller';

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

import { controllerMiddleware } from "react-redux-controller";
import { container } from "cheap-di";

import { UserStore } from "./User.store";

export function configureRedux() {
  const rootReducer = combineReducers({
    // register our reducers
    user: UserStore.reducer,
  });

  const middleware = controllerMiddleware<ReturnType<typeof rootReducer>>({
    // add cheap-di container to as DI resolver
    container,
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // add our middleware to redux
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

Create a controller to encapsulate a piece of application business logic.
```ts
// User.controller.ts
import { ControllerBase, watch } from 'react-redux-controller';
import { State } from "./State";
import { UsersActions } from "./Users.actions";
import { UsersStore } from "./Users.store";

@watch // this decorator adds action creators as static members of class
export class UserController extends ControllerBase<State> {
  // just to shorcat store update calls
  private updateStore(partialStore: Partial<UsersStore>) {
    this.dispatch(UsersActions.updateStore(partialStore));
  }

  @watch // add register action creator with name of method
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
But in this case you should change define this method with `DecoratedWatchedController`

```ts
import { ControllerBase, watch, DecoratedWatchedController } from 'react-redux-controller';
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
// UserApi.ts
export class UserApi {
  loadUsers() {
    return fetch('/api/users');
  }
}
```

```ts
// App.tsx
import { useEffect } from 'react';
import { container } from 'cheap-di';
import { UserApi } from './UserApi';

const App = () => {
  useEffect(() => {
    container.registerType(UserApi);
  }, []);

  return /* your layout */;
}
```

```ts
// User.controller.ts
import { ControllerBase, watch } from 'react-redux-controller';
import { State } from "./State";
import { UsersActions } from "./Users.actions";
import { UsersStore } from "./Users.store";

@watch
export class UserController extends ControllerBase<State> {
  constructor(middleware: Middleware<State>, private userApi: UserApi) {
    super(middleware);
  }

  @watch
  async loadUserList() {
    const response = await this.userApi.loadUsers();
    /*...*/
  }
}

const typedController = (UserController as unknown) as WatchedController<UserController>;
export { typedController as UserController };
```

### <a name="without-decorators"></a> Without decorators

If you can't use decorators, you have to add watcher to your controller.

```ts
// User.watcher.ts
import { watcher } from 'react-redux-controller';

import { UserActions } from './User.actions';
import { UserController } from './User.controller';

export const UserWatcher = watcher<UserController>(
  UserController,
  [
    [
      UserActions.LOAD_USER_LIST,
      'loadUserList', // typescript will check that this string corresponds to real method name in your controller
    ],
    [
      UserActions.LOAD_USER,
      'loadUser',
    ],
    //...
  ]);
```

```ts
// controllerWatchers.ts
import { Watcher } from 'react-redux-controller';
import { State } from "./State";
import { UserWatcher } from '/User.watcher';

const controllerWatchers: Watcher<State>[] = [
  UserWatcher,
  // rest watchers
];

export { controllerWatchers };
```
```ts
// configRedux.ts
import { combineReducers } from "redux";
import { controllerMiddleware } from "react-redux-controller";
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

### <a name="manual"></a> Manual action creating
You can define action creators by yourself;
```ts
// Users.actions.ts
import { createAction, createActionWithCallback } from "react-redux-controller";
import { UsersStore } from "./Users.store";

export class UsersActions {
  static readonly PREFIX = "USERS_";

  static readonly LOAD_USER_LIST = `${UsersActions.PREFIX}LOAD_USER_LIST`;
  static readonly LOAD_USER = `${UsersActions.PREFIX}LOAD_USER`;
  static readonly LOAD_CURRENT_USER = `${UsersActions.PREFIX}LOAD_CURRENT_USER`;
  static readonly LOAD_SOMETHING_ELSE = `${UsersActions.PREFIX}LOAD_SOMETHING_ELSE`;

  static loadUserList = () => createAction(UsersActions.LOAD_USER_LIST);
  static loadUser = (data: { userID: string }) => createAction(UsersActions.LOAD_USER, data);
  static loadCurrentUser = () => createActionWithCallback(UsersActions.LOAD_CURRENT_USER);
  static loadSomethingElse = () => createAction(UsersActions.LOAD_SOMETHING_ELSE);
}
```

```ts
// UsersPageContainer.ts
import { ComponentType } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { UsersActions } from "./Users.actions";
import { Props, UsersPage } from "./UsersPage";

const mapDispatchToProps = (dispatch: Dispatch): Props => ({
  loadUsers: () => dispatch(UsersActions.loadUserList()),
  loadUser: (userID: string) => dispatch(UsersActions.loadUser({ userID })),
  loadCurrentUser: () => dispatch(
    UsersActions.loadCurrentUser()(
      // this action will be dispatched after loadCurrentUser will be handled in controller
      () => UsersActions.loadSomethingElse()
    )
  ),
});

const UsersPageContainer: ComponentType = connect(
  null,
  mapDispatchToProps
)(UsersPage);

export { UsersPageContainer };
```
