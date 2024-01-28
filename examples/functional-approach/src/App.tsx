import { faker } from '@faker-js/faker';
import { Provider, useDispatch } from 'react-redux';
import { addUser } from './redux/addUser.ts';
import { store } from './redux/store.ts';
import { useAppSelector } from './redux/useAppSelector.ts';

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
          dispatch(addUser({ name: faker.person.fullName() }));
        }}
      >
        add user
      </button>
    </div>
  );
};
