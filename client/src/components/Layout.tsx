import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main style={{height: "auto"}}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
