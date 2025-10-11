// app/App.jsx
import "@/App.css";
import Providers from "./Providers";
import RouterView from "./RouterView";
import useSiteVisitLogger from "./hooks/useSiteVisitLogger";

export default function App() {
  useSiteVisitLogger();

  return (
    <Providers>
      <RouterView />
    </Providers>
  );
}
