import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { Admin } from "./admin/Admin";
import { Login } from "./components/Login";
import { Signup } from "./pages/Signup";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
      },
      {
        path: "/admin",
        element: <Admin />,
        errorElement: <NotFound />,
      },
        {
          path: "/signup",
          element: <Signup />,
          errorElement: <NotFound />,
        },
        {
          path: "/login",
          element: <Login />,
          errorElement: <NotFound />,
        },
      ],
    },
   ]);
   
