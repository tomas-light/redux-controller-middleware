import { faker } from '@faker-js/faker';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store.ts';
import { useAppSelector } from './redux/useAppSelector.ts';
import { UsersController } from './redux/UsersController.ts';

export default function App() {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  );
}

const Page = () => {
  const dispatch = useDispatch();

  const { usersList } = useAppSelector((state) => state.users);

  return (
    <div>
      <div>
        {usersList.map((user) => (
          <p key={user.userId}>{user.userName}</p>
        ))}
      </div>

      <button
        onClick={() => {
          dispatch(UsersController.addUser({ name: faker.person.fullName() }));
        }}
      >
        add user
      </button>
    </div>
  );
};
