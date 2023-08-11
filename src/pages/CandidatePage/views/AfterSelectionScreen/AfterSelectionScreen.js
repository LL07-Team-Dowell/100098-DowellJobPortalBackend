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

import "./style.css";
import { useParams } from "react-router-dom";
import { getAllTeams } from "../../../../services/createMembersTasks";
import { getSettingUserProject } from "../../../../services/hrServices";

const AfterSelectionScreen = ({ assignedProjects }) => {
  const { currentUser } = useCurrentUserContext();
  console.log(currentUser);

  const { id } = useParams();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const { section } = useNavigationContext();
  const { setUserTasks } = useCandidateTaskContext();
  const [candidateTeams, setCandidateTeams] = useState([]);
  const [ candidateAssignedProjects, setCandidateAssignedProjects ] = useState([]);
  const [ allProjects, setAllProjects ] = useState([]);

  useEffect(() => {
    if (assignedProjects.length < 1) {
      setCandidateAssignedProjects(
        currentUser?.candidateAssignmentDetails?.assignedProjects ? 
          currentUser?.candidateAssignmentDetails?.assignedProjects
        :
        []
      )
    } else {
      setCandidateAssignedProjects(assignedProjects)
    }

    Promise.all([
      getAllTeams(currentUser.portfolio_info[0].org_id),
      getSettingUserProject(),
    ]).then(res => {
      setCandidateTeams(
        res[0]?.data?.response?.data?.filter((team) =>
          team?.members.includes(currentUser.userinfo.username)
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
      ).reverse();

      setAllProjects(
        list.length < 1  ? []
        :
        list[0]?.project_list
      );
    }).catch(err => {
      console.log('An error occured trying to fetch teams or projects for candidate');
    })
  }, []);

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
              />
            )}
            {showAddIssueModal && (
              <AddIssueScreen
                afterSelectionScreen={true}
                closeIssuesScreen={() => setShowAddIssueModal(false)}
                teamId={id}
                candidateView={true}
                teams={candidateTeams}
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
              <TaskScreen
                candidateAfterSelectionScreen={true}
                assignedProject={allProjects}
              />
            </div>
          </JobLandingLayout>
        </>
      ) : section === "teams" ? (
        <TeamsScreen />
      ) : section === "user" ? (
        <>
          <UserScreen candidateSelected={true} />
        </>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default AfterSelectionScreen;
