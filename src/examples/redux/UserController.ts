import { ControllerBase } from '../../controller';
import { createAction } from '../../createAction';
import { watch } from '../../decorators';
import { Middleware } from '../../Middleware';
import { Action, WatchedController } from '../../types';
import { UserApi } from '../api/UserApi';
import { State } from '../configureRedux';
import { UserStore } from './UserStore';

@watch
class UserController extends ControllerBase<State> {
	constructor(middleware: Middleware<State>, private readonly usersApi: UserApi) {
		super(middleware);
	}

	private updateStore(partialStore: Partial<UserStore>) {
		this.dispatch(createAction(UserStore.update, partialStore));
	}

	@watch
	async loadUsers() {
		this.updateStore({
			usersAreLoading: true,
		});

		const response = await this.usersApi.getUsers();
		if (!response.ok) {
			this.updateStore({
				usersAreLoading: false,
			});
			// call action creator of the controller from itself
			this.dispatch(userController.showErrorToast({ error: 'Oops! Something went wrong...' }));
			return;
		}

		const { users } = this.getState().users;
		const updatedUsers = new Map(users);

		response.data.forEach((user) => {
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

	@watch
	showErrorToast(action: Action<{ error: string }>) {
		const { error } = action.payload;
		// display message in UI if needed
		window.alert(error);
	}
}

const userController = UserController as unknown as WatchedController<UserController>;
export { userController as UserController };
