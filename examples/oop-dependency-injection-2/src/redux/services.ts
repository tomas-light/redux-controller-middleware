export class Logger {
  log(...messages: unknown[]) {
    console.log(...messages);
  }
}

export class UserApi {
  constructor(private logger: Logger) {}

  async get() {
    this.logger.log('[my api] fetching users list');
    return ['user-1', 'user-2'];
  }
}
