import { Provider, useDispatch } from 'react-redux';
import { fetchUsers } from './redux/fetchUsers.ts';
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
        {usersList.map((userName, index) => (
          <p key={index + userName}>{userName}</p>
        ))}
      </div>

      <button
        onClick={() => {
          dispatch(fetchUsers());
        }}
      >
        fetch users
      </button>
    </div>
  );
};
