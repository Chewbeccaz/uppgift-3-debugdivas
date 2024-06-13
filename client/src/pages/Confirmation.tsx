import { useEffect, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import '../styles/confirmation.css';
import { Link } from "react-router-dom";


interface LineItem {
  description: string;
  amount_total: number;
  currency: string;
}

export const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true); // State för att visa/dölja bekräftelse-rutan

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
          setShowConfetti(true); // Visa confetti när betalningen är bekräftad
          setTimeout(() => setShowConfetti(false), 3000); // Stoppa confetti efter 3 sekunder
        } else {
          setMessage("Betalningen kunde inte verifieras.");
        }
      } catch (error) {
        console.error("Error verifying subscription session:", error);
        setMessage("Ett fel uppstod vid verifiering av betalningen.");
      }
    };

    verifySession();

    // Update window dimensions
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {showConfirmation && (
        <div className={`confirmation-container ${verified ? 'verified' : 'error'}`}>
          <Link to="/login" className="buy"> <button className="close-button" onClick={handleCloseConfirmation}>Gå vidare</button></Link>
          
          {showConfetti && <Confetti width={windowWidth} height={windowHeight} />}
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
      )}
    </>
  );
};

export default Confirmation;
