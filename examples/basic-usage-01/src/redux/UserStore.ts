import { storeSlice } from 'redux-controller-middleware';
import { User } from '../types/User.js';

@storeSlice
export class UserStore {
  users: Map<User['userId'], User>;
  openedUser: User | null;
  usersAreLoading: boolean;

  constructor() {
    this.users = new Map();
    this.openedUser = null;
    this.usersAreLoading = false;
  }
}
