import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Blunder } from "../components/Blunder";
import { Ariel } from "../components/Ariel";
import { Triton } from "../components/Triton";
import axios from "axios";
import "../styles/SubLevel.css";

export const SubLevel = () => {
  const { user } = useUser();
  const [subscriptionLevel, setSubscriptionLevel] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubscriptionLevel = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/users/subscription/${user.userId}`);
          setSubscriptionLevel(response.data.subscriptionId);
        } catch (error) {
          console.error("Failed to fetch subscription level:", error);
        }
      }
    };

    fetchSubscriptionLevel();
  }, [user]);

  return (
    <div className="container">
      <div className="newsletter blunder-content" data-access={subscriptionLevel && subscriptionLevel >= 2 ? "accessible" : "restricted"}>
        <Blunder />
      </div>
      <div className="newsletter ariel-content" data-access={subscriptionLevel && subscriptionLevel >= 3 ? "accessible" : "restricted"}>
        <Ariel />
      </div>
      {subscriptionLevel && subscriptionLevel < 4 && (
        <div className="upgrade-button" style={{ marginTop: '50px' }}>
          <a href="/uppgradera">Uppgradera</a>
        </div>
      )}
      <div className="newsletter triton-content" data-access={subscriptionLevel && subscriptionLevel >= 4 ? "accessible" : "restricted"}>
        <Triton />
      </div>
    </div>
  );
};