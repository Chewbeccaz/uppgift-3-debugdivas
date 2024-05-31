import { NavLink } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";

export const Navigation = () => {
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
            <NavLink to="/login">
              <CiLogin />
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-account">
              <IoMdPersonAdd />
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};
