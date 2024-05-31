import { NavLink } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";

export const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Flytta till en services kanske om behov finns?
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("/api/users/check-session", {
          withCredentials: true,
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      try {
        await axios.post("/api/users/logout");
        setIsLoggedIn(false);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">
              <IoHomeOutline />
            </NavLink>
          </li>
          <li>
            <NavLink to="#" onClick={handleLoginLogout}>
              {isLoggedIn ? <CiLogout /> : <CiLogin />}
            </NavLink>
          </li>

          {/* BYT UT SIGNUP TILL my_pages */}
          {isLoggedIn ? (
            <li>
              <NavLink to="/signup">
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
