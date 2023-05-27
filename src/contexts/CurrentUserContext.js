import { createContext, useContext, useState } from "react";

const CurrentUserContext = createContext({});

export const useCurrentUserContext = () => useContext(CurrentUserContext);

export const CurrentUserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
