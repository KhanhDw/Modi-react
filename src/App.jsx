import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "./components/guardRouter/PrivateRoute";
import Lenis from "lenis";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Component con để theo dõi route thay đổi
function ScrollHandler({ lenis }) {
  const location = useLocation();

  useEffect(() => {
    // Khôi phục Lenis toàn cục khi route thay đổi
    if (lenis.current) {
      lenis.current.start(); // Đảm bảo Lenis chạy
      lenis.current.resize(); // Cập nhật kích thước wrapper/content
      window.scrollTo(0, 0); // Cuộn về đầu trang
    }
  }, [location, lenis]);

  return null;
}

function App() {
  const lenis = useRef(null);

  useEffect(() => {
    // Khởi tạo Lenis toàn cục
    lenis.current = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: true,
      gestureOrientation: "vertical",
      touchMultiplier: 2,
    });

    const animate = (time) => {
      lenis.current.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    window.__lenis = lenis.current; // Gán vào window

    // Cleanup
    return () => {
      lenis.current.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ScrollHandler lenis={lenis} /> {/* Theo dõi route thay đổi */}
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
                     {/* Thêm xử lý các route con */}
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
 {/* Thêm xử lý các route con */}
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
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;