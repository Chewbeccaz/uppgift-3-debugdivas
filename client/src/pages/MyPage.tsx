import { useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import "../styles/mypage.css";
import { useLocation } from 'react-router-dom'
import ModalConfirm from '../components/modal/ModalConfirm';
import UpgradeConfirm from "../components/modal/UpgradeConfirm";
import "../styles/modal.css";
import { SubExpired } from '../components/SubExpired';

interface SubscriptionInfo {
  subscriptionLevel: string;
  lastPaymentDate: number;
  nextPaymentDate: number;
  status: string;
}

export const MyPage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = location.state?.showModal || false;
  
  useEffect(() => {
    if (showModal) {
      setIsModalOpen(true);
    }
  }, [showModal]);

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
        const response = await axios.delete('/api/stripe/cancel-subscription', {
          data: { userId: user.userId }
        });
        console.log('Response from cancel-subscription:', response);
        if (response.status === 200) {
          setMessage('Prenumerationen kommer att avslutas vid periodens slut.');
          setSubscriptionInfo((prevInfo) => prevInfo ? { ...prevInfo, status: 'canceled_at_period_end' } : null);
        } else {
          setMessage('Kunde inte avsluta prenumerationen, försök igen.');
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
                {subscriptionInfo.status === 'expired' ? (
                  <SubExpired /> 
                ) : (
                  <div>
                    <h4>Prenumerationsnivå: <br />{subscriptionInfo.subscriptionLevel}</h4>
                    <p>Senaste betalning: {new Date(subscriptionInfo.lastPaymentDate * 1000).toLocaleDateString()}</p>
                    <p>Nästa betalning: {new Date(subscriptionInfo.nextPaymentDate * 1000).toLocaleDateString()}</p>
                    {subscriptionInfo.status === 'canceled_at_period_end' && (
                      <p>Prenumerationen kommer att avslutas vid periodens slut.</p>
                    )}
                    {message && <p>{message}</p>}
<br />
                    {subscriptionInfo.status !== 'canceled_at_period_end' && (
                    
                      <button className="cancel-btn" onClick={cancelSubscription}>Avsluta prenumeration</button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>Hämtar prenumerationsinformation</p>
                <div className="loader-mypage"></div>
              </div>
            )}
            {isModalOpen && (
              <ModalConfirm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                <UpgradeConfirm />
              </ModalConfirm>
            )}
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
};