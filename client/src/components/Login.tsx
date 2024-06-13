import { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/login.css";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUser();
 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error) && error.response) {

        const errorMessageFromServer = error.response.data.message || "An error occurred";
        setErrorMessage(errorMessageFromServer);
      } else {

        setErrorMessage("Fel användarnamn eller lösenord.");
      }
      console.log(errorMessage);
    }
    setEmail("");
    setPassword("");
  };
 
  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Lösenord:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Logga in</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};