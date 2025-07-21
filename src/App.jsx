import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { Suspense } from "react"
import { publicRoutes } from "./routes";
import Lenis from '@studio-freight/lenis';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

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
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
