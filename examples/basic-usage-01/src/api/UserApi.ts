import { User } from '../types/User';

export class UserApi {
	getUsers() {
		// make yor request to real api with fetch or axios
		const response = {
			ok: true,
			data: [
				{
					userId: 1,
					name: 'Robert',
				},
				{
					userId: 2,
					name: 'Elizabeth',
				},
			] satisfies User[],
		};

		return Promise.resolve(response);
	}
}
