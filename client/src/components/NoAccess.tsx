//  interface NoAccessProps {
//      handleUpgrade: (newPriceId: string) => Promise<void>;
//      priceId: string;
//      loading: boolean;
//    }

export const NoAccess = () => {
  return (
    <div className="restricted-content">
      <div className="overlay">
        <p>
          Du har inte tillgång till prenumerationsinnehållet. Vänligen starta en
          ny eller återuppta din gamla prenumeration.
        </p>
        {/* <Payment /> */}
      </div>
    </div>
  );
};

// import { useState } from "react";
// import { useUser } from "../context/UserContext";
// import axios from "axios";
// // import "../styles/NoAccess.css";

// export const NoAccess = () => {
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);

//   const handleRenewSubscription = async () => {
//     if (!user) return;

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "/api/stripe/create-billing-portal-session",
//         {
//           userId: user.userId,
//         }
//       );

//       window.location.href = response.data.url;
//     } catch (error) {
//       console.error("Error creating billing portal session:", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="no-access">
//       <h2>Ingen åtkomst</h2>
//       <p>
//         Du har för närvarande inte åtkomst till detta innehåll. Vänligen
//         återuppta din prenumeration för att få åtkomst.
//       </p>
//       <button onClick={handleRenewSubscription} disabled={loading}>
//         {loading ? "Laddar..." : "Återuppta prenumeration"}
//       </button>
//     </div>
//   );
// };
