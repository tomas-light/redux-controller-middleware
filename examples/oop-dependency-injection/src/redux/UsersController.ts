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
  usersList: string[] = [];
}

@inject(Middleware, UserApi)
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
