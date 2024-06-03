import { Login } from '../components/Login';
import { useUser } from '../context/UserContext';

export const MyPage = () => {
  const { user } = useUser();



  return (
    <div>
      {user ? (
        <p>Logged in as: {user.userId}</p>
      ) : (
        <Login />
    )}
    </div>
  );
};
