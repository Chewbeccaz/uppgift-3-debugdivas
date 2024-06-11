import { useState } from 'react';
import { Login } from '../components/Login';
import { useUser } from '../context/UserContext';
import axios from 'axios';

export const MyPage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');

  const cancelSubscription = async () => {
    if (user) {
      try {
        const response = await axios.delete('api/stripe/cancel-subscription', {
          data: { userId: user.userId }
        });
        console.log('Response from cancel-subscription:', response);
        if (response.status === 200) {
          setMessage('Prenumerationen är avslutad.');
        } else {
          setMessage('Kunde inte avsluta prenumerationen, forsök igen.');
        }
      } catch (error) {
        setMessage('Ett fel uppstod, försök igen');
      }
    }
  };

  return (
    <div>
      {user ? (
        <>
        <button onClick={cancelSubscription}>Cancel Subscription</button>
          {message && <p>{message}</p>}
        </>
      ) : (
        <Login />
    )}
    </div>
  );
};