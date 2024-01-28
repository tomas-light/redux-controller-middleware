import { faker } from '@faker-js/faker';
import {
  Action,
  controller,
  ControllerBase,
  Middleware,
  reducer,
  storeSlice,
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
      userId: faker.string.uuid(),
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
