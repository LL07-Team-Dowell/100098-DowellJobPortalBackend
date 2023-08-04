import React, { useState } from 'react'
import { AiOutlineAim, AiOutlineCiCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import AddIssueScreen from '../../../../AddIssueScreen/AddIssueScreen';

const TeamThreadScreen = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(false)

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
            {
                issue && (
                    <AddIssueScreen
                        afterSelectionScreen={true}
                        closeIssuesScreen={() => setIssue(false)}
                        teamId ={id}
                    />)
            }
            <div className="new__task__container">
                <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1>
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
        </div>
    )
}

export default TeamThreadScreen;
