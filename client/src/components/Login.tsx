import { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/login.css";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUser();
 
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await login(email, password);
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     setErrorMessage("Incorrect email or password.");
  //     console.log(errorMessage);
  //   }
  //   setEmail("");
  //   setPassword("");
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Kontrollera om svaret innehåller felinformation
        const errorMessageFromServer = error.response.data.message || "An error occurred";
        setErrorMessage(errorMessageFromServer);
      } else {
        // Generellt felhantering
        setErrorMessage("Incorrect email or password.");
      }
      console.log(errorMessage); // Observera att detta kommer att logga felmeddelandet innan det har uppdaterats
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
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};