import { ControllerBase } from '../../controller';
import { createAction } from '../../createAction';
import { watch } from '../../decorators';
import { Action, WatchedController } from '../../types';
import { State } from '../configureRedux';
import { User } from '../types/User';
import { UserStore } from './UserStore';

@watch
class UserController extends ControllerBase<State> {
	private updateStore(partialStore: Partial<UserStore>) {
		this.dispatch(createAction(UserStore.update, partialStore));
	}

	@watch
	async loadUsers() {
		this.updateStore({
			usersAreLoading: true,
		});

		// like request to API
		const downloadedUsers = await Promise.resolve<User[]>([
			{
				userId: 1,
				name: 'Robert',
			},
			{
				userId: 2,
				name: 'Elizabeth',
			},
		]);

		const { users } = this.getState().users;
		const updatedUsers = new Map(users);

		downloadedUsers.forEach((user) => {
			updatedUsers.set(user.userId, user);
		});

		this.updateStore({
			users: updatedUsers,
			usersAreLoading: false,
		});
	}

	@watch
	openUserById(action: Action<{ userId: number }>) {
		const { userId } = action.payload;
		const { users } = this.getState().users;

		const user = users.get(userId);
		if (user) {
			this.updateStore({
				openedUser: user,
			});
		}
	}
}

const typedController = UserController as unknown as WatchedController<UserController>;
export { typedController as UserController };
