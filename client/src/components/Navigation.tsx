import { NavLink, useNavigate } from "react-router-dom";
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
  // const navigate = useNavigate();

  useEffect(() => {
    console.log("Navigation re-rendered, user:", user);
  }, [user]);

  const handleLoginLogout = async () => {
    if (user) {
      try {
        await logout();
        // navigate("/");
      } catch {
        console.error("Logout failed:", Error);
      }
    } else {
      window.location.href = "/login"; //Byt till Home, eller MyPages sen.
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
        </div>
      </div>
    </nav>
  );
};
