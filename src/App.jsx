import "./App.css";
import "react-tooltip/dist/react-tooltip.css";
import { Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import useDowellLogin from "./hooks/useDowellLogin";
import useTitle from "./hooks/useTitle";
import { NavigationContextProvider } from "./contexts/NavigationContext";
import { NewApplicationContextProvider } from "./contexts/NewApplicationContext";
import { CandidateContextProvider } from "./contexts/CandidatesContext";
import { HrCandidateContextProvider } from "./contexts/HrCandidateContext";
import { CandidateTaskContextProvider } from "./contexts/CandidateTasksContext";
import { CandidateJobsContextProvider } from "./contexts/CandidateJobsContext";
import { useCurrentUserContext } from "./contexts/CurrentUserContext";
import { JobContextProvider } from "./contexts/Jobs";
import AdminReports from "./pages/AdminPage/views/Reports/Reports";
import RedirectPage from "./pages/Redirectpage/redirect";
import { testingRoles } from "./utils/testingRoles";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import { HrJobScreenAllTasksContextProvider } from "./contexts/HrJobScreenAllTasks";
import { ResponsesContextProvider } from "./contexts/Responses";
import { ValuesProvider } from "./pages/TeamleadPage/views/CreateMembersTask/context/Values";
import { TeamProvider } from "./pages/TeamleadPage/views/CreateMembersTask/context/Team";
import ProvertionPeriod from "./pages/CandidatePage/views/ProvertionPeriod/ProvertionPeriod";
import { CandidateValuesProvider } from "./contexts/CandidateTeamsContext";
import { TeamCandidateProvider } from "./pages/CandidatePage/views/TeamsScreen/useTeams";
import UserDetailNotFound from "./pages/UserDetailNotFound/UserDetailNotFound";
import { PageUnderConstruction } from "./pages/UnderConstructionPage/ConstructionPage";
import DetailedIndividual from "./pages/AdminPage/views/Reports/detailedIndividual/DetailedIndividual";
import TaskReports from "./pages/AdminPage/views/Reports/TaskReports";
import TeamReport from "./pages/AdminPage/views/Reports/TeamReoprt/TeamReport";
import { reportOptionsPermitted } from "./components/ShareJobModal/ShareJobModal";
import LeaderboardReport from "./pages/AdminPage/views/Reports/LeaderboardReport/LeaderboardReport";
import { teamManagementProductName } from "./utils/utils";
import CandidateRemovedScreen from "./pages/CandidatePage/views/CandidateRemovedScreen/CandidateRemovedScreen";
import CandidateRenewContract from "./pages/CandidatePage/views/CandidateRenewContract/CandidateRenewContract";
import CompanyStructureContextProvider from "./contexts/CompanyStructureContext";
import { mainAdminRoutesInfo } from "./routes/adminRoutes";
import { projectLeadRoutesInfo } from "./routes/projectLeadRoutes";
import { subAdminRoutesInfo } from "./routes/subAdminRoutes";
import useUpdateUserId from "./hooks/useUpdateUserId";
import { accountRoutesInfo } from "./routes/accountRoutes";
import { publicUserRoutes } from "./routes/publicUserRoutes";
import {
  productUserRoutes,
  singleCategoryProductUserRoutes,
} from "./routes/productUserRoutes";
import { hrRoutesInfo } from "./routes/hrRoutes";
import GithubReportContextProvider from "./contexts/GithubReportContext";
import {
  candidateHiredRoutes,
  candidateShortlistedRoutes,
  defaultCandidateRoutes,
} from "./routes/candidateRoutes";
import { teamleadRouteInfo } from "./routes/teamleadRoutes";
import { groupleadRouteInfo } from "./routes/groupleadRoutes";

function App() {
  // console.log = () => { };

  const {
    currentUser,
    isPublicUser,
    setCurrentUser,
    setIsPublicUser,
    setPublicUserDetails,
    userDetailsNotFound,
    setUserDetailsNotFound,
    isProductUser,
    setIsProductUser,
    setProductUserDetails,
    productUserDetails,
    isReportsUser,
    setIsReportsUser,
    reportsUserDetails,
    setReportsUserDetails,
    currentUserHiredApplications,
    setCurrentUserHiredApplications,
    applicationsWithoutUserIdUpdated,
    setApplicationsWithoutUserIdUpdated,
    currentUserHiredApplicationsLoaded,
  } = useCurrentUserContext();

  const [loading, setLoading] = useState(true);
  const [candidateHired, setCandidateHired] = useState(false);
  const [candidateShortListed, setCandidateShortListed] = useState(false);
  const [candidateRemoved, setCandidateRemoved] = useState(false);
  const [candidateRenewContract, setRenewContract] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [shorlistedJob, setshorlistedJob] = useState([]);

  // // USE ONLY WHEN APP IS BROKEN/UNDERGOING MAJOR CHANGES
  // return <Routes>
  //   <Route path="*" element={<PageUnderConstruction showProductView={true} />} />
  // </Routes>

  // console.log(shorlistedJob);
  useDowellLogin(
    setCurrentUser,
    setLoading,
    setIsPublicUser,
    setPublicUserDetails,
    setUserDetailsNotFound,
    setIsProductUser,
    setProductUserDetails,
    setIsReportsUser,
    setReportsUserDetails
  );

  useTitle(teamManagementProductName);

  useUpdateUserId(
    loading,
    currentUser,
    currentUserHiredApplications,
    currentUserHiredApplicationsLoaded,
    setCurrentUserHiredApplications,
    applicationsWithoutUserIdUpdated,
    setApplicationsWithoutUserIdUpdated
  );

  if (loading) return <LoadingPage />;
  console.log("CURRENT USER", currentUser);

  // NO LOGGED IN PUBLIC USER VIEW
  if (!currentUser && isPublicUser) {
    return (
      <Routes>
        {React.Children.toArray(
          publicUserRoutes.map((route) => {
            return (
              <Route
                path={route.path}
                element={
                  <JobContextProvider>
                    <NewApplicationContextProvider>
                      <route.component />
                    </NewApplicationContextProvider>
                  </JobContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // NON LOGGED IN PRODUCT USER
  if (!currentUser && isProductUser) {
    if (productUserDetails.onlySingleJobCategoryPermitted) {
      return (
        <Routes>
          {React.Children.toArray(
            singleCategoryProductUserRoutes.map((productRoute) => {
              return (
                <Route
                  path={productRoute.path}
                  element={
                    <JobContextProvider>
                      <NewApplicationContextProvider>
                        <CandidateJobsContextProvider>
                          <productRoute.component />
                        </CandidateJobsContextProvider>
                      </NewApplicationContextProvider>
                    </JobContextProvider>
                  }
                />
              );
            })
          )}
        </Routes>
      );
    }

    return (
      <Routes>
        {React.Children.toArray(
          productUserRoutes.map((productRoute) => {
            return (
              <Route
                path={productRoute.path}
                element={
                  <JobContextProvider>
                    <NewApplicationContextProvider>
                      {productRoute?.hasProps === true ? (
                        <productRoute.component
                          setHired={setCandidateHired}
                          setAssignedProjects={setAssignedProjects}
                          setCandidateShortListed={setCandidateShortListed}
                          setshorlistedJob={setshorlistedJob}
                          setRemoved={setCandidateRemoved}
                        />
                      ) : (
                        <productRoute.component />
                      )}
                    </NewApplicationContextProvider>
                  </JobContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // NON LOGGED IN REPORTS USER
  if (!currentUser && isReportsUser) {
    if (
      reportsUserDetails.reportsViewPermitted ===
      reportOptionsPermitted.organization_report
    ) {
      return (
        <Routes>
          <Route
            path="*"
            element={
              <JobContextProvider>
                <AdminReports isPublicReportUser={true} />
              </JobContextProvider>
            }
          />
        </Routes>
      );
    }

    if (
      reportsUserDetails.reportsViewPermitted ===
      reportOptionsPermitted.individual_report
    ) {
      return (
        <Routes>
          <Route
            path="*"
            element={<DetailedIndividual isPublicReportUser={true} />}
          />
        </Routes>
      );
    }

    if (
      reportsUserDetails.reportsViewPermitted ===
      reportOptionsPermitted.task_report
    ) {
      return (
        <Routes>
          <Route
            path="*"
            element={
              <JobContextProvider>
                <TaskReports isPublicReportUser={true} />
              </JobContextProvider>
            }
          />
        </Routes>
      );
    }

    if (
      reportsUserDetails.reportsViewPermitted ===
      reportOptionsPermitted.team_report
    ) {
      return (
        <Routes>
          <Route
            path="*"
            element={
              <JobContextProvider>
                <TeamReport isPublicReportUser={true} />
              </JobContextProvider>
            }
          />
        </Routes>
      );
    }

    if (
      reportsUserDetails.reportsViewPermitted ===
      reportOptionsPermitted.leaderboard_report
    ) {
      return (
        <Routes>
          <Route
            path="*"
            element={
              <JobContextProvider>
                <LeaderboardReport isPublicReportUser={true} />
              </JobContextProvider>
            }
          />
        </Routes>
      );
    }

    return (
      <Routes>
        <Route path="*" element={<>Page not found</>} />
      </Routes>
    );
  }

  // NO CURRENT USER OR USER SESSION HAS EXPIRED
  if (!currentUser || userDetailsNotFound) {
    return (
      <Routes>
        <Route path="*" element={<UserDetailNotFound />} />
      </Routes>
    );
  }

  //CURRENT USER BUT NO PORTFOLIO INFO OR PORTFOLIO INFO IS EMPTY
  if (
    !currentUser.portfolio_info ||
    currentUser.portfolio_info.length < 1 ||
    !currentUser.portfolio_info.find(
      (item) => item.product === teamManagementProductName
    )
  ) {
    return (
      <Routes>
        <Route path="*" element={<RedirectPage />} />
      </Routes>
    );
  }

  // ACCOUNT PAGE
  if (
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[
      currentUser.settings_for_profile_info.profile_info.length - 1
    ].Role === testingRoles.accountRole
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          accountRoutesInfo.map((info) => {
            return (
              <Route
                path={info?.path}
                element={
                  <NavigationContextProvider>
                    <CandidateContextProvider>
                      <info.component />
                    </CandidateContextProvider>
                  </NavigationContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // SUB-ADMIN PAGE
  if (
    (currentUser.settings_for_profile_info &&
      currentUser.settings_for_profile_info.profile_info[
        currentUser.settings_for_profile_info.profile_info.length - 1
      ].Role === testingRoles.subAdminRole) ||
    (currentUser.settings_for_profile_info &&
      currentUser.settings_for_profile_info.fakeSuperUserInfo &&
      currentUser.fakeSubAdminRoleSet)
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          subAdminRoutesInfo.map((info) => {
            return (
              <Route
                path={info?.path}
                element={
                  <JobContextProvider>
                    <CandidateTaskContextProvider>
                      <ValuesProvider>
                        <GithubReportContextProvider>
                          <info.component />
                        </GithubReportContextProvider>
                      </ValuesProvider>
                    </CandidateTaskContextProvider>
                  </JobContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // ADMIN PAGE
  if (
    (currentUser.portfolio_info &&
      currentUser.portfolio_info.length > 0 &&
      currentUser.portfolio_info.find(
        (item) => item.product === teamManagementProductName
      ) &&
      currentUser.portfolio_info.find(
        (item) => item.product === teamManagementProductName
      ).member_type === "owner" &&
      !currentUser.settings_for_profile_info?.fakeSuperUserInfo) ||
    (currentUser.settings_for_profile_info &&
      currentUser.settings_for_profile_info.profile_info[
        currentUser.settings_for_profile_info.profile_info.length - 1
      ].Role === testingRoles.superAdminRole)
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          mainAdminRoutesInfo.map((info) => {
            return (
              <Route
                path={info?.path}
                element={
                  <JobContextProvider>
                    <CandidateTaskContextProvider>
                      <ValuesProvider>
                        <TeamProvider>
                          <CompanyStructureContextProvider>
                            <GithubReportContextProvider>
                              <info.component />
                            </GithubReportContextProvider>
                          </CompanyStructureContextProvider>
                        </TeamProvider>
                      </ValuesProvider>
                    </CandidateTaskContextProvider>
                  </JobContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // HR PAGE
  if (
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[
      currentUser.settings_for_profile_info.profile_info.length - 1
    ].Role === testingRoles.hrRole
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          hrRoutesInfo.map((route) => {
            return (
              <Route
                path={route?.path}
                element={
                  <NavigationContextProvider>
                    <HrJobScreenAllTasksContextProvider>
                      <ValuesProvider>
                        <HrCandidateContextProvider>
                          <CandidateTaskContextProvider>
                            <route.component />
                          </CandidateTaskContextProvider>
                        </HrCandidateContextProvider>
                      </ValuesProvider>
                    </HrJobScreenAllTasksContextProvider>
                  </NavigationContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // TEAMLEAD PAGE
  if (
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[
      currentUser.settings_for_profile_info.profile_info.length - 1
    ].Role === testingRoles.teamLeadRole
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          teamleadRouteInfo.map((route) => {
            return (
              <Route
                path={route?.path}
                element={
                  <NavigationContextProvider>
                    <CandidateContextProvider>
                      <CandidateTaskContextProvider>
                        <ValuesProvider>
                          <TeamProvider>
                            <route.component />
                          </TeamProvider>
                        </ValuesProvider>
                      </CandidateTaskContextProvider>
                    </CandidateContextProvider>
                  </NavigationContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // GROUPLEAD PAGE
  if (
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[
      currentUser.settings_for_profile_info.profile_info.length - 1
    ].Role === testingRoles.groupLeadRole
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          groupleadRouteInfo.map((route) => {
            return (
              <Route
                path={route?.path}
                element={
                  <NavigationContextProvider>
                    <CandidateContextProvider>
                      <CandidateTaskContextProvider>
                        <ValuesProvider>
                          <TeamProvider>
                            <route.component />
                          </TeamProvider>
                        </ValuesProvider>
                      </CandidateTaskContextProvider>
                    </CandidateContextProvider>
                  </NavigationContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // PROJECT LEAD PAGE
  if (
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[
      currentUser.settings_for_profile_info.profile_info.length - 1
    ].Role === testingRoles.projectLeadRole
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          projectLeadRoutesInfo.map((item) => {
            return (
              <Route
                path={item?.path}
                element={
                  <CandidateTaskContextProvider>
                    <ValuesProvider>
                      <TeamProvider>
                        <item.component />
                      </TeamProvider>
                    </ValuesProvider>
                  </CandidateTaskContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  //Provertion Period Page
  if (
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[
      currentUser.settings_for_profile_info.profile_info.length - 1
    ].Role === testingRoles.provertionRole
  ) {
    return (
      <Routes>
        {React.Children.toArray(
          defaultCandidateRoutes.map((route) => {
            return (
              <Route
                path={route.path}
                element={
                  <NavigationContextProvider>
                    <CandidateJobsContextProvider>
                      <JobContextProvider>
                        <NewApplicationContextProvider>
                          <ProvertionPeriod>
                            {route.hasProps ? (
                              <route.component
                                setHired={setCandidateHired}
                                setAssignedProjects={setAssignedProjects}
                                setCandidateShortListed={
                                  setCandidateShortListed
                                }
                                setshorlistedJob={setshorlistedJob}
                                setRemoved={setCandidateRemoved}
                                setRenewContract={setRenewContract}
                              />
                            ) : (
                              <route.component />
                            )}
                          </ProvertionPeriod>
                        </NewApplicationContextProvider>
                      </JobContextProvider>
                    </CandidateJobsContextProvider>
                  </NavigationContextProvider>
                }
              />
            );
          })
        )}
      </Routes>
    );
  }

  // CANDIDATE PAGE
  return candidateRemoved ? (
    <Routes>
      <Route path="*" element={<CandidateRemovedScreen />} />
    </Routes>
  ) : candidateRenewContract ? (
    <Routes>
      <Route path="*" element={<CandidateRenewContract />} />
    </Routes>
  ) : candidateHired || currentUser.candidateIsHired ? (
    <Routes>
      {React.Children.toArray(
        candidateHiredRoutes.map((route) => {
          return (
            <>
              <Route
                path={route.path}
                element={
                  <NavigationContextProvider>
                    <CandidateTaskContextProvider>
                      <TeamCandidateProvider>
                        <CandidateJobsContextProvider>
                          <JobContextProvider>
                            <CandidateValuesProvider>
                              <ResponsesContextProvider>
                                {route.hasProps ? (
                                  <route.component
                                    currentUser={currentUser}
                                    assignedProjects={assignedProjects}
                                  />
                                ) : (
                                  <route.component />
                                )}
                              </ResponsesContextProvider>
                            </CandidateValuesProvider>
                          </JobContextProvider>
                        </CandidateJobsContextProvider>
                      </TeamCandidateProvider>
                    </CandidateTaskContextProvider>
                  </NavigationContextProvider>
                }
              />
            </>
          );
        })
      )}
    </Routes>
  ) : candidateShortListed ? (
    <Routes>
      {React.Children.toArray(
        candidateShortlistedRoutes.map((route) => {
          return (
            <>
              <Route
                path={route.path}
                element={
                  <ResponsesContextProvider>
                    <CandidateValuesProvider>
                      {route.hasProps ? (
                        <route.component shorlistedJob={shorlistedJob} />
                      ) : (
                        <route.component />
                      )}
                    </CandidateValuesProvider>
                  </ResponsesContextProvider>
                }
              />
            </>
          );
        })
      )}
    </Routes>
  ) : (
    <Routes>
      {React.Children.toArray(
        defaultCandidateRoutes.map((route) => {
          return (
            <Route
              path={route.path}
              element={
                <NavigationContextProvider>
                  <CandidateJobsContextProvider>
                    <JobContextProvider>
                      <NewApplicationContextProvider>
                        {route.hasProps ? (
                          <route.component
                            setHired={setCandidateHired}
                            setAssignedProjects={setAssignedProjects}
                            setCandidateShortListed={setCandidateShortListed}
                            setshorlistedJob={setshorlistedJob}
                            setRemoved={setCandidateRemoved}
                            setRenewContract={setRenewContract}
                          />
                        ) : (
                          <route.component />
                        )}
                      </NewApplicationContextProvider>
                    </JobContextProvider>
                  </CandidateJobsContextProvider>
                </NavigationContextProvider>
              }
            />
          );
        })
      )}
    </Routes>
  );
}

export default App;

// return (
//   <>
//     <Routes>
//       <Route path="/" element={<MainPage />} />
//       <Route path="/research-jobs" element={<ResearchAssociatePage />} />
//       <Route path="/admin">
//         <Route index element={<AdminPage />} />
//         <Route path="add" element={<AddJob />} />
//         <Route path="view" element={<ViewJob />} />
//         <Route path="edit" element={<EditJob />} />
//       </Route>
//       <Route path="/landingpage" element={<LandingPage />} />
//     </Routes>
//   </>
// );

// return (
//   <>
//     <Routes>
//       <Route path="/" element={<LoadingPage />} />
//     </Routes>
//   </>
// );

// const categoriesForScreen = [
//   {
//     category: "employee",
//     component: EmployeeJobScreen,
//   },
//   {
//     category: "intern",
//     component: InternJobScreen,
//   },
//   {
//     category: "freelancer",
//     component: FreelancerJobScreen,
//   },
// ];
