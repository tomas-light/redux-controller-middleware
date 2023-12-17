import {
  Action,
  ControllerBase,
  Middleware,
  updateStoreSlice,
  controller,
  reducer,
  WatchedController,
} from 'redux-controller-middleware';
import { UserApi } from '../api/UserApi.js';
import { State } from '../configureReduxStore.js';
import { User } from '../types/User.js';
import { UserSlice } from './User.slice.js';

@controller
class UserController extends ControllerBase<InstanceType<UserSlice>, UserSlice, State> {
  constructor(
    middleware: Middleware<State>,
    private readonly usersApi: UserApi
  ) {
    super(middleware, UserSlice);
  }

  @reducer
  async loadUsers() {
    this.dispatch(
      updateStoreSlice(UserSlice)({
        usersAreLoading: true,
      })
    );

    const response = await this.usersApi.getUsers();
    if (!response.ok) {
      this.dispatch(
        updateStoreSlice(UserSlice)({
          usersAreLoading: false,
        })
      );
      // call action creator of the controller from itself
      this.dispatch(userController.showErrorToast({ error: 'Oops! Something went wrong...' }));
      return;
    }

    const { users } = this.getState().users;
    const updatedUsers = new Map<number, User>(users);

    response.data.forEach((user) => {
      updatedUsers.set(user.userId, user);
    });

    this.dispatch(
      updateStoreSlice(UserSlice)({
        users: updatedUsers,
        usersAreLoading: false,
      })
    );
  }

  @reducer
  openUserById(action: Action<{ userId: number }>) {
    const { userId } = action.payload;
    const { users } = this.getState().users;

    const user = users.get(userId);
    if (user) {
      this.dispatch(
        updateStoreSlice(UserSlice)({
          openedUser: user,
        })
      );
    }
  }

  @reducer
  clearUser = () => {
    this.dispatch(
      updateStoreSlice(UserSlice)({
        openedUser: null,
      })
    );
  };

  @reducer
  showErrorToast(action: Action<{ error: string }>) {
    const { error } = action.payload;
    // display message in UI if needed
    window.alert(error);
  }
}

const userController = UserController as unknown as WatchedController<UserController>;
export { userController as UserController };
