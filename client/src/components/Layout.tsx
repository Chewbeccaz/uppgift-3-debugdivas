import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>{/* <Footer/>  */}</footer>
    </>
  );
};
