import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store.ts';
import { useAppSelector } from './redux/useAppSelector.ts';
import { UsersController } from './redux/Users.controller.ts';

export default function App() {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  );
}

const Page = () => {
  const dispatch = useDispatch();
  const { usersList, usersAreLoading } = useAppSelector((state) => state.users);

  return (
    <div>
      {usersAreLoading && <h3>Loading...</h3>}

      <div>
        {usersList.map((userName, index) => (
          <p key={index + userName}>{userName}</p>
        ))}
      </div>

      <button
        onClick={async () => {
          dispatch(UsersController.fetchUsers());
        }}
      >
        fetch users
      </button>
    </div>
  );
};
