import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Blunder } from "../components/Blunder";
import { Ariel } from "../components/Ariel";
import { Triton } from "../components/Triton";
import axios from "axios";
import "../styles/SubLevel.css";
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";



// import dotenv from "dotenv";
// dotenv.config();
// const { BLUNDER_KEY, ARIEL_KEY, TRITION_KEY } = process.env;
//Be mattias hjälpa oss med att använda variablerna i klienten.

export const SubLevel = () => {
  const { user } = useUser();
  const [subscriptionLevel, setSubscriptionLevel] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Detta är Nurs hårdkodade keys.
  const BLUNDER_KEY = "price_1POE5gDwCLdIkrpmfxhpiEiF";
  const ARIEL_KEY = "price_1POE61DwCLdIkrpmqtIuoO9v";
  const TRITION_KEY = "price_1POE6KDwCLdIkrpmomK5l3YN";

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

      console.log(response.data);

      navigate('/mypage', { state: { showModal: true } });
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
      {getUpgradeButton(subscriptionLevel, 2, BLUNDER_KEY as string)}
      <div
        className="newsletter ariel-content"
        data-access={
          subscriptionLevel && subscriptionLevel >= 3
            ? "accessible"
            : "restricted"
        }>
        <Ariel />
      </div>
      {getUpgradeButton(subscriptionLevel, 3, ARIEL_KEY as string)}
      <div
        className="newsletter triton-content"
        data-access={
          subscriptionLevel && subscriptionLevel >= 4
            ? "accessible"
            : "restricted"
        }>
        <Triton />
      </div>
      {getUpgradeButton(subscriptionLevel, 4, TRITION_KEY as string)}
    </div>
  );
};
