import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { chainActions } from 'redux-controller-middleware';
import { configureReduxStore, State } from './configureReduxStore.js';
import { UserController } from './redux/User.controller.js';

describe('chained actions', () => {
  // you get it from API / url params / localStorage / etc...
  const userId = 2;

  const UserProfile = () => {
    const dispatch = useDispatch();
    const { usersAreLoading, openedUser } = (useSelector as TypedUseSelectorHook<State>)((state) => state.users);

    useEffect(() => {
      dispatch(
        chainActions(
          //
          UserController.loadUsers(),
          UserController.openUserById({ userId })
        )
      );
    }, []);

    if (usersAreLoading) {
      return <p>Loading...</p>;
    }

    if (!openedUser) {
      return <p>User not found</p>;
    }

    return <p>{openedUser.name}</p>;
  };

  test('if each action is dispatched and executed', async () => {
    const store = configureReduxStore();

    const App = () => {
      return (
        <Provider store={store}>
          <UserProfile />
        </Provider>
      );
    };

    const { getByText } = render(<App />);

    await waitFor(() => getByText('Elizabeth'));

    const element = getByText('Elizabeth');
    expect(element).toBeInTheDocument();
  });
});
