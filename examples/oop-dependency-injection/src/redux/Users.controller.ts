import { inject } from 'cheap-di';
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

@inject(Middleware, UserApi)
@controller
class UsersController extends ControllerBase<UsersSlice, { users: UsersSlice }> {
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

    await this.updateStoreSlice({
      usersList: users,
      usersAreLoading: false,
    });

    const { usersList } = this.getState().users;
    console.log(`list is updated ${usersList === users}`); // true
  }
}

// this type casting is required, because decorator can't change signature of the class =(
const userController = UsersController as unknown as WatchedController<UsersController>;
export { userController as UsersController };
