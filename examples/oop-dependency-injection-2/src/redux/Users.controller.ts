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
  usersAreLoading = false;
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
    this.updateStoreSlice({
      usersAreLoading: true,
    });

    const users = await this.userApi.get();

    this.updateStoreSlice({
      usersList: users,
      usersAreLoading: false,
    });
  }
}

// this type casting is required, because decorator can't change signature of the class =(
const userController = UsersController as unknown as WatchedController<UsersController>;
export { userController as UsersController };
