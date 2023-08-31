import React, { useEffect, useState } from 'react'
import { AiOutlineAim, AiOutlineCiCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import AddIssueScreen from '../../../../AddIssueScreen/AddIssueScreen';
import TeamScreenLinks from '../teamScreenLinks/teamScreenLinks';
import Navbar from '../../../component/Navbar';
import { useTeam } from '../../../context/Team';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { getAllTeams, getSingleTeam, getTeamTask } from '../../../../../../../services/createMembersTasks';
import CreateTask from '../createTask/createTask';
import AddIssueTeamLead from './AddIssueTeamLead';
import { getSettingUserProject } from '../../../../../../../services/hrServices';

const TeamThreadScreen = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(false);
    // states
    const { currentUser } = useCurrentUserContext()
    const { team, setteam } = useTeam()
    const [loading, setloading] = useState(false)
    const [detail, setdetail] = useState('in progress')
    const [tasks, setTasks] = useState([])
    const [addedNewTask, setAddedNewTask] = useState(true)
    const [candidateTeams, setCandidateTeams] = useState([]);
    const [showIssueForm, setShowIssueForm] = useState(false);

    // useEffect
    useEffect(() => {
        if (team?.members === undefined) {
            setloading(true)

            //   getAllTeams(currentUser.portfolio_info[0].org_id)
            //     .then(resp =>{ 
            //     setteam(resp.data.response.data.find(team => team["_id"] === id))
            //     setloading(false)})
            // .catch(err => console.log(err))

            // GET A SINGLE TEAM INSTEAD
            getSingleTeam(id)
                .then(resp => {
                    setteam(resp.data.response.data[0])
                    setloading(false)
                })
                .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        if (addedNewTask) {
            getTeamTask(id)
                .then(resp => {
                    // get all tasks and put it in tasks state
                    setTasks(resp.data.response.data)
                    console.log('response', resp.data.response.data)
                    setAddedNewTask(false)
                })
                .catch(err => {
                    console.log(err)
                    setAddedNewTask(false)
                })
        }
    }, [addedNewTask])

    useEffect(() => {
        Promise.all([
            getAllTeams(currentUser.portfolio_info[0].org_id),
            getSettingUserProject(),
        ]).then(res => {
            setCandidateTeams(
                res[0]?.data?.response?.data?.filter((team) =>
                    team?.members.includes(currentUser.userinfo.username)
                )
            );
        }).catch(err => {
            console.log('An error occured trying to fetch teams or projects for candidate');
        })
    }, []);

    const navigate = useNavigate(); // Initialize the useNavigate hook
    const navigateToIssueInProgress = () => {
        // Navigate to the specified route when clicked
        navigate(`/team-screen-member/${id}/issue-inprogress`);
    };

    const addIssue = () => {
        setShowIssueForm(!showIssueForm)
    }

    return (
        <div>
            {team?.team_name !== undefined ? <Navbar title={team?.team_name.toString()} removeButton={true} /> : null}
            <TeamScreenLinks id={id} />            {
                showIssueForm && (
                    <AddIssueTeamLead
                        afterSelectionScreen={true}
                        teamId={id}
                        candidateView={true}
                        teams={candidateTeams}
                        closeIssuesScreen={() => setShowIssueForm(false)}
                    />)
            }
            <br />
            <br />


            <div className="new__task__container">
                {/* <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1> */}
                <div style={{ position: "relative", display: "flex", gap: "3rem" }} className='child-task-create'>
                    <div style={{ marginTop: 30 }} className="Create_Team" onClick={addIssue}>
                        <div>
                            <div>
                                <AiOutlinePlusCircle
                                    className="icon"
                                    style={{ fontSize: "2rem" }}
                                />
                            </div>
                            <h4>Create New</h4>
                            <p>
                                Create, monitor and get quick feedback on issues encountered in our products.
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }} className="Create_Team" onClick={navigateToIssueInProgress}>

                        <div>
                            <div>
                                <AiOutlineAim
                                    className="icon"
                                    style={{ fontSize: "2rem" }}
                                />
                            </div>
                            <h4>View</h4>
                            <p>
                                View the progress on the resolution of issues raised by your team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TeamThreadScreen;
