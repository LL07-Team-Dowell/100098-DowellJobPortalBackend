import { useEffect, useState } from "react";
import { useCandidateTaskContext } from "../../../../contexts/CandidateTasksContext";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useNavigationContext } from "../../../../contexts/NavigationContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { getCandidateTask } from "../../../../services/candidateServices";
import ErrorPage from "../../../ErrorPage/ErrorPage";
import AddTaskScreen from "../../../TeamleadPage/views/AddTaskScreen/AddTaskScreen";
import TaskScreen from "../../../TeamleadPage/views/TaskScreen/TaskScreen";
import TeamsScreen from "../TeamsScreen/TeamsScreen";
import UserScreen from "../UserScreen/UserScreen";
import NewAddTaskScreen from "./NewAddTaskScreen";
import AddIssueScreen from "../../../TeamleadPage/views/AddIssueScreen/AddIssueScreen";
import InvoicePayment from "../../../../common/screens/InvoicePayment/InvoicePayment";

import "./style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllTeams } from "../../../../services/createMembersTasks";
import { getSettingUserProject } from "../../../../services/hrServices";
import UsersLogsScreen from "../../../../common/screens/UserLogsScreen/UserLogsScreen";
import InternalJobApply from "../../../../common/screens/InternalJobApply/InternalJobApply";
import WorklogsLandingPage from "../WorklogsLandingPage/WorklogsLandingPage";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";

const AfterSelectionScreen = ({ assignedProjects }) => {
  const { currentUser } = useCurrentUserContext();

  const { id } = useParams();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const { section } = useNavigationContext();
  const { setUserTasks } = useCandidateTaskContext();
  const [candidateTeams, setCandidateTeams] = useState([]);
  const [candidateAssignedProjects, setCandidateAssignedProjects] = useState(
    []
  );
  const [allProjects, setAllProjects] = useState([]);
  const [logRequestDate, setLogRequestDate] = useState(null);
  const { state } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (assignedProjects.length < 1) {
      setCandidateAssignedProjects(
        currentUser?.candidateAssignmentDetails?.assignedProjects
          ? currentUser?.candidateAssignmentDetails?.assignedProjects
          : []
      );
    } else {
      setCandidateAssignedProjects(assignedProjects);
    }

    Promise.all([
      getAllTeams(currentUser.portfolio_info[0].org_id),
      getSettingUserProject(),
    ])
      .then((res) => {
        setCandidateTeams(
          res[0]?.data?.response?.data
            ?.filter((team) =>
              team?.members.includes(currentUser.userinfo.username)
            )
            .filter(
              (team) =>
                team?.data_type === currentUser.portfolio_info[0].data_type
            )
        );

        const list = res[1]?.data
          ?.filter(
            (project) =>
              project?.data_type === currentUser.portfolio_info[0].data_type &&
              project?.company_id === currentUser.portfolio_info[0].org_id &&
              project.project_list &&
              project.project_list.every(
                (listing) => typeof listing === "string"
              )
          )
          .reverse();

        setAllProjects(list.length < 1 ? [] : list[0]?.project_list);
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "An error occured trying to fetch teams or projects for candidate"
        );
      });
  }, []);

  useEffect(() => {
    if (!state || !state?.log_request_date) return;

    const validDatePassed = new Date(state?.log_request_date);
    if (typeof validDatePassed == "Invalid Date") return;

    setLogRequestDate(state?.log_request_date);
    setShowAddTaskModal(true);

    // RESET STATE TO PREVENT ADD TASK MODAL FROM POPPING UP AFTER EVERY RELOAD
    window.history.replaceState({}, "/100098-DowellJobPortal/#/");
  }, [state]);

  return (
    <>
      {section === undefined ? (
        <>
          <JobLandingLayout
            user={currentUser}
            afterSelection={true}
            hideSideNavigation={showAddTaskModal || showAddIssueModal}
          >
            {showAddTaskModal && (
              <AddTaskScreen
                teamMembers={[]}
                afterSelectionScreen={true}
                closeTaskScreen={() => setShowAddTaskModal(false)}
                updateTasks={setUserTasks}
                assignedProject={allProjects}
                logRequestDate={logRequestDate}
              />
            )}
            {showAddIssueModal && (
              <AddIssueScreen
                afterSelectionScreen={true}
                closeIssuesScreen={() => setShowAddIssueModal(false)}
                teamId={id}
                candidateView={true}
                teams={candidateTeams}
                id={id}
              />
            )}
            <NewAddTaskScreen
              handleAddTaskBtnClick={() => setShowAddTaskModal(true)}
              handleAddIssueBtnClick={() => setShowAddIssueModal(true)}
            />
          </JobLandingLayout>
        </>
      ) : section === "task" ? (
        <>
          <JobLandingLayout
            user={currentUser}
            afterSelection={true}
            hideSideNavigation={showAddTaskModal}
          >
            <div className="candidate__After__Selection__Screen">
              <TitleNavigationBar 
                className={'candidate__Back__Btnnn__Wrapp'}
                handleBackBtnClick={() => navigate(-1)}
                buttonWrapClassName={'candidate__Back__Btnnn'}
              />
              <UsersLogsScreen />
              {/* <WorklogsLandingPage /> */}
            </div>
          </JobLandingLayout>
        </>
      ) : section === "worklogs" ? (
        <JobLandingLayout user={currentUser} afterSelection={true}>
          {/* <UsersLogsScreen /> */}
          <WorklogsLandingPage />
        </JobLandingLayout>
      ) : section === "teams" ? (
        <TeamsScreen />
      ) : section === "user" ? (
        <>
          <UserScreen candidateSelected={true} />
        </>
      ) : section === "invoice" ? (
        <JobLandingLayout user={currentUser} afterSelection={true}>
          <InvoicePayment />
        </JobLandingLayout>
      ) : section === "internal-job-apply" ? (
        <JobLandingLayout user={currentUser} afterSelection={true}>
          <InternalJobApply />
        </JobLandingLayout>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default AfterSelectionScreen;
