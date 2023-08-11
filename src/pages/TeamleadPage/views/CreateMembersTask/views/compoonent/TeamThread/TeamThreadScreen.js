import React, { useEffect, useState } from 'react'
import { AiOutlineAim, AiOutlineCiCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import AddIssueScreen from '../../../../AddIssueScreen/AddIssueScreen';
import TeamScreenLinks from '../teamScreenLinks/teamScreenLinks';
import Navbar from '../../../component/Navbar';
import { useTeam } from '../../../context/Team';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { getSingleTeam, getTeamTask } from '../../../../../../../services/createMembersTasks';
import CreateTask from '../createTask/createTask';
import AddIssueTeamLead from './AddIssueTeamLead';

const TeamThreadScreen = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(false);
    // states
    const { currentUser } = useCurrentUserContext()
    const { team, setteam } = useTeam()
    const [loading, setloading] = useState(false)
    const [detail, setdetail] = useState('in progress')
    const [showCreatTask, setShowCreateTask] = useState(false)
    const [tasks, setTasks] = useState([])
    const [addedNewTask, setAddedNewTask] = useState(true)
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

    const navigate = useNavigate(); // Initialize the useNavigate hook
    const navigateToIssueInProgress = () => {
        // Navigate to the specified route when clicked
        navigate(`/team-screen-member/${id}/issue-inprogress`);
    };

    const addIssue = () => {
        setIssue(!issue)
    }

    return (
        <div>
            {team?.team_name !== undefined ? <Navbar title={team?.team_name.toString()} removeButton={true} addTeamTask={true} handleAddTeamTaskFunction={() => setShowCreateTask(true)} addTeamTaskTitle='Add Task' /> : null}
            <TeamScreenLinks id={id} />            {
                issue && (
                    <AddIssueTeamLead
                        afterSelectionScreen={true}
                        closeIssuesScreen={() => setIssue(false)}
                        teamId={id}
                    />)
            }
            <br />
            <br />
            <div className="new__task__container">
                {/* <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1> */}
                <div style={{ position: "relative", display: "flex", gap: "3rem" }} >
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
                                Lorem, ipsum dolor sit amet adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae
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
                                Lorem, ipsum dolor sit amet adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {showCreatTask && <CreateTask id={id} setTasks={setTasks} members={team.members} team={team} unShowCreateTask={() => setShowCreateTask(false)} />}

        </div>
    )
}

export default TeamThreadScreen;
