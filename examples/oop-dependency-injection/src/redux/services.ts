import { faker } from '@faker-js/faker';
import { inject } from 'cheap-di';

export class Logger {
  log(...messages: unknown[]) {
    console.log(...messages);
  }
}

@inject(Logger)
export class UserApi {
  constructor(private logger: Logger) {}

  async get() {
    this.logger.log('[my api] fetching users list');
    return [faker.person.fullName(), faker.person.fullName()];
  }
}
