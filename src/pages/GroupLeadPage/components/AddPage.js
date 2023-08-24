import React, { useEffect, useState } from 'react'
import NewAddTaskScreen from '../../CandidatePage/views/AfterSelectionScreen/NewAddTaskScreen'
import JobLandingLayout from '../../../layouts/CandidateJobLandingLayout/LandingLayout';
import AddIssueScreen from '../../TeamleadPage/views/AddIssueScreen/AddIssueScreen';
import AddTaskScreen from '../../TeamleadPage/views/AddTaskScreen/AddTaskScreen';
import { useCandidateTaskContext } from '../../../contexts/CandidateTasksContext';
import { useParams } from 'react-router-dom';
import { getAllTeams } from '../../../services/createMembersTasks';
import { useCurrentUserContext } from '../../../contexts/CurrentUserContext';
import { getSettingUserProject } from '../../../services/hrServices';

const AddPage = ({ assignedProjects }) => {
    const { currentUser } = useCurrentUserContext();
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showAddIssueModal, setShowAddIssueModal] = useState(false);
    const { setUserTasks } = useCandidateTaskContext();
    const [allProjects, setAllProjects] = useState([]);
    const [candidateTeams, setCandidateTeams] = useState([]);
    const [candidateAssignedProjects, setCandidateAssignedProjects] = useState([]);

    const { id } = useParams();
    useEffect(() => {
        if (assignedProjects?.length < 1) {
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
                    .filter((team) => team?.data_type === currentUser.portfolio_info[0].data_type)
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
                list.length < 1 ? []
                    :
                    list[0]?.project_list
            );
        }).catch(err => {
            console.log('An error occured trying to fetch teams or projects for candidate');
        })
    }, []);

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
