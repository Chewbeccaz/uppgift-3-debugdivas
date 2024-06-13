import { NavLink } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Login } from "./Login";

export const Navigation = () => {
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log("Navigation re-rendered, user:", user);
    if (user) {
      setShowDropdown(false);
    }
  }, [user]);

  const handleLoginLogout = async () => {
    if (user) {
      try {
        await logout();
      } catch {
        console.error("Logout failed:", Error);
      }
    } else {
      // window.location.href = "/login";
      // setShowDropdown(!showDropdown);
      setShowDropdown((prev) => !prev);
    }
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <li>
            <NavLink to="/">
              <IoHomeOutline />
            </NavLink>
          </li>
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
        </div>
        <div className="nav-right">
          <li>
            <NavLink to="#" onClick={handleLoginLogout}>
              {user ? <CiLogout /> : <CiLogin />}
            </NavLink>
          </li>
          {showDropdown && !user && (
            <div className="dropdown-menu">
              <Login />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
