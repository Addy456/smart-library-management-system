import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/**
 * PublicLayout — marketing / auth / catalog shell.
 * Reuses existing Navbar (fixed) + Footer. A spacer below the fixed
 * navbar keeps content out of the blur.
 */
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-surface-900">
      <Navbar />
      <div className="h-16 lg:h-20 shrink-0" aria-hidden="true" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
