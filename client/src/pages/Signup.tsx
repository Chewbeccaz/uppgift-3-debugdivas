import React, { useState, useEffect } from "react";
import axios from "axios";
import { SubscriptionLevels } from "../models/SubscriptionLevels";
import Modal from "../components/modal/Modal";
import PrivacyPolicy from "../components/modal/PrivacyPolicy";
import "../styles/modal.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscriptionId, setSubscriptionId] = useState(1);
  const [subscriptions, setSubscriptions] = useState<SubscriptionLevels[]>([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get<SubscriptionLevels[]>("/api/levels");
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      } else {
        setMessage("Något gick fel, vänligen försök igen.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setMessage("Något gick fel, vänligen försök igen.");
    }
  };

  const handleSubPayment = async () => {
    try {
      const response = await axios.post(
        "/api/stripe/create-subscription-session"
      );
      const { url } = response.data;
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  };

  

  return (
    <>
      <h1>Skapa konto</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </label>
        <br />
        <label>
          Prenumeration:
          <select
            name="subscription_id"
            value={subscriptionId}
            onChange={(e) => setSubscriptionId(Number(e.target.value))}>
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
          />
          Jag accepterar villkoren
        </label>
        <br />
        <button type="submit">Skapa konto</button>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PrivacyPolicy />
        </Modal>
        {message && <p>{message}</p>}
      </form>
      <button onClick={handleSubPayment}>Testknappen</button>
    </>
  );
};
