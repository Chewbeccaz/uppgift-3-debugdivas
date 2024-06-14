import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Blunder } from "../components/Blunder";
import { Ariel } from "../components/Ariel";
import { Triton } from "../components/Triton";
import axios from "axios";
import "../styles/SubLevel.css";
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";
import { NoAccess } from "./NoAccess";

export const SubLevel = () => {
  const { user } = useUser();
  const [subscriptionLevel, setSubscriptionLevel] = useState<number>(0);
  const [userStatus, setUserStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const BLUNDER_KEY = "price_1POE5gDwCLdIkrpmfxhpiEiF";
  // const ARIEL_KEY = "price_1POE61DwCLdIkrpmqtIuoO9v"
  // const TRITON_KEY = "price_1POE6KDwCLdIkrpmomK5l3YN"

  const BLUNDER_KEY = import.meta.env.VITE_BLUNDER_KEY;
  const ARIEL_KEY = import.meta.env.VITE_ARIEL_KEY;
  const TRITON_KEY = import.meta.env.VITE_TRITON_KEY;

  console.log(BLUNDER_KEY, ARIEL_KEY, TRITON_KEY);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(
            `/api/users/subscriptiondata/${user.userId}`
          );
          setSubscriptionLevel(response.data.subscriptionId);
          setUserStatus(response.data.status);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpgrade = async (newPriceId: string) => {
    if (!user) return;
    console.log(newPriceId);
    setLoading(true);
    try {
      const response = await axios.post("/api/stripe/upgrade-subscription", {
        userId: user.userId,
        newPriceId: newPriceId,
      });

      console.log(response.data);

      navigate("/mypage", { state: { showModal: true } });
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUpgradeButton = (targetLevel: number, priceId: string) => {
    if (userStatus === "active" && subscriptionLevel < targetLevel) {
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

  const isAccessible = (requiredLevel: number) => {
    return userStatus === "active" && subscriptionLevel >= requiredLevel;
  };

  return (
    <div className="container">
      {userStatus !== "active" ? (
        <NoAccess />
      ) : (
        <>
          <div
            className={`newsletter blunder-content`}
            data-access={isAccessible(2) ? "accessible" : "restricted"}>
            <Blunder />
          </div>
          {getUpgradeButton(2, BLUNDER_KEY as string)}

          <div
            className={`newsletter ariel-content`}
            data-access={isAccessible(3) ? "accessible" : "restricted"}>
            <Ariel />
          </div>
          {getUpgradeButton(3, ARIEL_KEY as string)}

          <div
            className={`newsletter triton-content`}
            data-access={isAccessible(4) ? "accessible" : "restricted"}>
            <Triton />
          </div>
          {getUpgradeButton(4, TRITON_KEY as string)}
        </>
      )}
    </div>
  );
};
