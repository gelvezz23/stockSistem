/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import { Footer, Navbar } from ".";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "3rem", height: "100vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
