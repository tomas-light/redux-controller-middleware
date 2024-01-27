import { faker } from '@faker-js/faker';
import { User } from '../types/User.js';

export class UserApi {
  getUsers() {
    // make yor request to real api with fetch or axios
    const response = {
      ok: true,
      data: [
        {
          userId: faker.number.int(),
          name: faker.person.fullName(),
        },
        {
          userId: faker.number.int(),
          name: faker.person.fullName(),
        },
      ] satisfies User[],
    };

    return Promise.resolve(response);
  }
}
