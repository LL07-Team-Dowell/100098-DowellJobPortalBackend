import { createContext, useContext, useState, useEffect } from "react";

const CurrentUserContext = createContext({});

export const useCurrentUserContext = () => useContext(CurrentUserContext);

export const CurrentUserContextProvider = ({ children }) => {
  // useEffect(()=>{
  //     console.log("render")
  //     return () => console.log("mounter")
  // },[])
  const [currentUser, setCurrentUser] = useState(null);
  const [isPublicUser, setIsPublicUser] = useState(false);
  const [publicUserDetails, setPublicUserDetails] = useState({});
  const [userDetailsNotFound, setUserDetailsNotFound] = useState(false);
  const [userRolesFromLogin, setUserRolesFromLogin] = useState([]);
  const [userRolesLoaded, setRolesLoaded] = useState(false);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [isNotOwnerUser, setIsNotOwnerUser] = useState(true);
  const [isProductUser, setIsProductUser] = useState(false);
  const [productUserDetails, setProductUserDetails] = useState({});
  const [isReportsUser, setIsReportsUser] = useState(false);
  const [reportsUserDetails, setReportsUserDetails] = useState({});
  const [currentAuthSessionExpired, setCurrentAuthSessionExpired] = useState(false);
  const [userRemovalStatusLoading, setUserRemovalStatusLoading] = useState(true);
  const [userRemovalStatusChecked, setUserRemovalStatusChecked] = useState(false);
  const [userIsRemoved, setUserIsRemoved] = useState(false);
  const [userNewContract, setNewContract] = useState(false);
  const [navLinksOpenForUser, setNavLinksOpenForUser] = useState([]);
  const [navLinksOpenForUserSet, setNavLinksOpenForUserSet] = useState(false);
  const [currentUserHiredApplications, setCurrentUserHiredApplications] = useState([]);
  const [currentUserHiredApplicationsLoaded, setCurrentUserHiredApplicationsLoaded] = useState(false);
  const [applicationsWithoutUserIdUpdated, setApplicationsWithoutUserIdUpdated] = useState(false);

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
      userRemovalStatusLoading,
      setUserRemovalStatusLoading,
      userIsRemoved,
      setUserIsRemoved,
      userRemovalStatusChecked,
      setUserRemovalStatusChecked,
      userNewContract,
      setNewContract,
      navLinksOpenForUser,
      setNavLinksOpenForUser,
      navLinksOpenForUserSet,
      setNavLinksOpenForUserSet,
      currentUserHiredApplications,
      setCurrentUserHiredApplications,
      currentUserHiredApplicationsLoaded,
      setCurrentUserHiredApplicationsLoaded,
      applicationsWithoutUserIdUpdated,
      setApplicationsWithoutUserIdUpdated,
    }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
