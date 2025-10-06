import React, { useState, useEffect, Suspense, useRef } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
// Giả định các import này đã được cài đặt và cấu hình đúng
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "@/guardRouter/PrivateRoute";
import LenisProvider, { useLenisToggle } from "./contexts/LenisContext";
import "./App.css";

import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Component con để theo dõi route thay đổi (giữ nguyên)
function ScrollHandler() {
  const location = useLocation();
  const prevRef = useRef(location);
  const { lenis } = useLenisToggle() || {};

  useEffect(() => {
    const prev = prevRef.current;
    const prevFull = `${prev.pathname}${prev.search}${prev.hash}`;
    const currFull = `${location.pathname}${location.search}${location.hash}`;
    if (prevFull === currFull) return;

    if (
      prev.pathname !== location.pathname ||
      prev.search !== location.search
    ) {
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
  // 1. STATE MỚI: Dùng để quản lý trạng thái kết nối
  const [isOnline, setIsOnline] = useState(false); // Mặc định là offline hoặc chưa biết
  const [isLoading, setIsLoading] = useState(true); // Đang kiểm tra

  // useEffect cho Health Check
  useEffect(() => {
    // Sử dụng endpoint /api/speed mà bạn đã cấu hình
    const HEALTH_CHECK_URL = `${import.meta.env.VITE_MAIN_BE_URL}/api/speed`;

    // Hàm cố gắng fetch với cơ chế backoff đơn giản (thử lại 2 lần)
    const checkBackendStatus = async (retries = 2) => {
      try {
        const response = await fetch(HEALTH_CHECK_URL);

        // Kiểm tra mã trạng thái, chỉ chấp nhận 2xx
        if (response.ok) {
          setIsOnline(true);
        } else {
          // Nếu server phản hồi nhưng với lỗi (ví dụ 500), vẫn coi là offline
          throw new Error(`Server status non-2xx: ${response.status}`);
        }
      } catch (error) {
        console.error(
          `Lỗi kết nối Backend (Thử lần ${3 - retries}):`,
          error.message
        );

        if (retries > 0) {
          // Đợi 1 giây rồi thử lại
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await checkBackendStatus(retries - 1);
        } else {
          // Hết số lần thử, xác nhận offline
          setIsOnline(false);
        }
      } finally {
        if (retries === 0 || isOnline) {
          // Chỉ set isLoading = false sau khi đã thử hết hoặc đã online
          setIsLoading(false);
        }
      }
    };

    checkBackendStatus();
  }, []); // [] đảm bảo chỉ chạy 1 lần khi App mount

  // useEffect cho Log Site Visit (giữ nguyên)
  useEffect(() => {
    // Chỉ gửi log nếu đã xác nhận là Online và không còn Loading
    if (!isLoading && isOnline) {
      const key = "site_visit";
      const now = Date.now();
      const expireTime = 30 * 60 * 1000; // 30 phút

      const lastVisit = localStorage.getItem(key);

      if (!lastVisit || now - lastVisit > expireTime) {
        fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/site/visit`, {
          method: "POST",
        }).catch((err) => console.error("Không log được site visit:", err));

        localStorage.setItem(key, now);
      }
    }
  }, [isLoading, isOnline]); // Phụ thuộc vào isLoading và isOnline

  // 2. HIỂN THỊ DỰA TRÊN TRẠNG THÁI

  // A. Đang tải (Kiểm tra kết nối)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 bg-gray-50">
        <p className="text-xl font-semibold animate-pulse">
          Đang kiểm tra kết nối máy chủ...
        </p>
      </div>
    );
  }

  // B. Kết nối thất bại (Bảo trì)
  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50 text-red-800">
        <div className="p-8 bg-white rounded-xl shadow-2xl max-w-md w-full text-center border-t-4 border-red-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            ></path>
          </svg>
          <h1 className="text-2xl font-bold mb-2">🔴 LỖI KẾT NỐI MÁY CHỦ</h1>
          <p className="text-gray-600 mb-4">
            Hệ thống đang được bảo trì hoặc gặp sự cố kỹ thuật.
          </p>
          <p className="text-sm">
            Chúng tôi đang cố gắng khắc phục nhanh nhất có thể. Vui lòng quay
            lại sau ít phút.
          </p>
        </div>
      </div>
    );
  }

  // C. Kết nối thành công (Hiển thị ứng dụng bình thường)
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LenisProvider>
          <Router>
            <ScrollHandler />
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  Đang tải...
                </div>
              }
            >
              <Routes>
                {/* Routes công khai */}
                {publicRoutes.map((router, index) => {
                  const Page = router.component;
                  const Layout =
                    router.layout || (({ children }) => <>{children}</>);
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

                {/* Routes bảo mật */}
                {privateRoutes.map((router, index) => {
                  const Page = router.component;
                  const Layout =
                    router.layout || (({ children }) => <>{children}</>);
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
