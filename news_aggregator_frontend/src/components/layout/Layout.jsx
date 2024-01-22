import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-grow px-16 py-5">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
