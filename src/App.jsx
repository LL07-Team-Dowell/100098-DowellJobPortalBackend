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
import { useState } from "react";
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

function App() {
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(true);
  const [candidateHired, setCandidateHired] = useState(false);
  const [candidateShortListed, setCandidateShortListed] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [shorlistedJob, setshorlistedJob] = useState([]);

  console.log(shorlistedJob);
  useDowellLogin(setCurrentUser, setLoading);
  useTitle("Dowell Job Portal");

  if (loading) return <LoadingPage />;

  // console.log("CURRENT USER", currentUser);

  // // NO LOGGED IN USER VIEW
  // if (!currentUser) {
  //   return (
  //     <Routes>
  //       <Route
  //         path="/apply/job/:id"
  //         element={
  //           <NewApplicationContextProvider>
  //             <JobApplicationScreen />
  //           </NewApplicationContextProvider>
  //         }
  //       />

  //       <Route path="/" element={<CandidateHomeScreen />} />

  //       <Route path="/jobs">
  //         <Route index element={<JobScreen />} />
  //         <Route path=":jobTitle" element={<SingleJobScreen />} />
  //         <Route
  //           exact
  //           path="c/research-associate"
  //           element={<ResearchAssociatePage />}
  //         />
  //         <Route exact path="c/employee" element={<EmployeeJobScreen />} />
  //         <Route exact path="c/intern" element={<InternJobScreen />} />
  //         <Route exact path="c/freelancer" element={<FreelancerJobScreen />} />
  //       </Route>
  //       <Route path="*" element={<CandidateHomeScreen />} />
  //     </Routes>
  //   );
  // }

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
    currentUser.settings_for_profile_info.profile_info[0].Role ===
      testingRoles.accountRole
  ) {
    return (
      <Routes>
        <Route path="/logout" element={<Logout />} />

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
    currentUser.settings_for_profile_info &&
    currentUser.settings_for_profile_info.profile_info[0].Role ===
      testingRoles.subAdminRole
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
        {/* <Route
          path="/settings"
          element={
            <JobContextProvider>
              <AdminSettings />
            </JobContextProvider>
          }
        /> */}
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
    currentUser.portfolio_info &&
    currentUser.portfolio_info.length > 0 &&
    currentUser.portfolio_info.find(
      (item) => item.product === "Team Management"
    ) &&
    currentUser.portfolio_info.find(
      (item) => item.product === "Team Management"
    ).member_type === "owner" &&
    !currentUser.settings_for_profile_info?.fakeSuperUserInfo
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
          path="/user"
          element={
            <JobContextProvider>
              <AdminUserScreen />
            </JobContextProvider>
          }
        />
        <Route
          path="/report"
          element={
            <JobContextProvider>
              <AdminReports />
            </JobContextProvider>
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
    currentUser.settings_for_profile_info.profile_info[0].Role ===
      testingRoles.hrRole
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
    currentUser.settings_for_profile_info.profile_info[0].Role ===
      testingRoles.teamLeadRole
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
                  <CreateTeam/>
                </ValuesProvider>
              </StaffJobLandingLayout>
            </CandidateTaskContextProvider>
          }
        />

        <Route
          path="/team-screen-member/:id/team-members"
          element={
            <CandidateTaskContextProvider>
              <StaffJobLandingLayout teamleadView={true}>
                <TeamProvider>
              <ValuesProvider>
                  <TeamScreenMembers/>
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
              <StaffJobLandingLayout teamleadView={true}>
                <TeamProvider>
              <ValuesProvider>
                  <TeamScreenTasks/>
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

  // CANDIDATE PAGE
  return candidateHired ? (
    <Routes>
      <Route
        path="/"
        element={
          <NavigationContextProvider>
            <CandidateTaskContextProvider>
              <CandidateJobsContextProvider>
                <JobContextProvider>
                  <AfterSelectionScreen assignedProjects={assignedProjects} />
                </JobContextProvider>
              </CandidateJobsContextProvider>
            </CandidateTaskContextProvider>
          </NavigationContextProvider>
        }
      >
        <Route path=":section" element={<AfterSelectionScreen />} />
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
            <CandidateTranningScreen shorlistedJob={shorlistedJob} />
          </ResponsesContextProvider>
        }
      ></Route>
      <Route
        path="/traning"
        element={
          <ResponsesContextProvider>
            <TraningProgress shorlistedJob={shorlistedJob} />
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

export default App;
