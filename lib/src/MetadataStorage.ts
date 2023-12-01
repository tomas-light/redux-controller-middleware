import { Watcher } from './types';

type MetadataWatchObject = {
  watchers: Set<Watcher>;
};
const WatchObject: MetadataWatchObject = {
  watchers: new Set(),
};

export class MetadataStorage {
  static addImplicitWatcher(watcher: Watcher) {
    const watchObject = MetadataStorage.getWatchObject();
    watchObject.watchers.add(watcher);
  }

  static getImplicitWatchers(): Watcher[] {
    const watchObject = MetadataStorage.getWatchObject() ?? WatchObject;
    return Array.from(watchObject.watchers);
  }

  private static getWatchObject(): MetadataWatchObject {
    return WatchObject;
  }
}
