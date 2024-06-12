// import { useEffect, useState } from "react";
// import { useUser } from "../context/UserContext";
// import { Blunder } from "../components/Blunder";
// import { Ariel } from "../components/Ariel";
// import { Triton } from "../components/Triton";
// import axios from "axios";
// import "../styles/SubLevel.css";

// export const SubLevel = () => {
//   const { user } = useUser();
//   const [subscriptionLevel, setSubscriptionLevel] = useState<number>(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchSubscriptionLevel = async () => {
//       if (user && user.userId) {
//         try {
//           const response = await axios.get(
//             `/api/users/subscription/${user.userId}`
//           );
//           setSubscriptionLevel(response.data.subscriptionId);
//         } catch (error) {
//           console.error("Failed to fetch subscription level:", error);
//         }
//       }
//     };

//     fetchSubscriptionLevel();
//   }, [user]);

//   const handleUpgrade = async (newPriceId: string) => {
//     if (!user) return;

//     setLoading(true);
//     try {
//       const response = await axios.post("/api/stripe/upgrade-subscription", {
//         userId: user.userId,
//         newPriceId: newPriceId,
//       });
//       const { url } = response.data;
//       window.location.href = url;
//     } catch (error) {
//       console.error("Failed to upgrade subscription:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUpgradeButton = (
//     currentLevel: number,
//     targetLevel: number,
//     priceId: string
//   ) => {
//     if (subscriptionLevel && subscriptionLevel < targetLevel) {
//       return (
//         <div className="upgrade-button" style={{ marginTop: "10px" }}>
//           <button onClick={() => handleUpgrade(priceId)} disabled={loading}>
//             {loading ? "Uppgraderar..." : "Uppgradera"}
//           </button>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="container">
//       <div
//         className="newsletter blunder-content"
//         data-access={
//           subscriptionLevel && subscriptionLevel >= 2
//             ? "accessible"
//             : "restricted"
//         }>
//         <Blunder />
//       </div>
//       {getUpgradeButton(subscriptionLevel, 2, "BLUNDER_KEY")}
//       <div
//         className="newsletter ariel-content"
//         data-access={
//           subscriptionLevel && subscriptionLevel >= 3
//             ? "accessible"
//             : "restricted"
//         }>
//         <Ariel />
//       </div>
//       {getUpgradeButton(subscriptionLevel, 3, "ARIEL_KEY")}
//       <div
//         className="newsletter triton-content"
//         data-access={
//           subscriptionLevel && subscriptionLevel >= 4
//             ? "accessible"
//             : "restricted"
//         }>
//         <Triton />
//       </div>
//       {getUpgradeButton(subscriptionLevel, 4, "TRITON_KEY")}
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Blunder } from "../components/Blunder";
import { Ariel } from "../components/Ariel";
import { Triton } from "../components/Triton";
import axios from "axios";
import "../styles/SubLevel.css";
// import dotenv from "dotenv";
// dotenv.config();
// const { BLUNDER_KEY, ARIEL_KEY, TRITION_KEY } = process.env;

export const SubLevel = () => {
  const { user } = useUser();
  const [subscriptionLevel, setSubscriptionLevel] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const BLUNDER_KEY = "price_1PNte3EQeiyPz5MJKIAlfqWh";
  const ARIEL_KEY = "price_1PNtekEQeiyPz5MJtGGNkdoV";
  const TRITION_KEY = "price_1PNtfTEQeiyPz5MJaGGUuLNu";

  useEffect(() => {
    const fetchSubscriptionLevel = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(
            `/api/users/subscription/${user.userId}`
          );
          setSubscriptionLevel(response.data.subscriptionId);
        } catch (error) {
          console.error("Failed to fetch subscription level:", error);
        }
      }
    };

    fetchSubscriptionLevel();
  }, [user]);

  const handleUpgrade = async (newPriceId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/stripe/upgrade-subscription", {
        userId: user.userId,
        newPriceId: newPriceId,
      });
      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUpgradeButton = (
    currentLevel: number,
    targetLevel: number,
    priceId: string
  ) => {
    if (subscriptionLevel && subscriptionLevel < targetLevel) {
      return (
        <div className="upgrade-button" style={{ marginTop: "10px" }}>
          <button onClick={() => handleUpgrade(priceId)} disabled={loading}>
            {loading ? "Uppgraderar..." : "Uppgradera"}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <div
        className="newsletter blunder-content"
        data-access={
          subscriptionLevel && subscriptionLevel >= 2
            ? "accessible"
            : "restricted"
        }>
        <Blunder />
      </div>
      {getUpgradeButton(subscriptionLevel, 2, BLUNDER_KEY)}
      <div
        className="newsletter ariel-content"
        data-access={
          subscriptionLevel && subscriptionLevel >= 3
            ? "accessible"
            : "restricted"
        }>
        <Ariel />
      </div>
      {getUpgradeButton(subscriptionLevel, 3, ARIEL_KEY)}
      <div
        className="newsletter triton-content"
        data-access={
          subscriptionLevel && subscriptionLevel >= 4
            ? "accessible"
            : "restricted"
        }>
        <Triton />
      </div>
      {getUpgradeButton(subscriptionLevel, 4, TRITION_KEY)}
    </div>
  );
};
