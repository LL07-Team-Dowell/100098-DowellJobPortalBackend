import React, { useState } from 'react'
import NewAddTaskScreen from '../../CandidatePage/views/AfterSelectionScreen/NewAddTaskScreen'
import JobLandingLayout from '../../../layouts/CandidateJobLandingLayout/LandingLayout';
import AddIssueScreen from '../../TeamleadPage/views/AddIssueScreen/AddIssueScreen';
import AddTaskScreen from '../../TeamleadPage/views/AddTaskScreen/AddTaskScreen';
import { useCandidateTaskContext } from '../../../contexts/CandidateTasksContext';
import { useParams } from 'react-router-dom';

const AddPage = () => {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showAddIssueModal, setShowAddIssueModal] = useState(false);
    const { setUserTasks } = useCandidateTaskContext();
    const [allProjects, setAllProjects] = useState([]);
    const [candidateTeams, setCandidateTeams] = useState([]);
    const { id } = useParams();

    return (
        <div className=''>

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
        </div>
    )
}

export default AddPage
