// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

export const Confirmation = () => {
  // const [message, setMessage] = useState('Verifying payment...');
  // const location = useLocation();

  // const handleVerifySession = async (sessionId: string) => {
  //   try {
  //     const response = await axios.get(`/api/stripe/verify-subscription-session?sessionId=${sessionId}`);
  //     const { verified } = response.data;
  //     if (verified) {
  //       setMessage('Payment confirmed! Thank you for your purchase.');
  //     } else {
  //       setMessage('Payment verification failed. Please contact support.');
  //     }
  //   } catch (error) {
  //     console.error("Error verifying subscription session:", error);
  //     setMessage('An error occurred during payment verification. Please try again later.');
  //   }
  // };

  // useEffect(() => {
  //   const query = new URLSearchParams(location.search);
  //   const sessionId = query.get('session_id');
  //   if (sessionId) {
  //     handleVerifySession(sessionId);
  //   } else {
  //     setMessage('No session ID found. Please try again.');
  //   }
  // }, [location]);

  return (
    <>
      <h2>Confirmation page 🎉</h2>
      
    </>
  );
};


//Kolla från checkout. 