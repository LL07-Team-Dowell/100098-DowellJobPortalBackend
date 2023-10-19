import { createContext, useContext, useState ,useEffect } from "react";

const CurrentUserContext = createContext({});

export const useCurrentUserContext = () => useContext(CurrentUserContext);

export const CurrentUserContextProvider = ({ children }) => {
  // useEffect(()=>{
  //     console.log("render")
  //     return () => console.log("mounter")
  // },[])
  const [currentUser, setCurrentUser] = useState(null);
  const [ isPublicUser, setIsPublicUser ] = useState(false);
  const [ publicUserDetails, setPublicUserDetails ] = useState({});
  const [ userDetailsNotFound, setUserDetailsNotFound ] = useState(false);
  const [ userRolesFromLogin, setUserRolesFromLogin ] = useState([]);
  const [ userRolesLoaded, setRolesLoaded ] = useState(false);
  const [ portfolioLoaded, setPortfolioLoaded ] = useState(false);
  const [ isNotOwnerUser, setIsNotOwnerUser ] = useState(true);
  const [ isProductUser, setIsProductUser ] = useState(false);
  const [ productUserDetails, setProductUserDetails ] = useState({});
  const [ isReportsUser, setIsReportsUser ] = useState(false);
  const [ reportsUserDetails, setReportsUserDetails ] = useState({});
  const [ currentAuthSessionExpired, setCurrentAuthSessionExpired ] = useState(false);

  return (
    <CurrentUserContext.Provider value={{ 
      currentUser, 
      setCurrentUser,
      isPublicUser,
      setIsPublicUser,
      publicUserDetails,
      setPublicUserDetails,
      userDetailsNotFound, 
      setUserDetailsNotFound,
      userRolesFromLogin,
      setUserRolesFromLogin,
      userRolesLoaded,
      setRolesLoaded,
      portfolioLoaded,
      setPortfolioLoaded,
      isNotOwnerUser,
      setIsNotOwnerUser,
      isProductUser,
      setIsProductUser,
      productUserDetails, 
      setProductUserDetails,
      isReportsUser,
      setIsReportsUser,
      reportsUserDetails,
      setReportsUserDetails,
      currentAuthSessionExpired,
      setCurrentAuthSessionExpired,
    }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
