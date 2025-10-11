// app/RouterView.jsx
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Suspense } from "react";
import { publicRoutes, privateRoutes } from "@/routes";
import PrivateRoute from "@/guardRouter/PrivateRoute";
import ScrollHandler from "./ScrollHandler";
import LoadingScreen from "@/components/common/LoadingScreen";

function renderRoutes(routes, isPrivate = false) {
  return routes.map((r, i) => {
    const Page = r.component;
    const Layout = r.layout || (({ children }) => <>{children}</>);
    const Wrapper = isPrivate
      ? PrivateRoute
      : ({ children }) => <>{children}</>;

    return (
      <Route
        key={(isPrivate ? "private" : "public") + i}
        path={r.path}
        element={
          <Wrapper>
            <Layout>
              <Page />
            </Layout>
          </Wrapper>
        }
      >
        {r.children?.map((child, j) => {
          const ChildPage = child.component;
          return (
            <Route
              key={child.path + j}
              path={child.path}
              element={<ChildPage />}
            />
          );
        })}
      </Route>
    );
  });
}

export default function RouterView() {
  return (
    <Router>
      <ScrollHandler />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {renderRoutes(publicRoutes)}
          {renderRoutes(privateRoutes, true)}
        </Routes>
      </Suspense>
    </Router>
  );
}
