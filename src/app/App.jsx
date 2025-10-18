// app/App.jsx
import "@/App.css";
import Providers from "./Providers";
import RouterView from "./RouterView";
import useSiteVisitLogger from "./hooks/useSiteVisitLogger";

function AppContent() {
  useSiteVisitLogger(); // Hook được gọi trong component con của Providers
  return <RouterView />;
}

export default function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
