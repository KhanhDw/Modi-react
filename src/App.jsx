import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "@/guardRouter/PrivateRoute";
import LenisProvider, { useLenisToggle } from "./contexts/LenisContext";
import "./App.css";

import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Component con để theo dõi route thay đổi
function ScrollHandler() {
  const location = useLocation();
  const prevRef = useRef(location);
  const { lenis } = useLenisToggle() || {};

  useEffect(() => {
    const prev = prevRef.current;
    // so sánh pathname + search + hash để biết có gì khác không
    const prevFull = `${prev.pathname}${prev.search}${prev.hash}`;
    const currFull = `${location.pathname}${location.search}${location.hash}`;
    if (prevFull === currFull) return; // không đổi → không làm gì

    // Scroll chỉ khi path hoặc query thay đổi (không phải chỉ hash)
    if (prev.pathname !== location.pathname || prev.search !== location.search) {
      if (lenis?.instance) {
        lenis.instance.scrollTo(0, { immediate: true });
        lenis.instance.resize();
      } else if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }

    prevRef.current = location;
  }, [location, lenis]);

  return null;
}

function App() {

  useEffect(() => {
    const key = "site_visit"
    const now = Date.now()
    const expireTime = 30 * 60 * 1000 // 30 phút

    const lastVisit = localStorage.getItem(key)

    if (!lastVisit || now - lastVisit > expireTime) {
      // console.log("🔹 Người dùng vừa vào website, gửi log lên server")

      // Gửi request log (toàn site)
      fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/site/visit`, {
        method: "POST",
      }).catch((err) => console.error("Không log được site visit:", err))

      // Lưu lại timestamp
      localStorage.setItem(key, now)
    }
  }, [])


  return (
    <ThemeProvider>
      <LanguageProvider>
        <LenisProvider>
          <Router>
            <ScrollHandler />
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải...</div>}>
              <Routes>
                {publicRoutes.map((router, index) => {
                  const Page = router.component;
                  const Layout = router.layout || (({ children }) => <>{children}</>);
                  return (
                    <Route
                      key={index}
                      path={router.path}
                      element={
                        <Layout>
                          <Page />
                        </Layout>
                      }
                    >
                      {router.children &&
                        router.children.map((childRoute, childIndex) => (
                          <Route
                            key={"child" + childIndex}
                            path={childRoute.path}
                            element={<childRoute.component />}
                          />
                        ))}
                    </Route>
                  );
                })}

                {privateRoutes.map((router, index) => {
                  const Page = router.component;
                  const Layout = router.layout || (({ children }) => <>{children}</>);
                  return (
                    <Route
                      key={"private" + index}
                      path={router.path}
                      element={
                        <PrivateRoute>
                          <Layout>
                            <Page />
                          </Layout>
                        </PrivateRoute>
                      }
                    >
                      {router.children &&
                        router.children.map((childRoute, childIndex) => (
                          <Route
                            key={"child" + childIndex}
                            path={childRoute.path}
                            element={<childRoute.component />}
                          />
                        ))}
                    </Route>
                  );
                })}
              </Routes>
            </Suspense>
          </Router>
        </LenisProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
