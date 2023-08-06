import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { FaRegComments } from 'react-icons/fa';
import { testThreadsToWorkWith } from "../../../../../../../utils/testData";
import Comment from '../../../../../../CandidatePage/views/TeamsScreen/components/addComment';
import ThreadComment from './ThreadComment';
import Modal from './Modal';
import { featchAllComment, fetchThread } from '../../../../../../../services/teamleadServices';
import { useParams } from 'react-router-dom';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { getAllTeams } from '../../../../../../../services/createMembersTasks';

const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: left !important;


.outside-containre{
    width: 80%;
    margin: auto;
}

.header-items {
    display: flex;
    width: 20rem;
    justify-content: space-around;
    margin-top: 1rem;
}

.team-screen-threads {
    width: 80%;
    margin: auto;
    padding: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .team-screen-threads-card {
    height: 100%;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }

  .thread-card{
    width: 400px;
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
  }
  
  .team-screen-threads-details {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2% 3%;
  }
  
  .team-screen-thread-container{
    flex-direction: row;
    flex-wrap: wrap;

  }

  .team-screen-threads-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    line-height: 2rem;
  }
  
  .team-screen-threads-container p {
    font-size: 1rem;
    /* font-weight: 600; */
    color: #000;
  }
  
  .team-screen-threads-progress {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
  }
  
  .progress {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .progress p {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .threads-created{
    width: 50%;
    height: 50%;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .threads-btn {
    width: 40%;
    height: 40%;
    padding: 1rem;
    border-radius: 50%;
    cursor:pointer;
    background-color: red;
    cursor: pointer;
  }

  .active-thread-btn{
    width: 40%;
    height: 40%;
    padding: 1rem;
    border-radius: 50%;
    cursor:pointer;
    background-color: #005734;
    cursor: pointer;
  }
  
  .comments-section {
    cursor: pointer;
  }
  
  .comments {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .comments span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #838383;
  }
  
  .comments-section svg {
    font-size: 1.8rem;
  }

  /* Styling for the image hover effect */
.image-container {
  position: relative;
  cursor: pointer;
}

.image-container img {
  width: 100%;
  height: auto;
}

.view-btn-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.image-container:hover .view-btn-container {
  opacity: 1;
}

.view-btn {
  padding: 8px 16px;
  background-color: #005734;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

// /* Styling for the modal */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  max-height: 80%;
}

.modal-content img {
  width: 1000px;
  height: auto;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  background-color: #005734;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

  
`

const ThreadItem = ({ status }) => {
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  const { id } = useParams();

  const [threads, setThreads] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showModalStates, setShowModalStates] = useState({});

  //Filter Based on status
  const completedThreads = threads.filter((thread) => thread.current_status === status);
  const resolvedThreads = threads.filter((thread) => thread.current_status == "Resolved");

  const inProgressThreads = threads.filter(
    (thread) => thread.current_status === "In progress" || thread.current_status === "Created" || thread.current_status == undefined
  );

  // Function to handle opening the modal for a specific thread
  const handleImageClick = (threadId) => {
    setShowModalStates((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: true,
    }));
  };

  // Function to handle opening the modal for a specific thread
  const handlCommentClick = (threadId) => {
    setShowComment((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: !prevShowModalStates[threadId], // Toggle the value for the specific threadId
    }));
  };

  // Function to handle closing the modal for a specific thread
  const handleClose = (threadId) => {
    setShowModalStates((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: false,
    }));
  };

  //Get All Teams
  const [teamdata, setTeamData] = useState([])
  const filteredData = teamdata.filter(item => item.admin_team === true);




  //get all teams
  const getTeams = async () => {
    try {
      const id = currentUser.portfolio_info[0].org_id;

      // Call the getAllTeams function with the id
      const response = await getAllTeams(id);

      // Assuming the response contains the teams data in the data field
      const teamsData = response.data.response.data;
      setTeamData(teamsData)
    } catch (error) {
      console.error('Error in your function:', error);
    }
  };

  // Call your function to use the data received from getAllTeams
  getTeams();


  //Fetch Comment 
  // const fetchComment = async (document_id) => {
  //   const data = { document_id };
  //   try {
  //     const response = await featchAllComment(data);
  //     console.log(response);
  //     console.log('Comment fetched successfully:', response.data);
  //     // Do something with the responseData if needed.
  //   } catch (error) {
  //     console.log(error);
  //     console.error('Failed to fetch comment:', error.message);
  //     // Handle the error or display an error message to the user.
  //   }
  // };

  // useEffect(() => {
  //   const documentId = document_id;
  //   fetchComment(documentId);
  // }, []);

  //Fetch Thread 
  const fetchData = async () => {
    try {
      const documentId = id;
      const response = await fetchThread(documentId);
      setThreads(response.data.data)
      // Do something with the responseData if needed.
    } catch (error) {
      console.error('Failed to fetch comment:', error.message);
      // Handle the error or display an error message to the user.
    }
  };

  // Call the function
  fetchData();





  const handleSubmit = () => { };


  return (
    <Wrapper>
      <div className="team-screen-threads">
        <div className="team-screen-thread-container">
          {
            status == "Completed" && <>
              {completedThreads.map((thread) => (
                <div className="team-screen-threads-card" key={thread._id}>
                  <div className="thread-card">
                    {showModalStates[thread._id] && (
                      <Modal imageUrl={thread.image} handleClose={() => handleClose(thread._id)} />
                    )}
                    <div className="image-container">
                      {thread.image && (
                        <img src={thread.image} alt="thread" onClick={() => handleImageClick(thread._id)} />
                      )}
                      {thread.image && (
                        <div className="view-btn-container">
                          <button className="view-btn" onClick={() => handleImageClick(thread._id)}>
                            View
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="team-screen-threads-container">
                      <p>{thread.thread}</p>
                      <div>
                        <p>Assigned to :</p>
                        <p>Raised by : {thread.created_by}</p>
                      </div>
                      <div className="team-screen-threads-progress">
                        <div className="progress">
                          <p>Created</p>
                          <div className={thread.current_status == "Created" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>In progress</p>
                          <div className={thread.current_status == "In progress" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>Completed</p>
                          <div className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>Resolved</p>
                          <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                      </div>
                      <div className="comments-section">
                        <p className="comments">
                          <FaRegComments onClick={handleSubmit} />
                          &bull;
                          <span onClick={() => handlCommentClick(thread._id)}>10 Comments</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="comment-action">
                    {
                      showComment[thread._id] && (
                        <ThreadComment
                          comments={thread.comments.data}
                          user={thread.created_by}
                          threadId={thread._id}
                          commentInput="comment-input"
                        />
                      )
                    }
                  </div>
                </div>
              ))}
            </>
          }
          {
            status == "In progress" || status == undefined && <>
              {inProgressThreads.map((thread) => {
                const assignedTeam = filteredData.find((item) => item._id === thread.team_alerted_id);
                const assignedTeamName = assignedTeam ? assignedTeam.team_name : 'N/A';

                return (<div className="team-screen-threads-card" key={thread._id}>
                  <div className="thread-card">
                    {showModalStates[thread._id] && (
                      <Modal imageUrl={thread.image} handleClose={() => handleClose(thread._id)} />
                    )}
                    <div className="image-container">
                      {thread.image && (
                        <img src={thread.image} alt="thread" onClick={() => handleImageClick(thread._id)} />
                      )}
                      {thread.image && (
                        <div className="view-btn-container">
                          <button className="view-btn" onClick={() => handleImageClick(thread._id)}>
                            View
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="team-screen-threads-container">
                      <p>{thread.thread}</p>
                      <div>
                        <p>Assigned to: {assignedTeamName}</p>
                        <p>Raised by : {thread.created_by}</p>
                      </div>
                      <div className="team-screen-threads-progress">
                        <div className="progress">
                          <p>Created</p>
                          <div className={thread.current_status == "Created" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>In progress</p>
                          <div className={thread.current_status == "In progress" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>Completed</p>
                          <div className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>Resolved</p>
                          <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                      </div>
                      <div className="comments-section">
                        <p className="comments">
                          <FaRegComments onClick={handleSubmit} />
                          &bull;
                          <span onClick={() => handlCommentClick(thread._id)}>10 Comments</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="comment-action">
                    {
                      showComment[thread._id] && (
                        <ThreadComment
                          comments={thread.comments.data}
                          user={thread.created_by}
                          threadId={thread._id}
                          commentInput="comment-input"
                        />
                      )
                    }
                  </div>
                </div>)

              })}
            </>
          }

          {
            status == "Resolved" && <>
              {resolvedThreads.map((thread) => {
                const assignedTeam = filteredData.find((item) => item._id === thread.team_alerted_id);
                const assignedTeamName = assignedTeam ? assignedTeam.team_name : 'N/A';

                <div className="team-screen-threads-card" key={thread._id}>

                  <div className="thread-card">
                    {showModalStates[thread._id] && (
                      <Modal imageUrl={thread.image} handleClose={() => handleClose(thread._id)} />
                    )}
                    <div className="image-container">
                      {thread.image && (
                        <img src={thread.image} alt="thread" onClick={() => handleImageClick(thread._id)} />
                      )}
                      {thread.image && (
                        <div className="view-btn-container">
                          <button className="view-btn" onClick={() => handleImageClick(thread._id)}>
                            View
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="team-screen-threads-container">
                      <p>{thread.thread}</p>
                      <div>
                        <p>Assigned to: {assignedTeamName}</p>
                        <p>Raised by : {thread.created_by}</p>
                      </div>
                      <div className="team-screen-threads-progress">
                        <div className="progress">
                          <p>Created</p>
                          <div className={thread.current_status == "Created" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>In progress</p>
                          <div className={thread.current_status == "In progress" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>Completed</p>
                          <div className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                        <div className="progress">
                          <p>Resolved</p>
                          <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"}></div>
                        </div>
                      </div>
                      <div className="comments-section">
                        <p className="comments">
                          <FaRegComments onClick={handleSubmit} />
                          &bull;
                          <span onClick={() => handlCommentClick(thread._id)}>10 Comments</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="comment-action">
                    {
                      showComment[thread._id] && (
                        <ThreadComment
                          comments={thread.comments[0].comment}
                          user={thread.comments[0].user}
                          threadId={thread._id}
                          document_id={id}
                          commentInput="comment-input"
                        />
                      )
                    }
                  </div>
                </div>
              })}
            </>
          }

        </div>
      </div>
    </Wrapper>


  )
}

export default ThreadItem;
