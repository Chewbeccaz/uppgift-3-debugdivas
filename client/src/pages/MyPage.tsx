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
        const response = await axios.delete('/api/users/cancel-subscription');
  
        if (response.status === 200) {
          setMessage('Subscription canceled successfully.');
        } else {
          setMessage('Failed to cancel subscription.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  //Just nu gör inte endpointen så mycket, då det är osäkert hur vi ska göra med databasen och stripe/webhook. Detta är bara en start 

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