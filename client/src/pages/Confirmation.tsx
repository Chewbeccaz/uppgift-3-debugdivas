// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";

// export const Confirmation = () => {
//   const [message, setMessage] = useState("Verifying payment...");
//   const location = useLocation();

//   const handleVerifySession = async (sessionId: string) => {
//     try {
//       const response = await axios.get(
//         `/api/stripe/verify-subscription-session?sessionId=${sessionId}`
//       );
//       const { verified } = response.data;
//       if (verified) {
//         setMessage("Payment confirmed! Thank you for your purchase.");
//       } else {
//         setMessage("Payment verification failed. Please contact support.");
//       }
//     } catch (error) {
//       console.error("Error verifying subscription session:", error);
//       setMessage(
//         "An error occurred during payment verification. Please try again later."
//       );
//     }
//   };

//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const sessionId = query.get("session_id");
//     if (sessionId) {
//       handleVerifySession(sessionId);
//     } else {
//       setMessage("No session ID found. Please try again.");
//     }
//   }, [location]);

//   return (
//     <>
//       <h2>Confirmation page 🎉</h2>
//     </>
//   );
// };
import { useEffect, useState } from "react";
import axios from "axios";

interface LineItem {
  description: string;
  amount_total: number;
  currency: string;
}

export const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    const verifySession = async () => {
      const lsUserId = localStorage.getItem("user_id");

      if (!lsUserId) {
        setMessage("Ingen användar-ID hittades.");
        return;
      }

      try {
        const userId = JSON.parse(lsUserId);

        const response = await axios.get(
          "/api/stripe/verify-subscription-session",
          {
            params: { userId },
          }
        );

        const session = response.data.session;
        console.log("Verified session:", session);

        if (response.data.verified) {
          setVerified(true);
          setLineItems(response.data.lineItems);
          setMessage("Betalningen är bekräftad!");
        } else {
          setMessage("Betalningen kunde inte verifieras.");
        }
      } catch (error) {
        console.error("Error verifying subscription session:", error);
        setMessage("Ett fel uppstod vid verifiering av betalningen.");
      }
    };

    verifySession();
  }, []);

  return (
    <div>
      <h1>Betalningsbekräftelse</h1>
      <p>{message}</p>
      {verified && (
        <div>
          <h2>Detaljer om betalning:</h2>
          <ul>
            {lineItems.map((item, index) => (
              <li key={index}>
                {item.description} - {item.amount_total / 100}{" "}
                {item.currency.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Confirmation;
