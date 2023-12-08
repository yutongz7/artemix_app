import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalData {
    curUserId: string;
    setCurUserId: (userName: string) => void;
}

const GlobalContext = createContext<GlobalData>({
    curUserId: '',
    setCurUserId: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

interface Props {
  children: ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [curUserId, setCurUserId] = useState<string>('');

  return (
    <GlobalContext.Provider value={{ curUserId, setCurUserId }}>
      {children}
    </GlobalContext.Provider>
  );
};
