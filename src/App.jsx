import "./App.css";
import "react-tooltip/dist/react-tooltip.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import ResearchAssociatePage from "./pages/CandidatePage/views/ResearchAssociatePage/ResearchAssociatePage";
import AdminPage from "./pages/AdminPage/AdminPage";
import AddJob from "./pages/AdminPage/views/AddJob/AddJob";
import ViewJob from "./pages/AdminPage/views/ViewJob/ViewJob";
import EditJob from "./pages/AdminPage/views/EditJob/EditJob";
import LandingPage from "./pages/AdminPage/views/Landingpage/LandingPage";
import React, { useState } from "react";
import useDowellLogin from "./hooks/useDowellLogin";
import useTitle from "./hooks/useTitle";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { NavigationContextProvider } from "./contexts/NavigationContext";
import { NewApplicationContextProvider } from "./contexts/NewApplicationContext";
import { CandidateContextProvider } from "./contexts/CandidatesContext";
import { HrCandidateContextProvider } from "./contexts/HrCandidateContext";
import { CandidateTaskContextProvider } from "./contexts/CandidateTasksContext";
import { CandidateJobsContextProvider } from "./contexts/CandidateJobsContext";
import { useCurrentUserContext } from "./contexts/CurrentUserContext";
import Logout from "./pages/LogoutPage/Logout";
import JobApplicationScreen from "./pages/CandidatePage/views/JobApplicationScreen/JobApplicationScreen";
import SingleJobScreen from "./pages/CandidatePage/views/JobApplicationScreen/SingleJobScreen";
import JobScreen from "./pages/CandidatePage/components/Job/Job";
import EmployeeJobScreen from "./pages/CandidatePage/views/JobsLandingScreens/EmployeeJobLandingScreen";
import InternJobScreen from "./pages/CandidatePage/views/JobsLandingScreens/InternJobLandingScreen";
import FreelancerJobScreen from "./pages/CandidatePage/views/JobsLandingScreens/FreelancerJobScreen";
import CandidateHomeScreen from "./pages/CandidatePage/views/CandidateHomeScreen/CandidateHomeScreen";
import AfterSelectionScreen from "./pages/CandidatePage/views/AfterSelectionScreen/AfterSelectionScreen";
import AlertScreen from "./pages/CandidatePage/views/AlertsScreen/AlertScreen";
import UserScreen from "./pages/CandidatePage/views/UserScreen/UserScreen";
import AppliedScreen from "./pages/CandidatePage/views/AppliedPageScreen/AppliedScreen";
import HrJobScreen from "./pages/HrPage/views/JobScreen/HrJobScreen";
import Teamlead from "./pages/TeamleadPage/Teamlead";
import AccountPage from "./pages/AccountPage/AccountPage";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import { JobContextProvider } from "./contexts/Jobs";
import AdminUserScreen from "./pages/AdminPage/views/AdminUserScreen/AdminUserScreen";
import AdminReports from "./pages/AdminPage/views/Reports/Reports";
import AdminSettings from "./pages/AdminPage/views/Settings/AdminSettings";
import AdminTeam from "./pages/AdminPage/views/Teams/AdminTeam";
import RedirectPage from "./pages/Redirectpage/redirect";
import { testingRoles } from "./utils/testingRoles";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import HrTasks from "./pages/HrPage/views/Tasks/HrTasks";
import CreateTaskScreen from "./pages/TeamleadPage/views/CreateTaskScreen/CreateTaskScreen";
import { HrJobScreenAllTasksContextProvider } from "./contexts/HrJobScreenAllTasks";
import HrTrainingQuestions from "./pages/HrPage/views/HrTrainingScreen/HrTrainingQuestion";
import CandidateTranningScreen from "./pages/CandidatePage/views/CandidateTranningScreen/CandidateTranningScreen";
import TraningProgress from "./pages/CandidatePage/views/TraningProgress.js/TraningProgress";
import { ResponsesContextProvider } from "./contexts/Responses";
import Index from "./pages/TeamleadPage/views/CreateMembersTask/Index";
import { ValuesProvider } from "./pages/TeamleadPage/views/CreateMembersTask/context/Values";
import StaffJobLandingLayout from "./layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import CreateTeam from "./pages/TeamleadPage/views/CreateMembersTask/views/CreateTeam";
import { TeamProvider } from "./pages/TeamleadPage/views/CreateMembersTask/context/Team";
import TeamScreenTasks from "./pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenTasks";
import TeamScreenMembers from "./pages/TeamleadPage/views/CreateMembersTask/views/TeamScreenMembers";
import ProvertionPeriod from "./pages/CandidatePage/views/ProvertionPeriod/ProvertionPeriod";
import { CandidateValuesProvider } from "./contexts/CandidateTeamsContext";
import { TeamCandidateProvider } from "./pages/CandidatePage/views/TeamsScreen/useTeams";
import TeamScreenMembersCandidate from "./pages/CandidatePage/views/TeamScreenMember/TeamScreenMember";
import TeamScreenTasksCandidate from "./pages/CandidatePage/views/TeamsScreenTasks/TeamsScreenTasks";
import TeamScreenThreadCandidate from "./pages/CandidatePage/views/TeamScreenThread/TeamScreenThread";
import JobLandingLayout from "./layouts/CandidateJobLandingLayout/LandingLayout";
import TeamThread from "./pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThread";
import UserDetailNotFound from "./pages/UserDetailNotFound/UserDetailNotFound";
import Payment from "./pages/AccountPage/Payment";
import Add from "./pages/AdminPage/views/Add/Add";
import TeamThreadScreen from "./pages/TeamleadPage/views/CreateMembersTask/views/compoonent/TeamThread/TeamThreadScreen";
import GroupLeadTask from "./pages/GroupLeadPage/components/GroupLeadTask";
import ClaimVouchar from "./pages/TeamleadPage/views/ClaimVouchar/ClaimVouchar";
import { PageUnderConstruction } from "./pages/UnderConstructionPage/ConstructionPage";
import TaskScreen from "./pages/TeamleadPage/views/TaskScreen/TaskScreen";
import ReportPages from "./pages/AdminPage/views/Reports/reportspages/ReportPages";
import DetailedIndividual from "./pages/AdminPage/views/Reports/detailedIndividual/DetailedIndividual";
import TaskReports from "./pages/AdminPage/views/Reports/TaskReports";

