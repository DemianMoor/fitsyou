import { Outlet, useLocation } from "react-router";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const DARK_NAV_PATHS = ["/plan"];
const NO_FOOTER_PATHS = ["/plan"];

export function Root() {
  const { pathname } = useLocation();

  const isDark = DARK_NAV_PATHS.includes(pathname);
  const showFooter = !NO_FOOTER_PATHS.includes(pathname);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Archivo, sans-serif", overflowX: "hidden" }}>
      <Nav dark={isDark} />
      <main>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
