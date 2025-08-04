import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { Suspense } from "react"
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "./components/guardRouter/PrivateRoute";
import Lenis from 'lenis';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const lenis = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    lenis.current = new Lenis({
      duration: 0.6, // Control the duration of the scroll
      easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic easing for smooth stop
      smooth: true,
      smoothTouch: true, // Enable smooth scrolling on touch devices
    });

    const animate = (time) => {
      lenis.current.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      lenis.current.destroy();
    };
  }, []);




  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router >
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
                  />
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
                    } />
                );
              })}
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
