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

    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        console.log(resp.data.response.data);
        setCandidateTeams(
          resp.data.response.data.filter((team) =>
            team.members.includes(currentUser.userinfo.username)
          )
        );
        console.log(
          resp.data.response.data.filter((team) =>
            team.members.includes(currentUser.userinfo.username)
          )
        );
      })
      .catch((err) => {
        console.log('error occurred fetching teams');
      });
  }, []);

  return (
    <>
      {section === undefined ? (
        <>
          <JobLandingLayout
            user={currentUser}
            afterSelection={true}
            hideSideNavigation={showAddTaskModal}
          >
            {showAddTaskModal && (
              <AddTaskScreen
                teamMembers={[]}
                afterSelectionScreen={true}
                closeTaskScreen={() => setShowAddTaskModal(false)}
                updateTasks={setUserTasks}
                assignedProject={candidateAssignedProjects}
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
                assignedProject={candidateAssignedProjects}
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
