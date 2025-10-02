import { createContext, useContext } from "react";

export const MarketingContext = createContext(null);

export const useMarketing = () => {
    return useContext(MarketingContext);
};
