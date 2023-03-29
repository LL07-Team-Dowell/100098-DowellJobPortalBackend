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

import "./style.css";


const AfterSelectionScreen = ({ assignedProject }) => {
    const { currentUser } = useCurrentUserContext();
    console.log(currentUser);
   
    const [ showAddTaskModal, setShowAddTaskModal ] = useState(false);
    const { section } = useNavigationContext();
    const { setUserTasks } = useCandidateTaskContext();
    
    return <>
        {
            section === undefined || section === "tasks" ? <>
                <JobLandingLayout user={currentUser} afterSelection={true} hideSideNavigation={showAddTaskModal}>
                {
                    showAddTaskModal && <AddTaskScreen teamMembers={[]} afterSelectionScreen={true} closeTaskScreen={() => setShowAddTaskModal(false)} updateTasks={setUserTasks} assignedProject={assignedProject} />
                }

                <div className="candidate__After__Selection__Screen">
                    <TaskScreen candidateAfterSelectionScreen={true} handleAddTaskBtnClick={() => setShowAddTaskModal(true)} assignedProject={assignedProject}/>
                </div>
                </JobLandingLayout>
            </> : 

            section === "teams" ?

            <TeamsScreen /> :

            section === "user" ? <>
            
            <UserScreen candidateSelected={true} />
            
            </> :
            
            <ErrorPage />
        }
    </>
}

export default AfterSelectionScreen;
