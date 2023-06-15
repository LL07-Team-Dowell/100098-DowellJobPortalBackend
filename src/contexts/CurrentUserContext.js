import { createContext, useContext, useState ,useEffect } from "react";

const CurrentUserContext = createContext({});

export const useCurrentUserContext = () => useContext(CurrentUserContext);

export const CurrentUserContextProvider = ({ children }) => {
  useEffect(()=>{
      console.log("render")
      return () => console.log("mounter")
  },[])
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
