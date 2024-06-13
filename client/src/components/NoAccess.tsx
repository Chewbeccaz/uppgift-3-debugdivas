import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Payment from "./Payment";
import axios from "axios";

export const NoAccess = () => {
  const { user } = useUser();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus(user.userId);
    }
  }, [user]);

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/subscriptiondata/${userId}`);
      setSubscriptionStatus(response.data.status);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    }
  };

  return (
    <div className="restricted-content">
      <div className="overlay">
        {subscriptionStatus === "expired" ? (
          <>
            <h2>Din prenumeration har tyvärr löpt ut.</h2>
            <p>
              <br></br>Vänligen kontakta kundtjänst
              <br></br>Email: info@havsnyheter.se
              <br></br>Telefon: 123-456-789
            </p>
          </>
        ) : (
          <>
            <p>
              Du har inte tillgång till prenumerationsinnehållet. Vänligen
              starta en ny eller återuppta din gamla prenumeration.
            </p>
            <Payment />
          </>
        )}
      </div>
    </div>
  );
};
