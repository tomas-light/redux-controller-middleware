import 'reflect-metadata';
import { Watcher } from './controller';

const IMPLICIT_WATCHER_METADATA_KEY = 'react-redux-controller controller implicit watchers';

type MetadataWatchObject = {
  watchers: Set<Watcher<any, any>>;
}
const WatchObject: MetadataWatchObject = {
  watchers: new Set(),
};

export class MetadataStorage {
  static addImplicitWatcher(watcher: Watcher<any, any>) {
    const watchObject = MetadataStorage.getWatchObject();

    watchObject.watchers.add(watcher);

    Reflect.defineMetadata(IMPLICIT_WATCHER_METADATA_KEY, watchObject, WatchObject, '');
  }

  static getImplicitWatchers(): Watcher<any, any>[] {
    const watchObject = MetadataStorage.getWatchObject() ?? WatchObject;
    return Array.from(watchObject.watchers);
  }

  private static getWatchObject(): MetadataWatchObject {
    return Reflect.getMetadata(IMPLICIT_WATCHER_METADATA_KEY, WatchObject, '') ?? WatchObject;
  }
}
