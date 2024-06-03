// TODO: Lägg in interface på allt som behövs - ILoggedInUser? IUserContext.

import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ILoggedInUser {
  sessionId: string;
  userId: string;
}

export interface IUserContext {
  user: ILoggedInUser | undefined;
  setUser: (user: ILoggedInUser | undefined) => void;
  // register: (email: string, password: string) => Promise<void>;   TODO: LÄGG TILL DESSA SEN NÄR VI BEHÖVER.
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authorize: () => Promise<void>;
}

const initialValues = {
  user: undefined,
  setUser: () => {},
  // register: async () => {},
  login: async () => {},
  logout: async () => {},
  authorize: async () => {},
};

export const UserContext = createContext<IUserContext>(initialValues);
export const useUser = () => useContext(UserContext); //Hooken.

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ILoggedInUser | undefined>(undefined);

  //********************************** AUTHORIZE************************************//
  useEffect(() => {
    console.log("Authorization useEffect körs den?");
    authorize();
  }, []);

  const authorize = async () => {
    try {
      console.log("Försöker auktorisera");
      const response = await axios.get("/api/users/check-session", {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.isLoggedIn) {
        const { sessionId, user } = response.data;
        console.log("Response data i auth:", response.data);
        if (user && sessionId) {
          console.log("Kommer vi in i if-sats?");
          setUser({
            sessionId: sessionId,
            userId: user._id,
          });
          console.log("Authorization successful:", response.data);
        } else {
          console.error(
            "Authorization failed: Missing 'user' or 'sessionId' in response."
          );
          setUser(undefined);
        }
      } else {
        console.log("Authorization failed or user not logged in");
        setUser(undefined);
      }
    } catch (error) {
      console.error("Authorization failed:", error);
      setUser(undefined);
    }
  };

  // const authorize = async () => {
  //   try {
  //     const response = await axios.get("/api/users/check-session", {
  //       withCredentials: true,
  //     });

  //     if (response.status === 200 && response.data.isLoggedIn) {
  //       const { sessionId, user } = response.data;
  //       if (user && sessionId) {
  //         setUser({
  //           sessionId: sessionId,
  //           userId: user._id,
  //         });
  //         console.log("Authorization successful:", response.data);
  //       } else {
  //         console.error(
  //           "Authorization failed: Missing 'user' or 'sessionId' in response."
  //         );
  //         setUser(undefined);
  //       }
  //     } else {
  //       console.log("Authorization failed or user not logged in");
  //       setUser(undefined);
  //     }
  //   } catch (error) {
  //     console.error("Authorization failed:", error);
  //     setUser(undefined);
  //   }
  // };

  //TODO ***************** LÄGG TILL REGISTRERINGSFUNKTIONEN HÄR*****************//

  //TODO ***************** LÄGG TILL LOGIN IN FUNKTION HÄR*****************//
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Login successful, setting user:", response.data);
        const { sessionId, user } = response.data;
        console.log(user);
        if (user && sessionId) {
          setUser({
            sessionId: sessionId,
            userId: user._id,
          });
        }
      } else {
        console.error("Login response missing user._id:", response.data);
        setUser(undefined);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setUser(undefined);
    }
  };

  //TODO ***************** LÄGG TILL LOGOUT  HÄR*****************//
  const logout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      setUser(undefined);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // useEffect(() => {
  //   authorize();
  // }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authorize, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
