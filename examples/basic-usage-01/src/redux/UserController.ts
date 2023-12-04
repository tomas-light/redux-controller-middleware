import {
  ControllerBase,
  createAction,
  watch,
  Middleware,
  Action,
  WatchedController,
  updateStoreSlice,
} from 'redux-controller-middleware';
import { UserApi } from '../api/UserApi';
import { State } from '../configureReduxStore';
import { UserStore } from './UserStore';

@watch
class UserController extends ControllerBase<State> {
  constructor(
    middleware: Middleware<State>,
    private readonly usersApi: UserApi
  ) {
    super(middleware);
  }

  @watch
  async loadUsers() {
    this.dispatch(
      updateStoreSlice(UserStore)({
        usersAreLoading: true,
      })
    );

    const response = await this.usersApi.getUsers();
    if (!response.ok) {
      this.dispatch(
        updateStoreSlice(UserStore)({
          usersAreLoading: false,
        })
      );
      // call action creator of the controller from itself
      this.dispatch(userController.showErrorToast({ error: 'Oops! Something went wrong...' }));
      return;
    }

    const { users } = this.getState().users;
    const updatedUsers = new Map(users);

    response.data.forEach((user) => {
      updatedUsers.set(user.userId, user);
    });

    this.dispatch(
      updateStoreSlice(UserStore)({
        users: updatedUsers,
        usersAreLoading: false,
      })
    );
  }

  @watch
  openUserById(action: Action<{ userId: number }>) {
    const { userId } = action.payload;
    const { users } = this.getState().users;

    const user = users.get(userId);
    if (user) {
      this.dispatch(
        updateStoreSlice(UserStore)({
          openedUser: user,
        })
      );
    }
  }

  @watch
  showErrorToast(action: Action<{ error: string }>) {
    const { error } = action.payload;
    // display message in UI if needed
    window.alert(error);
  }
}

const userController = UserController as unknown as WatchedController<UserController>;
export { userController as UserController };
