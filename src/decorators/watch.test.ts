import { ControllerBase } from '../controller';
import { createAction } from '../createAction';
import { Reducer } from '../Reducer';
import { controllerWatcherSymbol, watchersSymbol } from '../symbols';
import {
  Action, WatchedConstructor, DecoratedWatchedController,
} from '../types';
import { watch } from './watch';

test('', () => {
  type State = any;

  class MyStore {
    static update = 'My_update_store';
    static reducer = Reducer(new MyStore(), MyStore.update);
    users: string[] = [];
  }

  @watch
  class MyController extends ControllerBase<State> {
    updateStore(store: Partial<MyStore>) {
      this.dispatch(createAction(MyStore.update, store));
    }

    @watch
    loadUsers() {
    }

    @watch('openUserForEditing')
    openUser(action: Action<{ userID: string; }>) {
    }
  }

  expect((MyController as WatchedConstructor<MyController>)[watchersSymbol]).toEqual({
    My_loadUsers: 'loadUsers',
    My_openUserForEditing: 'openUser',
  });

  const watcher = (MyController as WatchedConstructor<MyController>)[controllerWatcherSymbol];
  expect(watcher).not.toBe(undefined);
  expect(watcher!.get('My_loadUsers')).toEqual('loadUsers');
  expect(watcher!.get('My_openUserForEditing')).toEqual('openUser');


  const myController: DecoratedWatchedController<[
    'loadUsers',
    ['openUserForEditing', { userID: string; }]
  ]> = MyController as any;

  // you can use it as `dispatch(myController.method1());`

  expect(myController.loadUsers().type).toBe('My_loadUsers');
  expect(myController.openUserForEditing({ userID: '123' }).type).toBe('My_openUserForEditing');
});
