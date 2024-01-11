import { HiOutlineUserCircle } from "react-icons/hi";
import logo from "../../assets/images/landing-logo.png";
import "./style.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import NewSideNavigationBar from "../../components/SideNavigationBar/NewSideNavigationBar";
import { Link } from "react-router-dom";
import { hrNavigationLinks } from "../../pages/HrPage/views/hrNavigationLinks";
import { accountNavigationLinks } from "../../pages/AccountPage/accountNavigationLinks";
import {
  groupLeadNavigationLinks,
  teamleadNavigationLinks,
} from "../../pages/TeamleadPage/teamleadNavigationLinks";
import { AiOutlinePlus } from "react-icons/ai";
import { useMediaQuery } from "@mui/material";
import {
  adminNavigationLinks,
  subAdminNavigationLinks,
} from "../../pages/AdminPage/views/adminNavigationLinks";
import ProgressTracker from "../../pages/AdminPage/views/Landingpage/component/progressTracker";
import BlurBackground from "../../pages/AdminPage/views/Landingpage/component/blur";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useEffect, useState } from "react";
import { teamManagementProductName } from "../../utils/utils";
import ShareJobModal from "../../components/ShareJobModal/ShareJobModal";
import PublicAccountConfigurationModal from "../../pages/HrPage/component/PublicAccountConfigurationModal/PublicAccountConfigurationModal";
import { testingRoles } from "../../utils/testingRoles";
import teamManagementLogo from "../../assets/images/team-management-logo.png";
import { MdPublic } from "react-icons/md";
import { projectLeadNavLinks } from "../../pages/ProjectLeadPage/utils/projectLeadNavigationLinks";
import useCheckCurrentAuthStatus from "../../hooks/useCheckCurrentAuthStatus";
import AuthOverlay from "../../components/AuthOverlay/AuthOverlay";
import useCheckIfUserIsRemoved from "../../hooks/useCheckIfUserIsRemoved";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import CandidateRemovedScreen from "../../pages/CandidatePage/views/CandidateRemovedScreen/CandidateRemovedScreen";
import HorizontalBarLoader from "../../components/HorizontalBarLoader/HorizontalBarLoader";
import CandidateRenewContract from "../../pages/CandidatePage/views/CandidateRenewContract/CandidateRenewContract";
import ProjectTimeModal from "../../components/ProjectTimeCards/ProjectTimeCard";


