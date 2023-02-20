import { createReducer } from '../../createReducer';
import { User } from '../types/User';

export class UserStore {
	users: Map<User['userId'], User>;
	openedUser: User | null;
	usersAreLoading: boolean;

	constructor() {
		this.users = new Map();
		this.openedUser = null;
		this.usersAreLoading = false;
	}

	static update = 'MyStore_update';
	static reducer = createReducer(new UserStore(), UserStore.update);
}
