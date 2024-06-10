import { NavLink } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

export const Navigation = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, logout } = useUser();

  useEffect(() => {
    console.log("Navigation re-rendered, user:", user);
  }, [user]);

  const handleLoginLogout = async () => {
    if (user) {
      try {
        await logout();
      } catch {
        console.error("Logout failed:", Error);
      }
    } else {
      window.location.href = "/login"; //Byt till Home, eller MyPages sen.
    }
  };

  //Flytta till en services kanske om behov finns?
  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const response = await axios.get("/api/users/check-session", {
  //         withCredentials: true,
  //       });
  //       setIsLoggedIn(response.data.isLoggedIn);
  //     } catch (error) {
  //       console.error("Session check failed:", error);
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkSession();
  // }, []);

  // const handleLoginLogout = async () => {
  //   if (isLoggedIn) {
  //     try {
  //       await axios.post("/api/users/logout");
  //       setIsLoggedIn(false);
  //     } catch (error) {
  //       console.error("Logout failed:", error);
  //     }
  //   } else {
  //     window.location.href = "/login";
  //   }
  // };

  return (
    <>
      <nav>
        <ul>
          {user ? (
            <div style={{ color: "white" }}>Welcome, User {user.userId}</div>
          ) : (
            <div style={{ color: "white" }}>Please log in</div>
          )}
          <li>
            <NavLink to="/">
              <IoHomeOutline />
            </NavLink>
          </li>
          <li>
            <NavLink to="#" onClick={handleLoginLogout}>
              {user ? <CiLogout /> : <CiLogin />}
            </NavLink>
          </li>

          {/* BYT UT SIGNUP TILL my_pages */}
          {user ? (
            <li>
              <NavLink to="/mypage">
                <IoPerson />
              </NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/signup">
                <IoMdPersonAdd />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};
