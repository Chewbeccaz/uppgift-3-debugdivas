// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { SubscriptionLevels } from "../models/SubscriptionLevels";
// import { useUser } from "../context/UserContext";

// //DEN HÄR KOMPONENTEN ÅTERAKTIVERAR BARA DET GAMLA SUBSCIPTION SOM VI HADE TIDIGARE? Select spelar ingen roll?
// //RENDERAD EJ UT JUST NU, MEN VI VILL P SIKT LÄGGA IN SELECT OCH PAYMENT FRÅN SIGNUP HIT?

// const Payment = () => {
//   const [subscriptionId, setSubscriptionId] = useState(1);
//   const [subscriptions, setSubscriptions] = useState<SubscriptionLevels[]>([]);
//   const { user } = useUser();
//   const [userId, setUserId] = useState<number | null>(null);

//   useEffect(() => {
//     if (user) {
//       setUserId(Number(user.userId));
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchSubscriptions = async () => {
//       try {
//         const response = await axios.get<SubscriptionLevels[]>("/api/levels");
//         setSubscriptions(response.data);
//       } catch (error) {
//         console.error("Error fetching subscriptions:", error);
//       }
//     };

//     fetchSubscriptions();
//   }, []);

//   const handlePurchase = async () => {
//     if (user === null) {
//       alert("skapa ett konto först");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         "/api/stripe/create-subscription-session",
//         {
//           userId: userId,
//         }
//       );
//       const { url, session } = response.data;
//       localStorage.setItem("user_id", JSON.stringify(userId));
//       window.location.href = url;
//       console.log(session);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   //   return (
//   //     <>
//   //       <h2>Välj Prenumeration</h2>
//   //       <select
//   //         value={subscriptionId}
//   //         onChange={(e) => setSubscriptionId(Number(e.target.value))}>
//   //         {subscriptions
//   //           .filter((subscription) => parseInt(subscription._id.toString()) > 1)
//   //           .map((subscription) => (
//   //             <option key={subscription._id} value={subscription._id}>
//   //               {subscription.name}
//   //             </option>
//   //           ))}
//   //       </select>
//   //       <button onClick={handlePurchase}>Köp Prenumeration</button>
//   //     </>
//   //   );
//   // };
//   return (
//     <>
//       <h2>Välj Prenumeration</h2>
//       <select
//         value={subscriptionId}
//         onChange={(e) => setSubscriptionId(parseInt(e.target.value))}>
//         {subscriptions.map((subscription) => (
//           <option
//             key={subscription._id}
//             value={parseInt(subscription._id.toString())}>
//             {subscription.name}
//           </option>
//         ))}
//       </select>
//       <button onClick={handlePurchase}>Köp Prenumeration</button>
//     </>
//   );
// };

// export default Payment;


import React, { useState } from 'react';
import axios from 'axios'; 
import { useUser } from "../context/UserContext";

const Payment = () => {
  const [invoiceUrl, setInvoiceUrl] = useState<string>(''); // State to store the invoice URL
  const { user } = useUser();


  const handleButtonClick = async () => {
    try {
      console.log("knappen halllåå");
      const userId = user?.userId;
      const response = await axios.get(`/api/stripe/generate-invoice-link?userId=${userId}`);
      setInvoiceUrl(response.data.invoiceUrl); 
    } catch (error) {
      console.error('Failed to generate invoice link:', error);
    }
  };

  return (
    <button onClick={handleButtonClick}>
      Betala förnyelse
    </button>
  );
};

export default Payment;