function App() {
  console.log = () => { };
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
  } = useCurrentUserContext();
  const [loading, setLoading] = useState(true);
  const [candidateHired, setCandidateHired] = useState(false);
  const [candidateShortListed, setCandidateShortListed] = useState(false);
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
    setProductUserDetails
  );

  useTitle("Dowell Job Portal");

  if (loading) return <LoadingPage />;
  console.log("CURRENT USER", currentUser);

  // NO LOGGED IN PUBLIC USER VIEW
  if (isPublicUser) {
    return (
      <Routes>
        <Route
          path="/apply/job/:id"
          element={
            <JobContextProvider>
              <NewApplicationContextProvider>
                <JobApplicationScreen />
              </NewApplicationContextProvider>
            </JobContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <JobApplicationScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
        </Route>

        <Route path="*" element={<>Page Not found</>} />
      </Routes>
    );
  }

  // NON LOGGED IN PRODUCT USER
  if (isProductUser) {
    if (productUserDetails.onlySingleJobCategoryPermitted) {
      return (
        <Routes>
          {/* <Route
            path={`c/${productUserDetails.categoryAllowed}`}
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <>
                    {
                      React.Children.toArray(categoriesForScreen.map(item => {
                        if (item.category === productUserDetails.categoryAllowed) return <item.component />
                        return <></>
                      }))
                    }
                  </>
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          /> */}
          <Route
            path={`/jobs`}
            element={
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <JobScreen />
                </CandidateJobsContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            path="/apply/job/:id"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <JobApplicationScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          >
            <Route
              path=":section"
              element={
                <JobContextProvider>
                  <NewApplicationContextProvider>
                    <JobApplicationScreen />
                  </NewApplicationContextProvider>
                </JobContextProvider>
              }
            />
          </Route>
          <Route path="*" element={<>Page Not found</>} />
        </Routes>
      );
    }

    return (
      <Routes>
        <Route
          path="/"
          element={
            <JobContextProvider>
              <NewApplicationContextProvider>
                <CandidateHomeScreen
                  setHired={setCandidateHired}
                  setAssignedProjects={setAssignedProjects}
                  setCandidateShortListed={setCandidateShortListed}
                  setshorlistedJob={setshorlistedJob}
                />
              </NewApplicationContextProvider>
            </JobContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <CandidateHomeScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
        </Route>

        <Route path="/jobs">
          <Route
            index
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <JobScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            path=":jobTitle"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <SingleJobScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            exact
            path="c/research-associate"
            element={<ResearchAssociatePage />}
          />
          <Route
            exact
            path="c/employee"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <EmployeeJobScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            exact
            path="c/intern"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <InternJobScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            exact
            path="c/freelancer"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <FreelancerJobScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
        </Route>

        <Route
          path="/apply/job/:id"
          element={
            <JobContextProvider>
              <NewApplicationContextProvider>
                <JobApplicationScreen />
              </NewApplicationContextProvider>
            </JobContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <JobContextProvider>
                <NewApplicationContextProvider>
                  <JobApplicationScreen />
                </NewApplicationContextProvider>
              </JobContextProvider>
            }
          />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    );
  }

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
      (item) => item.product === "Team Management"
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
        <Route path="/logout" element={<Logout />} />
        <Route path="/payments" element={<Payment />} />

        <Route
          path="/"
          element={
            <NavigationContextProvider>
              <CandidateContextProvider>
                <AccountPage />
              </CandidateContextProvider>
            </NavigationContextProvider>
          }
        >
          <Route path=":section" element={<AccountPage />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
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
        <Route
          path="/"
          element={
            <JobContextProvider>
              {" "}
              <LandingPage subAdminView={true} />
            </JobContextProvider>
          }
        />
        <Route
          path="/logout"
          element={
            <JobContextProvider>
              {" "}
              <Logout />
            </JobContextProvider>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <JobContextProvider>
              <EditJob subAdminView={true} />
            </JobContextProvider>
          }
        />
        <Route
          path="/view-job/:id"
          element={
            <JobContextProvider>
              <ViewJob />
            </JobContextProvider>
          }
        />
        <Route
          path="/add-job"
          element={
            <JobContextProvider>
              <AddJob subAdminView={true} />
            </JobContextProvider>
          }
        />
        <Route
          path="/user"
          element={
            <JobContextProvider>
              <AdminUserScreen subAdminView={true} />
            </JobContextProvider>
          }
        />
        <Route
          path="/report"
          element={
            <JobContextProvider>
              <AdminReports subAdminView={true} />
            </JobContextProvider>
          }
        />

        <Route
          path="*"
          element={
            <JobContextProvider>
              <ErrorPage />
            </JobContextProvider>
          }
        />
      </Routes>
    );
  }

  // ADMIN PAGE
  if (
    (currentUser.portfolio_info &&
      currentUser.portfolio_info.length > 0 &&
      currentUser.portfolio_info.find(
        (item) => item.product === "Team Management"
      ) &&
      currentUser.portfolio_info.find(
        (item) => item.product === "Team Management"
      ).member_type === "owner" &&
      !currentUser.settings_for_profile_info?.fakeSuperUserInfo) ||
    (currentUser.settings_for_profile_info &&
      currentUser.settings_for_profile_info.profile_info[
        currentUser.settings_for_profile_info.profile_info.length - 1
      ].Role === testingRoles.superAdminRole)
  ) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <JobContextProvider>
              {" "}
              <LandingPage />
            </JobContextProvider>
          }
        />
        <Route
          path="/logout"
          element={
            <JobContextProvider>
              {" "}
              <Logout />
            </JobContextProvider>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <JobContextProvider>
              <EditJob />
            </JobContextProvider>
          }
        />
        <Route
          path="/view-job/:id"
          element={
            <JobContextProvider>
              <ViewJob />
            </JobContextProvider>
          }
        />
        <Route
          path="/add-job"
          element={
            <JobContextProvider>
              <AddJob />
            </JobContextProvider>
          }
        />
        <Route
          path="/add"
          element={
            <JobContextProvider>
              <Add />
            </JobContextProvider>
          }
        />
        <Route
          path="/user"
          element={
            <JobContextProvider>
              <AdminUserScreen />
            </JobContextProvider>
          }
        />
        <Route path="/report" element={<ReportPages />} />
        <Route
          path="/report/organization-report"
          element={
            <JobContextProvider>
              <AdminReports />
            </JobContextProvider>
          }
        />
        <Route
          path="/report/detailed-individual-report"
          element={
           <DetailedIndividual />
          }
        />
        <Route
          path="/report/task-report"
          element={
            <JobContextProvider>
              <TaskReports />
            </JobContextProvider>
          }
        />
        <Route
          path="/report/individual-task-report"
          element={
            <>
              <h1>Individual Task report</h1>
            </>
          }
        />
        <Route
          path="/report/task-report"
          element={
            <>
              <h1>Task report</h1>
            </>
          }
        />
        <Route
          path="/report/individual-task-report"
          element={
            <>
              <h1>Individual task report</h1>
            </>
          }
        />
        <Route
          path="/teams"
          element={
            <CandidateTaskContextProvider>
              <ValuesProvider>
                <AdminTeam />
              </ValuesProvider>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/teams/create-new-team/"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                adminView={true}
                pageTitle={"New Team"}
                adminAlternativePageActive={true}
              >
                <ValuesProvider>
                  <CreateTeam />
                </ValuesProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/team-members"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout adminView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    <TeamScreenMembers />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/team-screen-member/:id/team-tasks"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout adminView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    <TeamScreenTasks />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/team-issues"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout adminView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/settings"
          element={
            <JobContextProvider>
              <AdminSettings />
            </JobContextProvider>
          }
        />
        <Route
          path="*"
          element={
            <JobContextProvider>
              <ErrorPage />
            </JobContextProvider>
          }
        />
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
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/"
          element={
            <HrJobScreenAllTasksContextProvider>
              <NavigationContextProvider>
                <HrCandidateContextProvider>
                  <CandidateTaskContextProvider>
                    <HrJobScreen />
                  </CandidateTaskContextProvider>
                </HrCandidateContextProvider>
              </NavigationContextProvider>
            </HrJobScreenAllTasksContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <HrJobScreenAllTasksContextProvider>
                <NavigationContextProvider>
                  <HrJobScreen />
                </NavigationContextProvider>
              </HrJobScreenAllTasksContextProvider>
            }
          >
            <Route
              path=":sub_section"
              element={
                <HrJobScreenAllTasksContextProvider>
                  <NavigationContextProvider>
                    <HrJobScreen />
                  </NavigationContextProvider>
                </HrJobScreenAllTasksContextProvider>
              }
            >
              <Route
                path=":path"
                element={
                  <HrJobScreenAllTasksContextProvider>
                    <NavigationContextProvider>
                      <HrJobScreen />
                    </NavigationContextProvider>
                  </HrJobScreenAllTasksContextProvider>
                }
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/new-task-screen"
          element={
            <>
              <HrJobScreenAllTasksContextProvider>
                <HrTasks />
              </HrJobScreenAllTasksContextProvider>
            </>
          }
        />
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
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/"
          element={
            <NavigationContextProvider>
              <CandidateContextProvider>
                <CandidateTaskContextProvider>
                  <ValuesProvider>
                    <Teamlead />
                  </ValuesProvider>
                </CandidateTaskContextProvider>
              </CandidateContextProvider>
            </NavigationContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <CandidateTaskContextProvider>
                <ValuesProvider>
                  <Teamlead />
                </ValuesProvider>
              </CandidateTaskContextProvider>
            }
          />
        </Route>

        <Route
          path="/new-task-screen"
          element={
            <CandidateTaskContextProvider>
              <ValuesProvider>
                <CreateTaskScreen />
              </ValuesProvider>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/create-task"
          element={
            <CandidateTaskContextProvider>
              <ValuesProvider>
                <Index />
              </ValuesProvider>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/create-task/create-new-team/"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true}>
                <ValuesProvider>
                  <CreateTeam />
                </ValuesProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/team-screen-member/:id/team-members"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    <TeamScreenMembers />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/team-screen-member/:id/team-tasks"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    <TeamScreenTasks />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/team-issues"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThreadScreen />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/issue-inprogress"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/issue-completed"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/issue-resolved"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} hideSearchBar={true}>
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route path="*" element={<ErrorPage />} />
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
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/"
          element={
            <NavigationContextProvider>
              <CandidateContextProvider>
                <CandidateTaskContextProvider>
                  <ValuesProvider>
                    <Teamlead isGrouplead={true} />
                  </ValuesProvider>
                </CandidateTaskContextProvider>
              </CandidateContextProvider>
            </NavigationContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <CandidateTaskContextProvider>
                <ValuesProvider>
                  <Teamlead isGrouplead={true} />
                </ValuesProvider>
              </CandidateTaskContextProvider>
            }
          />
        </Route>

        <Route
          path="/new-task-screen"
          element={
            <CandidateTaskContextProvider>
              <ValuesProvider>
                <CreateTaskScreen isGrouplead={true} />
              </ValuesProvider>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/grouplead-tasks"
          element={
            <NavigationContextProvider>
              <CandidateContextProvider>
                <CandidateTaskContextProvider>
                  <ValuesProvider>
                    <GroupLeadTask />
                  </ValuesProvider>
                </CandidateTaskContextProvider>
              </CandidateContextProvider>
            </NavigationContextProvider>
          }
        />

        <Route
          path="/create-task"
          element={
            <CandidateTaskContextProvider>
              <ValuesProvider>
                <Index isGrouplead={true} />
              </ValuesProvider>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/create-task/create-new-team/"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} isGrouplead={true}>
                <ValuesProvider>
                  <CreateTeam />
                </ValuesProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/team-screen-member/:id/team-members"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                teamleadView={true}
                hideSearchBar={true}
                isGrouplead={true}
              >
                <TeamProvider>
                  <ValuesProvider>
                    <TeamScreenMembers />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/team-screen-member/:id/team-tasks"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                teamleadView={true}
                hideSearchBar={true}
                isGrouplead={true}
              >
                <TeamProvider>
                  <ValuesProvider>
                    <TeamScreenTasks />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/team-issues"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                teamleadView={true}
                hideSearchBar={true}
                isGrouplead={true}
              >
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThreadScreen />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/issue-inprogress"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                teamleadView={true}
                hideSearchBar={true}
                isGrouplead={true}
              >
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/issue-completed"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                teamleadView={true}
                hideSearchBar={true}
                isGrouplead={true}
              >
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route
          path="/team-screen-member/:id/issue-resolved"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout
                teamleadView={true}
                hideSearchBar={true}
                isGrouplead={true}
              >
                <TeamProvider>
                  <ValuesProvider>
                    {/* create a component here */}
                    <TeamThread />
                  </ValuesProvider>
                </TeamProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/user-tasks"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true} isGrouplead={true}>
                <TaskScreen
                  candidateAfterSelectionScreen={true}
                  assignedProject={assignedProjects}
                  showBackBtn={true}
                  loadProjects={true}
                  isGrouplead={true}
                />
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />
        <Route path="*" element={<ErrorPage />} />
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
        <Route
          path="/"
          element={
            <NavigationContextProvider>
              <CandidateJobsContextProvider>
                <JobContextProvider>
                  <ProvertionPeriod>
                    <CandidateHomeScreen
                      setHired={setCandidateHired}
                      setAssignedProjects={setAssignedProjects}
                      setCandidateShortListed={setCandidateShortListed}
                      setshorlistedJob={setshorlistedJob}
                    />
                  </ProvertionPeriod>
                </JobContextProvider>
              </CandidateJobsContextProvider>
            </NavigationContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <NavigationContextProvider>
                <JobContextProvider>
                  <CandidateJobsContextProvider>
                    <ProvertionPeriod>
                      <CandidateHomeScreen />
                    </ProvertionPeriod>
                  </CandidateJobsContextProvider>
                </JobContextProvider>
              </NavigationContextProvider>
            }
          />
        </Route>

        <Route path="/jobs">
          <Route
            index
            element={
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <JobScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            path=":jobTitle"
            element={
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <SingleJobScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            exact
            path="c/research-associate"
            element={
              <ProvertionPeriod>
                <ResearchAssociatePage />
              </ProvertionPeriod>
            }
          />
          <Route
            exact
            path="c/employee"
            element={
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <EmployeeJobScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            exact
            path="c/intern"
            element={
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <InternJobScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            }
          />
          <Route
            exact
            path="c/freelancer"
            element={
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <FreelancerJobScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            }
          />
        </Route>

        <Route
          path="/logout"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <ProvertionPeriod>
                  <Logout />
                </ProvertionPeriod>
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
        <Route
          path="/alerts"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <ProvertionPeriod>
                  <AlertScreen />
                </ProvertionPeriod>
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
        <Route
          path="/user"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <ProvertionPeriod>
                  <UserScreen candidateSelected={false} />
                </ProvertionPeriod>
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />

        <Route
          path="/applied"
          element={
            <NavigationContextProvider>
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <AppliedScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            </NavigationContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <NavigationContextProvider>
                <JobContextProvider>
                  <CandidateJobsContextProvider>
                    <ProvertionPeriod>
                      <AppliedScreen />
                    </ProvertionPeriod>
                  </CandidateJobsContextProvider>
                </JobContextProvider>
              </NavigationContextProvider>
            }
          />
        </Route>

        <Route
          path="/apply/job/:id"
          element={
            <NewApplicationContextProvider>
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <ProvertionPeriod>
                    <JobApplicationScreen />
                  </ProvertionPeriod>
                </CandidateJobsContextProvider>
              </JobContextProvider>
            </NewApplicationContextProvider>
          }
        >
          <Route
            path=":section"
            element={
              <NewApplicationContextProvider>
                <JobContextProvider>
                  <CandidateJobsContextProvider>
                    <ProvertionPeriod>
                      <JobApplicationScreen />
                    </ProvertionPeriod>
                  </CandidateJobsContextProvider>
                </JobContextProvider>
              </NewApplicationContextProvider>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <ProvertionPeriod>
              <ErrorPage />
            </ProvertionPeriod>
          }
        />
      </Routes>
    );
  }

  // CANDIDATE PAGE
  return candidateHired || currentUser.candidateIsHired ? (
    <Routes>
      <Route
        path="/team-screen-member/:id/team-tasks"
        element={
          <NavigationContextProvider>
            <CandidateTaskContextProvider>
              <TeamCandidateProvider>
                <CandidateValuesProvider>
                  <JobLandingLayout user={currentUser} afterSelection={true}>
                    <TeamScreenTasksCandidate />
                  </JobLandingLayout>
                </CandidateValuesProvider>
              </TeamCandidateProvider>
            </CandidateTaskContextProvider>
          </NavigationContextProvider>
        }
      />
      <Route
        path="/team-screen-member/:id/team-members"
        element={
          <NavigationContextProvider>
            <CandidateTaskContextProvider>
              <TeamCandidateProvider>
                <CandidateValuesProvider>
                  <JobLandingLayout user={currentUser} afterSelection={true}>
                    <TeamScreenMembersCandidate />
                  </JobLandingLayout>
                </CandidateValuesProvider>
              </TeamCandidateProvider>
            </CandidateTaskContextProvider>
          </NavigationContextProvider>
        }
      />
      <Route
        path="/team-screen-member/:id/team-issues"
        element={
          <NavigationContextProvider>
            <CandidateTaskContextProvider>
              <TeamCandidateProvider>
                <CandidateValuesProvider>
                  <JobLandingLayout user={currentUser} afterSelection={true}>
                    <TeamScreenThreadCandidate />
                  </JobLandingLayout>
                </CandidateValuesProvider>
              </TeamCandidateProvider>
            </CandidateTaskContextProvider>
          </NavigationContextProvider>
        }
      />
      <Route
        path="/"
        element={
          <NavigationContextProvider>
            <CandidateTaskContextProvider>
              <CandidateJobsContextProvider>
                <JobContextProvider>
                  <CandidateValuesProvider>
                    {/* <PageUnderConstruction showProductView={true} /> */}
                    <AfterSelectionScreen assignedProjects={assignedProjects} />
                  </CandidateValuesProvider>
                </JobContextProvider>
              </CandidateJobsContextProvider>
            </CandidateTaskContextProvider>
          </NavigationContextProvider>
        }
      >
        <Route
          path=":section"
          element={
            // <PageUnderConstruction showProductView={true} />
            <AfterSelectionScreen assignedProjects={assignedProjects} />
          }
        />
      </Route>
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  ) : candidateShortListed ? (
    <Routes>
      <Route
        path="/"
        element={
          <ResponsesContextProvider>
            <CandidateValuesProvider>
              <CandidateTranningScreen shorlistedJob={shorlistedJob} />
            </CandidateValuesProvider>
          </ResponsesContextProvider>
        }
      ></Route>
      <Route
        path="/traning"
        element={
          <ResponsesContextProvider>
            <candidateValuesProvider>
              <TraningProgress shorlistedJob={shorlistedJob} />
            </candidateValuesProvider>
          </ResponsesContextProvider>
        }
      />

      <Route
        path="/logout"
        element={
          <ResponsesContextProvider>
            <Logout />{" "}
          </ResponsesContextProvider>
        }
      />

      <Route
        path="*"
        element={
          <ResponsesContextProvider>
            <ErrorPage />
          </ResponsesContextProvider>
        }
      />
    </Routes>
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <NavigationContextProvider>
            <CandidateJobsContextProvider>
              <JobContextProvider>
                <CandidateHomeScreen
                  setHired={setCandidateHired}
                  setAssignedProjects={setAssignedProjects}
                  setCandidateShortListed={setCandidateShortListed}
                  setshorlistedJob={setshorlistedJob}
                />
              </JobContextProvider>
            </CandidateJobsContextProvider>
          </NavigationContextProvider>
        }
      >
        <Route
          path=":section"
          element={
            <NavigationContextProvider>
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <CandidateHomeScreen />
                </CandidateJobsContextProvider>
              </JobContextProvider>
            </NavigationContextProvider>
          }
        />
      </Route>

      <Route path="/jobs">
        <Route
          index
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <JobScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
        <Route
          path=":jobTitle"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <SingleJobScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
        <Route
          exact
          path="c/research-associate"
          element={<ResearchAssociatePage />}
        />
        <Route
          exact
          path="c/employee"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <EmployeeJobScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
        <Route
          exact
          path="c/intern"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <InternJobScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
        <Route
          exact
          path="c/freelancer"
          element={
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <FreelancerJobScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          }
        />
      </Route>

      <Route
        path="/logout"
        element={
          <JobContextProvider>
            <CandidateJobsContextProvider>
              <Logout />
            </CandidateJobsContextProvider>
          </JobContextProvider>
        }
      />
      <Route
        path="/alerts"
        element={
          <JobContextProvider>
            <CandidateJobsContextProvider>
              <AlertScreen />
            </CandidateJobsContextProvider>
          </JobContextProvider>
        }
      />
      <Route
        path="/user"
        element={
          <JobContextProvider>
            <CandidateJobsContextProvider>
              <UserScreen candidateSelected={false} />
            </CandidateJobsContextProvider>
          </JobContextProvider>
        }
      />

      <Route
        path="/applied"
        element={
          <NavigationContextProvider>
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <AppliedScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          </NavigationContextProvider>
        }
      >
        <Route
          path=":section"
          element={
            <NavigationContextProvider>
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <AppliedScreen />
                </CandidateJobsContextProvider>
              </JobContextProvider>
            </NavigationContextProvider>
          }
        />
      </Route>

      <Route
        path="/apply/job/:id"
        element={
          <NewApplicationContextProvider>
            <JobContextProvider>
              <CandidateJobsContextProvider>
                <JobApplicationScreen />
              </CandidateJobsContextProvider>
            </JobContextProvider>
          </NewApplicationContextProvider>
        }
      >
        <Route
          path=":section"
          element={
            <NewApplicationContextProvider>
              <JobContextProvider>
                <CandidateJobsContextProvider>
                  <JobApplicationScreen />
                </CandidateJobsContextProvider>
              </JobContextProvider>
            </NewApplicationContextProvider>
          }
        />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

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

export default App;
