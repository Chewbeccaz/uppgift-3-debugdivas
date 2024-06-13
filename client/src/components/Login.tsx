// import axios from "axios";
// import { useState } from "react";

// export const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/api/users/login", {
//         email: email,
//         password: password,
//       });
//       console.log("Login successful:", response.data);
//       setSessionId(response.data.sessionId);
//       setUserId(response.data.user._id);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }

//     setEmail("");
//     setPassword("");
//   };

//   return (
//     <>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <label>
//           Email:
//           <input
//             type="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input
//             type="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </label>
//         <br />
//         <button type="submit">Login</button>
//       </form>

//       {sessionId && <p>Session ID: {sessionId}</p>}
//       {sessionId && <p>ID: {userId}</p>}
//     </>
//   );
// };
import { useState } from "react";
import { useUser } from "../context/UserContext";
import '../styles/login.css';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <form onSubmit={handleLogin}>
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
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};