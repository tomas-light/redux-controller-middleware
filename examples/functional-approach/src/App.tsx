import { useState } from 'react';
import { useDispatch, Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { addUser } from './redux/addUser.ts';
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
  const [userNumber, setUserNumber] = useState(0);

  return (
    <div>
      <div>
        {usersList.map((user) => (
          <p key={user.userId}>{user.userName}</p>
        ))}
      </div>

      <button
        onClick={() => {
          setUserNumber((prev) => prev + 1);
          dispatch(addUser({ name: `new-user-${userNumber + 1}` }));
        }}
      >
        add user
      </button>
    </div>
  );
};
