/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import { Footer, Navbar } from ".";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
