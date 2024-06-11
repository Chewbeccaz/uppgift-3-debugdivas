import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";

export const Upgrade = () => {
  const { user } = useUser();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const upgradeSubscription = async () => {
      try {
        const response = await axios.post("/api/stripe/upgrade-subscription", {
          userId: user?.userId,
          newPriceId: "NEW_PRICE_ID" // Ersätt med den nya pris-ID du vill uppgradera till
        });
        setSessionId(response.data.updatedSubscription.id);
      } catch (error) {
        console.error("Failed to upgrade subscription:", error);
      }
    };

    if (user) {
      upgradeSubscription();
    }
  }, [user]);

  return (
    <div className="container">
      <div className="upgrade-content">
        <h1>Uppgradera ditt konto</h1>
        <p>Uppgradera ditt konto för att få tillgång till fler funktioner.</p>
        <a href={sessionId || "/"}>Uppgradera</a>
      </div>
    </div>
  );
};
