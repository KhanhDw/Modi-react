import { createContext, useContext } from 'react';

const AboutDataContext = createContext();

export const AboutDataProvider = ({ children, value }) => {
  return (
    <AboutDataContext.Provider value={value}>
      {children}
    </AboutDataContext.Provider>
  );
};

export const useAboutData = () => {
  const context = useContext(AboutDataContext);
  if (!context) {
    throw new Error('useAboutData must be used within an AboutDataProvider');
  }
  return context;
};