import { methodNamesTemporaryBox } from '../constants';
import { reducer } from './reducer';

describe('[function] reducer', () => {
  beforeEach(() => {
    methodNamesTemporaryBox.splice(0, methodNamesTemporaryBox.length);
  });

  test('one handler', () => {
    class Test {
      @reducer
      action1() {}
    }

    expect(methodNamesTemporaryBox).toEqual(['action1']);
  });

  test('many handlers', () => {
    class Test {
      @reducer
      action1() {}
      @reducer
      action2() {}
      @reducer
      action3() {}
    }

    expect(methodNamesTemporaryBox).toEqual(['action1', 'action2', 'action3']);
  });
});
