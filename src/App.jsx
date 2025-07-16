import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { Suspense } from "react"
import { publicRoutes } from "./routes";


function App() {

  return (
    <Router>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Đang tải...</div>}>
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
