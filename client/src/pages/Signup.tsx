import React, { useState, useEffect } from "react";
import axios from "axios";
import { SubscriptionLevels } from "../models/SubscriptionLevels";
import Modal from "../components/modal/Modal";
import PrivacyPolicy from "../components/modal/PrivacyPolicy";
import "../styles/signup.css";


export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [subscriptionId, setSubscriptionId] = useState(1);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionLevels[]>([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get<SubscriptionLevels[]>("/api/levels");
        const fetchedSubscriptions = response.data;
        setSubscriptions(fetchedSubscriptions);

        if (fetchedSubscriptions.length > 0) {
          setSubscriptionId(fetchedSubscriptions[0]._id); 
        }
        console.log("Fetched subscriptions:", fetchedSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accountCreated) {
      alert("Kontot har redan skapats. Gå vidare till betalning.");
      return;
    }

    if (!isChecked) {
      alert("Du måste acceptera villkoren för att skapa ett konto.");
      return;
    }

    try {
      const response = await axios.post("/api/users/create-user", {
        email,
        password,
        subscription_id: subscriptionId,
      });

      if (response.status === 201) {
        setMessage("Konto skapat!");

        const userId = response.data.userId;
        setUserId(userId);
        setAccountCreated(true);
      } else {
        setMessage("Något gick fel, vänligen försök igen.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setMessage("Något gick fel, vänligen försök igen.");
    }
  };

  const handleSubPayment = async () => {
    if (userId === null) {
      alert("skapa ett konto först");
      return;
    }

    // console.log(import.meta.env.VITE_BLUNDER_KEY);

    // const getPriceId = (subscriptionId: number): string => {
    //   switch (subscriptionId) {
    //     case 2:
    //       return import.meta.env.VITE_BLUNDER_KEY;
    //     case 3:
    //       return import.meta.env.VITE_ARIEL_KEY;
    //     case 4:
    //       return import.meta.env.VITE_TRITON_KEY;
    //     default:
    //       return "";
    //   }
    // };

    // const priceId = getPriceId(subscriptionId);
    // console.log(priceId);

    // if (!priceId) {
    //   alert("Ogiltigt prenumerations-ID.");
    //   return;
    // }

    try {
      const response = await axios.post(
        "/api/stripe/create-subscription-session",
        {
          userId: userId,
          subscriptionId: subscriptionId
        }
      );
      const { url, session } = response.data;
      localStorage.setItem("user_id", JSON.stringify(userId));
      window.location.href = url;
      console.log(session);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={accountCreated}
              />
            </label>
            <br />
            <label>
              Lösenord:
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={accountCreated}
              />
            </label>
          </div>
          <br />
          <label>
            Prenumeration:
            <select
              name="subscription_id"
              value={subscriptionId ?? ""}
              onChange={(e) => setSubscriptionId(Number(e.target.value))}
              disabled={accountCreated}
            >
              {subscriptions.map((subscription) => (
                <option key={subscription._id} value={subscription._id}>
                  {subscription.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={accountCreated}
            />
            Jag accepterar villkoren
          </label>
          <br />
          {message && <p>{message}</p>}
          {!accountCreated ? (
            <button type="submit">Skapa konto</button>
          ) : (
            <button type="button" onClick={handleSubPayment}>
              Gå vidare till betalning
            </button>
          )}
          <p id="modaltext">
            <br />
            Genom att klicka på 'Skapa konto' godkänner du lagring av dina
            personuppgifter.
            <br />
            Du kan läsa mer genom att klicka{" "}
            <a id="modalknapp" onClick={() => setIsModalOpen(true)}>
              här
            </a>
            .
          </p>
        </form>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PrivacyPolicy />
        </Modal>
      </div>
    </div>
  );
};
