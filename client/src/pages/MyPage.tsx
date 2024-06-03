import axios from 'axios';
import { useEffect, useState } from 'react';

export const MyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/users/check-session');
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []);

  return (
    <div>
      {isLoggedIn ? <p>Du är inloggad</p> : <p>Du är inte inloggad</p>}
    </div>
  );
};

