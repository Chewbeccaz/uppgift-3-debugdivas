import { useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import "../styles/mypage.css";


interface SubscriptionInfo {
  subscriptionLevel: string;
  lastPaymentDate: number;
  nextPaymentDate: number;
}
export const MyPage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  

  useEffect(() => {
    if (user) {
      const fetchSubscriptionInfo = async () => {
        try {
          const response = await axios.get('/api/stripe/subscription-info', {
            params: { userId: user.userId },
          });
          setSubscriptionInfo(response.data);
        } catch (error) {
          console.error('Error fetching subscription info:', error);
        }
      };

      fetchSubscriptionInfo();
    }
  }, [user]);

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
    <div className="container-mypage"> 
    <div className="box-mypage">
      {user ? (
        <>
        {subscriptionInfo ? ( 
            <div>
              <h4>Prenumerationsnivå: {subscriptionInfo.subscriptionLevel}</h4>             
              <p>Senaste betalning: {new Date(subscriptionInfo.lastPaymentDate * 1000).toLocaleDateString()}</p>
              <p>Nästa betalning: {new Date(subscriptionInfo.nextPaymentDate * 1000).toLocaleDateString()}</p>
              {message && <p>{message}</p>}
              <button>Uppgradera??</button>
              <button className="cancel-btn" onClick={cancelSubscription}>Cancel Subscription</button>
            </div>
           ) : (
            <div>
              <p>Hämtar prenumerationsinformation</p>
              <div className="loader-mypage"></div>
            </div>
          )}
        </>
      ) : (
        <Login />
      )}
    </div>
</div>
  ) }