const StaffJobLandingLayout = ({
  children,
  hrView,
  accountView,
  teamleadView,
  runExtraFunctionOnNavItemClick,
  hideSideBar,
  adminView,
  searchValue,
  setSearchValue,
  handleNavIconClick,
  adminAlternativePageActive,
  pageTitle,
  hideTitleBar,
  showAnotherBtn,
  btnIcon,
  handleNavIcon,
  subAdminView,
  searchPlaceHolder,
  showLoadingOverlay,
  modelDurationInSec,
  hideSearchBar,
  showShareModalForJob,
  jobLinkToShareObj,
  handleCloseShareJobModal,
  showPublicAccountConfigurationModal,
  handleClosePublicAccountConfigurationModal,
  handlePublicAccountConfigurationModalBtnClick,
  publicAccountConfigurationBtnDisabled,
  publicAccountDetailState,
  handleChangeInPublicAccountState,
  searchTeam,
  layoutBgColor,
  isProductLink,
  isGrouplead,
  isReportLink,
  projectLeadView,
  newSidebarDesign,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const {
    currentUser,
    currentAuthSessionExpired,
    setCurrentAuthSessionExpired,
    userRemovalStatusLoading,
    setUserRemovalStatusLoading,
    userIsRemoved,
    setUserIsRemoved,
    userRemovalStatusChecked,
    setUserRemovalStatusChecked,
    userNewContract,
    setNewContract
  } = useCurrentUserContext();
  const [isSuperUser, setIsSuperUser] = useState(false);

  useCheckCurrentAuthStatus(currentUser, setCurrentAuthSessionExpired);
  useCheckIfUserIsRemoved(currentUser, setUserIsRemoved, setUserRemovalStatusLoading, userRemovalStatusChecked, setUserRemovalStatusChecked, setNewContract);

  useEffect(() => {
    if (!currentUser) return

    const teamManagementProduct = currentUser?.portfolio_info?.find(
      (portfolio) => portfolio.product === teamManagementProductName
    );

    if (
      (currentUser.settings_for_profile_info &&
        currentUser.settings_for_profile_info.profile_info[
          currentUser.settings_for_profile_info.profile_info.length - 1
        ].Role === testingRoles.superAdminRole) ||
      currentUser.isSuperAdmin
    )
      return setIsSuperUser(true);

    if (!teamManagementProduct || teamManagementProduct.member_type !== "owner")
      return setIsSuperUser(false);

    setIsSuperUser(true);
  }, [currentUser]);

  if (userRemovalStatusLoading) return <>
    <div className="loading__Check__Wrap">
      <HorizontalBarLoader />
      <p>Please hold on a minute...</p>
    </div>
  </>

  if (userIsRemoved) return <CandidateRemovedScreen />
  if (userNewContract) return <CandidateRenewContract />
  return (
    <>
      {currentAuthSessionExpired && <AuthOverlay />}
      <nav style={{ display: hideTitleBar ? "none" : "block" }}>
        <div style={{ position: "relative" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // padding: "1rem",
              fontWeight: "600",
              fontSize: "1.1rem",
              position: "absolute",
              top: "0",
              left: "50%",
              zIndex: "100",
              color: "red",
              transform: "translateX(-50%)",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.07), transparent)",
              width: "100%",
            }}
          >
            You're on the Beta Version of Jobportal
          </p>
        </div>
        <div
          className={`staff__Jobs__Layout__Navigation__Container ${
            adminView ? "admin" : ""
          }`}
        >
          {!adminView && isLargeScreen && (
            <Link to={"/"} className="jobs__Layout__Link__Item">
              <img src={logo} alt={"dowell logo"} />
            </Link>
          )}
          {adminView ? (
            !currentUser ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <img
                    src={teamManagementLogo}
                    alt="team management"
                    style={{ width: "8rem" }}
                  />
                  {isLargeScreen ? <h2>{teamManagementProductName}</h2> : <></>}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <MdPublic className="icon" />
                  <span style={{ fontSize: 13 }}>Public user</span>
                </div>
              </>
            ) : adminAlternativePageActive ? (
              <div
                className="admin__View__Title__Container"
                onClick={handleNavIconClick ? handleNavIconClick : () => {}}
              >
                {showAnotherBtn ? (
                  <>
                    <div
                      className="add__Icon__Container"
                      onClick={handleNavIcon}
                    >
                      {btnIcon}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {pageTitle ? <h2>{pageTitle}</h2> : <></>}
              </div>
            ) : (
              <div
                className="admin__View__Title__Container"
                onClick={handleNavIconClick ? handleNavIconClick : () => {}}
              >
                <div className="add__Icon__Container">
                  <AiOutlinePlus />
                </div>
                {isLargeScreen && <h2>All Jobs</h2>}
              </div>
            )
          ) : (
            <></>
          )}
          {/*adminView ? "Search by skill, job" : "Search for job/applicant";*/}
          {adminView && adminAlternativePageActive ? (
            <></>
          ) : hideSearchBar ? (
            <></>
          ) : (
            <SearchBar
              placeholder={
                searchTeam
                  ? "Search for Team"
                  : adminView
                  ? "Search by skill, job"
                  : `Search for job/${searchPlaceHolder}`
              }
              searchValue={searchValue}
              handleSearchChange={setSearchValue}
            />
          )}
          {hideTitleBar || !currentUser ? (
            <></>
          ) : (
            <>
              <div className="jobs__Layout__Icons__Container">
                <Link to={"/user"}>
                  {currentUser?.userinfo?.profile_img ? (
                    <img
                      src={currentUser?.userinfo?.profile_img}
                      alt="#"
                      style={{
                        width: "30px",
                        borderRadius: "50%",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <HiOutlineUserCircle className="icon" />
                  )}
                </Link>
              </div>
              <hr />
            </>
          )}
        </div>
      </nav>
      <main>
        <div
          className={`staff__Jobs__Layout__Content__Container ${
            accountView ? "account" : ""
          }`}
        >
          {!hideSideBar && currentUser && (
            <NewSideNavigationBar
              className={`
                ${hideTitleBar ? "full__Height" : ""} 
                ${newSidebarDesign ? "new__Side__Width" : ""}
              `}
              links={
                hrView
                  ? hrNavigationLinks
                  : accountView
                  ? accountNavigationLinks
                  : teamleadView
                  ? isGrouplead
                    ? groupLeadNavigationLinks
                    : teamleadNavigationLinks
                  : adminView
                  ? subAdminView
                    ? subAdminNavigationLinks
                    : adminNavigationLinks
                  : projectLeadView
                  ? projectLeadNavLinks
                  : []
              }
              runExtraFunctionOnNavItemClick={runExtraFunctionOnNavItemClick}
              superUser={isSuperUser}
              defaultRole={
                currentUser?.settings_for_profile_info?.profile_info[
                  currentUser.settings_for_profile_info?.profile_info?.length -
                    1
                ]?.Role
              }
              assignedProject={
                currentUser?.settings_for_profile_info?.profile_info[
                  currentUser.settings_for_profile_info?.profile_info?.length -
                    1
                ]?.project
              }
              userHasOtherRoles={
                currentUser?.settings_for_profile_info?.profile_info[
                  currentUser.settings_for_profile_info?.profile_info?.length -
                    1
                ]?.other_roles &&
                Array.isArray(
                  currentUser?.settings_for_profile_info?.profile_info[
                    currentUser.settings_for_profile_info?.profile_info
                      ?.length - 1
                  ]?.other_roles
                )
              }
              otherPermittedRoles={
                currentUser?.settings_for_profile_info?.profile_info[
                  currentUser.settings_for_profile_info.profile_info.length - 1
                ]?.other_roles &&
                Array.isArray(
                  currentUser?.settings_for_profile_info?.profile_info[
                    currentUser.settings_for_profile_info.profile_info.length -
                      1
                  ]?.other_roles
                )
                  ? currentUser?.settings_for_profile_info?.profile_info[
                      currentUser.settings_for_profile_info.profile_info
                        .length - 1
                    ]?.other_roles
                  : []
              }
              otherPermittedProjects={
                currentUser?.settings_for_profile_info?.profile_info[
                  currentUser.settings_for_profile_info?.profile_info?.length -
                    1
                ]?.additional_projects &&
                Array.isArray(
                  currentUser?.settings_for_profile_info?.profile_info[
                    currentUser.settings_for_profile_info?.profile_info
                      ?.length - 1
                  ]?.additional_projects
                )
                  ? currentUser?.settings_for_profile_info?.profile_info[
                      currentUser.settings_for_profile_info?.profile_info
                        ?.length - 1
                    ]?.additional_projects
                  : []
              }
              newSidebarDesign={newSidebarDesign}
            />
          )}
          {showLoadingOverlay && (
            <BlurBackground>
              <ProgressTracker durationInSec={modelDurationInSec} />
            </BlurBackground>
          )}

          {adminView && showShareModalForJob && (
            <ShareJobModal
              linkToShareObj={jobLinkToShareObj}
              handleCloseModal={
                handleCloseShareJobModal &&
                  typeof handleCloseShareJobModal === "function"
                  ? () => handleCloseShareJobModal()
                  : () => { }
              }
              isProductLink={isProductLink}
              isReportLink={isReportLink}
            />
          )}

          {hrView && showPublicAccountConfigurationModal && (
            <PublicAccountConfigurationModal
              handleCloseModal={handleClosePublicAccountConfigurationModal}
              handleBtnClick={handlePublicAccountConfigurationModalBtnClick}
              btnDisabled={publicAccountConfigurationBtnDisabled}
              details={publicAccountDetailState}
              handeDetailChange={handleChangeInPublicAccountState}
            />
          )}

          <div
            className={`jobs__Layout__Content 
              ${adminView ? "full__Width" : ""}
              ${!currentUser ? "no__User" : ""}
              ${newSidebarDesign ? "new__MAin__Width" : ""}
            `}
            style={{
              backgroundColor: layoutBgColor ? layoutBgColor : "#fff",
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default StaffJobLandingLayout;
