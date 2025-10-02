import { Outlet } from "react-router-dom";
import MarketingProvider from "@/pages/managers/MarketingPage/hooks/MarketingProvider";

export default function MarketingPage() {
  return (
    <MarketingProvider>
      <div className="mx-auto">
        <Outlet />
      </div>
    </MarketingProvider>
  );
}
