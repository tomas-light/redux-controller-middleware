import {
  Action,
  ControllerBase,
  Middleware,
  controller,
  reducer,
  WatchedController,
} from '@redux-controller-middleware/src';
import { UserApi } from '../api/UserApi.js';
import { State } from '../configureReduxStore.js';
import { User } from '../types/User.js';
import { UserSlice } from './User.slice.js';

@controller
class UserController extends ControllerBase<UserSlice, State> {
  constructor(
    middleware: Middleware<State>,
    private readonly usersApi: UserApi
  ) {
    super(middleware, UserSlice);
  }

  @reducer
  async loadUsers() {
    this.updateStoreSlice({
      usersAreLoading: true,
    });

    const response = await this.usersApi.getUsers();
    if (!response.ok) {
      this.updateStoreSlice({
        usersAreLoading: false,
      });
      // call action creator of the controller from itself
      this.dispatch(userController.showErrorToast({ error: 'Oops! Something went wrong...' }));
      return;
    }

    const { users } = this.getState().users;
    const updatedUsers = new Map<number, User>(users);

    response.data.forEach((user) => {
      updatedUsers.set(user.userId, user);
    });

    this.updateStoreSlice({
      users: updatedUsers,
      usersAreLoading: false,
    });
  }

  @reducer
  openUserById(action: Action<{ userId: number }>) {
    const { userId } = action.payload;
    const { users } = this.getState().users;

    const user = users.get(userId);
    if (user) {
      this.updateStoreSlice({
        openedUser: user,
      });
    }
  }

  @reducer
  clearUser = () => {
    this.updateStoreSlice({
      openedUser: null,
    });
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
