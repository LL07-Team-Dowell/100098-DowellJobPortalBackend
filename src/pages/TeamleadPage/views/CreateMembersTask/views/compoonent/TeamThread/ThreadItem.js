import styled from '@emotion/styled';
import React, { useEffect, useState, useReducer } from 'react';
import { FaRegComments } from 'react-icons/fa';
import { testThreadsToWorkWith } from "../../../../../../../utils/testData";
import Comment from '../../../../../../CandidatePage/views/TeamsScreen/components/addComment';
import ThreadComment from './ThreadComment';
import Modal from './Modal';
import { featchAllComment, fetchThread, updateSingleThread } from '../../../../../../../services/teamleadServices';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { getAllTeams } from '../../../../../../../services/createMembersTasks';
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { fetchTeamThreadsForAdmin } from '../../../../../../../services/adminServices';

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

.thread-subtitle {
  font-size: 0.8rem;
  color: #005734 !important;
  text-align: justify;
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
    width: 400px;
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content:space-around;
  }

  .team-screen-threads-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
    line-height: 2rem;
  }
  
  .team-screen-threads-container .title {
    font-size: 1.1rem;
    font-weight: 500;
    color: #005734;
    text-transform: capitalize;
  }

  .team-screen-threads-container p {
    font-size: 0.9rem;
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
  width: 450px;
  
}

.image-container img {
  width: 330px !important;
  height: 230px;
  object-fit: cover;
  margin: auto;
}

.view-btn-container {
  position: absolute;
  top: 50%;
  left: 36%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.image-container:hover .view-btn-container {
  opacity: 1;
}

.image-container:hover  img {
  opacity: 0.2;
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
  max-width: 90%;
  height: 90vh;
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

@media screen and (max-width:526px){
  .team-screen-threads-card{
    width: 100%;
  }
  .team-screen-threads{
    padding: 2rem 0;
  }
}

  
`

const ThreadItem = ({ status, isAdmin }) => {
  console.log(status);
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [threads, setThreads] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showModalStates, setShowModalStates] = useState({});
  const [completedThreads, setCompletedThreads] = useState([])
  const [resolvedThreads, setResolvedThreads] = useState([]);
  const [inProgressThreads, setInProgressThreads] = useState([]);

  //For loading state
  const [completedLoading, setCompletedLoading] = useState(false);
  const [inprogressLoading, setInprogressLoading] = useState(false);
  const [resolvedLoading, setResolvedLoading] = useState(false);

  const [reducerComment, forceUpdate] = useReducer(x => x + 1, 0)
  const [reducerStatus, forceUpdateStatus] = useReducer(x => x + 1, 0)


  console.log(threads);
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
  const [teamNamesArray, setTeamNamesArray] = useState([]);
  const nevigate = useNavigate();
  const filteredData = teamNamesArray.filter(item => item.admin_team === true);

  useEffect(() => {
    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        // console.log(resp.data.response.data);
        setTeamNamesArray(
          resp.data.response.data
            .filter((item) => item.admin_team === true)
            .map((data) => {
              return [{ name: data.team_name }, { id: data._id }];
            })
        );
        console.log(
          resp.data.response.data
            .filter((item) => item.admin_team === true)
            .map((data) => {
              return [{ name: data.team_name }, { id: data._id }];
            })
        );
      })
      .catch((e) => {
      });
  }, [status]);



  useEffect(() => {
    const documentId = id;
    console.log(documentId);
    setLoading(true);
    if (isAdmin) {
      fetchTeamThreadsForAdmin(documentId)
      .then((resp) => {
        console.log(resp);
        const threads = resp.data.data;
        const sortedThreads = threads.reverse()
        setThreads(sortedThreads)

        const completedThreads = sortedThreads.filter((thread) => thread.current_status == "Completed");
        const resolvedThreads = sortedThreads.filter((thread) => thread.current_status == "Resolved");
        const inProgressThreads = sortedThreads.filter((thread) => thread.current_status == "In progress" || thread.current_status === "Created" || thread.current_status === undefined);

        setCompletedThreads(completedThreads);
        setResolvedThreads(resolvedThreads);
        setInProgressThreads(inProgressThreads);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error occured while trying to fetch threads for admin');
        setLoading(false);
      });
      return
    }

    fetchThread(documentId)
      .then((resp) => {
        console.log(resp);
        const threads = resp.data.data;
        const sortedThreads = threads.reverse()
        setThreads(sortedThreads)

        const completedThreads = sortedThreads.filter((thread) => thread.current_status == "Completed");
        const resolvedThreads = sortedThreads.filter((thread) => thread.current_status == "Resolved");
        const inProgressThreads = sortedThreads.filter((thread) => thread.current_status == "In progress" || thread.current_status === "Created" || thread.current_status === undefined);

        setCompletedThreads(completedThreads);
        setResolvedThreads(resolvedThreads);
        setInProgressThreads(inProgressThreads);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [reducerComment, reducerStatus, undefined]);



  const updateStatus = (data) => {
    switch (data.status) {
      case "Resolved":
        setResolvedLoading(true);

      case "Completed":
        setCompletedLoading(true);

      case "In progress":
        setInprogressLoading(true);
    }

    updateSingleThread({
      document_id: data.document_id,
      current_status: data.status
    }).then((resp) => {
      console.log(resp);
      if (resp.data.data.isSuccess) {
        toast.success("Thread Status Update")
        setResolvedLoading(false)
        setCompletedLoading(false)
        setInprogressLoading(false)
        forceUpdateStatus();
      }
    })
  }

  const handleUpdateCommentState = (comment, threadId) => {
    const updatedThreads = threads.slice();
    const foundThreadBeingUpadted = updatedThreads.find(
      (thread) => thread._id === threadId
    );
    console.log(threads);

    if (foundThreadBeingUpadted) {
      foundThreadBeingUpadted.comments.data.unshift(comment);
      setThreads(updatedThreads);

      const completedThreads = updatedThreads.filter((thread) => thread.current_status == "Completed");
      const resolvedThreads = updatedThreads.filter((thread) => thread.current_status == "Resolved");
      const inProgressThreads = updatedThreads.filter((thread) => thread.current_status == "In progress" || thread.current_status === "Created" || thread.current_status === undefined);

      setCompletedThreads(completedThreads);
      setResolvedThreads(resolvedThreads);
      setInProgressThreads(inProgressThreads);
    }
  }

  const [isExpanded, setIsExpanded] = useState(false);

  // Define the maximum length for thread.thread before truncating
  const maxLength = 70;

  // Function to toggle the expansion state
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = () => { };
  if (loading) return <LoadingSpinner />

  return (
    <Wrapper>
      <div className="team-screen-threads">
        <div className="team-screen-thread-container">
          {
            status == "Completed" && <>
              {completedThreads.map((thread) => {
                const assignedTeam = teamNamesArray.find((item) => item[1].id === thread.team_alerted_id);
                const assignedTeamName = assignedTeam ? assignedTeam[0].name : 'N/A';

                return <div className="team-screen-threads-card" key={thread._id}>
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        width: "100%",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <p
                        style={{
                          backgroundColor:
                            thread.thread_type === "BUG"
                              ? "red"
                              : thread.thread_type === "SUGGESTION"
                                ? "green"
                                : null,
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          padding: "0.3rem 0.5rem",
                          borderRadius: "1.5rem",
                        }}
                      >
                        {thread.thread_type}
                      </p>
                    </div>
                    <div className="team-screen-threads-container">
                      <p
                        style={{
                          color: "#005734",
                          fontSize: "1.2rem",
                          fontWeight: "500",
                          marginBottom: "0",
                          textTransform: "capitalize",
                        }}
                      >
                        {thread.thread_title}
                      </p>
                      <div>
                        <p>Assigned to : {assignedTeamName}</p>
                        <p>Raised by : {thread.created_by}</p>
                      </div>
                      <p
                        style={{
                          color: "#005734",
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "0",
                          textTransform: "capitalize",
                        }}
                      >
                        <p>Details:</p>
                        <p style={{ color: "#005734" }}>{thread.thread}</p>
                        <br></br>
                        <p>Steps to Reproduce:</p>
                        <p style={{ color: "#005734" }}>
                          {thread.steps_to_reproduce_thread}
                        </p>
                        <br></br>
                        <p>Expected Behavior:</p>
                        <p style={{ color: "#005734" }}>
                          {thread.expected_product_behavior}
                        </p>
                        <br></br>
                        <p>Actual Behavior:</p>
                        <p style={{ color: "#005734" }}>
                          {thread.actual_product_behavior}
                        </p>
                        <br></br>
                      </p>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        Status
                      </div>
                      <div className="team-screen-threads-progress">

                        <div className="progress">
                          <div data-tooltio-id='created' className={thread.current_status == "Created" || "In progress" ? "active-thread-btn" : "threads-btn"}></div>
                          <ReactTooltip
                            id="created"
                            place="bottom"
                            content="Status Created"
                          />

                        </div>
                        <div className="progress">
                          <div data-tooltip-id='inprogress' className={thread.current_status == "In progress" || "Completed" ? "active-thread-btn" : "threads-btn"}></div>
                          <ReactTooltip
                            id="inprogress"
                            place="bottom"
                            content="Status In Progress"
                          />
                        </div>
                        <div className="progress">
                          <div data-tooltip-id='completed' className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"}></div>
                          <ReactTooltip
                            id="completed"
                            place="bottom"
                            content="Current Status Completed"
                          />
                        </div>
                        <div className="progress">
                          <div data-tooltip-id='resolved'>
                            {
                              currentUser.userinfo.username == thread.created_by ? <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"} onClick={(e) => updateStatus({ status: "Resolved", document_id: thread._id })}></div> : <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"} onClick={() => alert("You can't update the status")}></div>
                            }
                          </div>

                          <ReactTooltip
                            id="resolved"
                            place="bottom"
                            content="Uodate Status Completed to Resolved"
                          />
                        </div>
                      </div>
                      <div className="comments-section">
                        <p className="comments">
                          <FaRegComments onClick={handleSubmit} />
                          &bull;
                          <span onClick={() => handlCommentClick(thread._id)}>{thread?.comments.data.length} Comments</span>
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
                          forceUpdate={forceUpdate}
                          loading={loading}
                          // updateComments={(newComment) => {
                          //   const updatedThreads = threads.slice();
                          //   const foundThreadBeingUpadted = updatedThreads.find(
                          //     (thread) => thread._id === thread._id
                          //   );
                          //   if (foundThreadBeingUpadted) {
                          //     foundThreadBeingUpadted.comments.data.push(newComment);
                          //     setThreads(updatedThreads);
                          //   }
                          // }}

                          updateComments={(newComment) => handleUpdateCommentState(newComment, thread._id)}

                        />
                      )
                    }
                  </div>
                </div>
              })}
            </>
          }

          {
            status == "In progress" && <>
              {
                inProgressThreads.map((thread) => {
                  const assignedTeam = teamNamesArray.find((item) => item[1].id === thread.team_alerted_id);
                  const assignedTeamName = assignedTeam ? assignedTeam[0].name : 'N/A';

                  return <div className="team-screen-threads-card" key={thread._id}>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          width: "100%",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <p
                          style={{
                            backgroundColor:
                              thread.thread_type === "BUG"
                                ? "red"
                                : thread.thread_type === "SUGGESTION"
                                  ? "green"
                                  : null,
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "1.5rem",
                          }}
                        >
                          {thread.thread_type}
                        </p>
                      </div>
                      <div className="team-screen-threads-container">
                        <p
                          style={{
                            color: "#005734",
                            fontSize: "1.2rem",
                            fontWeight: "500",
                            marginBottom: "0",
                            textTransform: "capitalize",
                          }}
                        >
                          {thread.thread_title}
                        </p>
                        <div>
                          <p>Assigned to : {assignedTeamName}</p>
                          <p>Raised by : {thread.created_by}</p>
                        </div>
                        <p
                          style={{
                            color: "#005734",
                            fontSize: "1rem",
                            fontWeight: "500",
                            marginBottom: "0",
                            textTransform: "capitalize",
                          }}
                        >
                          <p>Details:</p>
                          <p style={{ color: "#005734" }}>{thread.thread}</p>
                          <br></br>
                          <p>Steps to Reproduce:</p>
                          <p style={{ color: "#005734" }}>
                            {thread.steps_to_reproduce_thread}
                          </p>
                          <br></br>
                          <p>Expected Behavior:</p>
                          <p style={{ color: "#005734" }}>
                            {thread.expected_product_behavior}
                          </p>
                          <br></br>
                          <p>Actual Behavior:</p>
                          <p style={{ color: "#005734" }}>
                            {thread.actual_product_behavior}
                          </p>
                          <br></br>
                        </p>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          }}
                        >
                          Status
                        </div>
                        <div className="team-screen-threads-progress">
                          <div className="progress">
                            <div className={thread.current_status == "Created" || "In progress" ? "active-thread-btn" : "threads-btn"} data-tooltip-id="created"></div>
                            <ReactTooltip
                              id="created"
                              place="bottom"
                              content="Current Status Created"
                            />
                          </div>
                          <div className="progress">
                            <div data-tooltip-id='inprogress' className={thread.current_status == "In progress" ? "active-thread-btn" : "threads-btn"} onClick={(e) => updateStatus({ status: "In progress", document_id: thread._id })}></div>
                            {
                              thread.current_status == "Created" ? <ReactTooltip
                                id="inprogress"
                                place="bottom"
                                content="Update Status Created to inprogress"
                              /> : <ReactTooltip
                                id="inprogress"
                                place="bottom"
                                content="Current Status inprogress"
                              />
                            }
                          </div>
                          <div className="progress">
                            {
                              currentUser.userinfo.username == thread.created_by && thread.current_status == "In progress" ? <div data-tooltip-id='completed' className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"} onClick={(e) => updateStatus({ status: "Completed", document_id: thread._id })}></div> : <div data-tooltip-id='completed' className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"} onClick={() => toast.warning("You can't update the status")}></div>
                            }
                            <ReactTooltip
                              id="completed"
                              place="bottom"
                              content="Update Status Inprogress to Completed"
                            />
                          </div>
                          <div className="progress">
                            <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"} data-tooltip-id='resolved' onClick={() => toast.warning("You can't update the status")}></div>
                            <ReactTooltip
                              id="resolved"
                              place="bottom"
                              content="Update Status Completed to Resolve"
                            />
                          </div>
                        </div>
                        <div className="comments-section">
                          <p className="comments">
                            <FaRegComments onClick={handleSubmit} />
                            &bull;
                            <span onClick={() => handlCommentClick(thread._id)}>{thread?.comments.data.length} Comments</span>
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
                            forceUpdate={forceUpdate}
                            loading={loading}
                            // updateComments={(newComment) => {
                            //   const updatedThreads = threads.slice();
                            //   const foundThreadBeingUpadted = updatedThreads.find(
                            //     (thread) => thread._id === thread._id
                            //   );
                            //   if (foundThreadBeingUpadted) {
                            //     foundThreadBeingUpadted.comments.data.push(newComment);
                            //     setThreads(updatedThreads);
                            //   }
                            // }}

                            updateComments={(newComment) => handleUpdateCommentState(newComment, thread._id)}

                          />
                        )
                      }
                    </div>
                  </div>

                }
                )
              }
            </>
          }

          {
            status == undefined && <>
              {
                inProgressThreads.map((thread) => {
                  const assignedTeam = teamNamesArray.find((item) => item[1].id === thread.team_alerted_id);
                  const assignedTeamName = assignedTeam ? assignedTeam[0].name : 'N/A';


                  return <div className="team-screen-threads-card" key={thread._id}>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          width: "100%",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <p
                          style={{
                            backgroundColor:
                              thread.thread_type === "BUG"
                                ? "red"
                                : thread.thread_type === "SUGGESTION"
                                  ? "green"
                                  : null,
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "1.5rem",
                          }}
                        >
                          {thread.thread_type}
                        </p>
                      </div>
                      <div className="team-screen-threads-container">
                        <p
                          style={{
                            color: "#005734",
                            fontSize: "1.2rem",
                            fontWeight: "500",
                            marginBottom: "0",
                            textTransform: "capitalize",
                          }}
                        >
                          {thread.thread_title}
                        </p>
                        <div>
                          <p>Assigned to : {assignedTeamName}</p>
                          <p>Raised by : {thread.created_by}</p>
                        </div>
                        <p
                          style={{
                            color: "#005734",
                            fontSize: "1rem",
                            fontWeight: "500",
                            marginBottom: "0",
                            textTransform: "capitalize",
                          }}
                        >
                          <p>Details:</p>
                          <p style={{ color: "#005734" }}>{thread.thread}</p>
                          <br></br>
                          <p>Steps to Reproduce:</p>
                          <p style={{ color: "#005734" }}>
                            {thread.steps_to_reproduce_thread}
                          </p>
                          <br></br>
                          <p>Expected Behavior:</p>
                          <p style={{ color: "#005734" }}>
                            {thread.expected_product_behavior}
                          </p>
                          <br></br>
                          <p>Actual Behavior:</p>
                          <p style={{ color: "#005734" }}>
                            {thread.actual_product_behavior}
                          </p>
                          <br></br>
                        </p>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          }}
                        >
                          Status
                        </div>
                        <div className="team-screen-threads-progress">
                          <div className="progress">
                            <div className={thread.current_status == "Created" || "In progress" ? "active-thread-btn" : "threads-btn"} data-tooltip-id="created"></div>
                            <ReactTooltip
                              id="created"
                              place="bottom"
                              content="Current Status Created"
                            />
                          </div>
                          <div className="progress">
                            <div data-tooltip-id='inprogress' className={thread.current_status == "In progress" ? "active-thread-btn" : "threads-btn"} onClick={(e) => updateStatus({ status: "In progress", document_id: thread._id })}></div>
                            {
                              thread.current_status == "Created" && <ReactTooltip
                                id="inprogress"
                                place="bottom"
                                content="Update Status Created to inprogress"
                              />
                            }

                          </div>
                          <div className="progress">
                            {
                              currentUser.userinfo.username == thread.created_by && thread.current_status == "In progress" ? <div data-tooltip-id='completed' className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"} onClick={(e) => updateStatus({ status: "Completed", document_id: thread._id })}></div> : <div data-tooltip-id='completed' className={thread.current_status == "Completed" ? "active-thread-btn" : "threads-btn"} onClick={() => toast.warning("You can't update the status")}></div>
                            }
                            <ReactTooltip
                              id="completed"
                              place="bottom"
                              content="Update Status Inprogress to Completed"
                            />
                          </div>
                          <div className="progress">
                            <div className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"} data-tooltip-id='resolved' onClick={() => toast.warning("You can't update the status")}></div>
                            <ReactTooltip
                              id="resolved"
                              place="bottom"
                              content="Update Status Completed to Resolve"
                            />
                          </div>
                        </div>
                        <div className="comments-section">
                          <p className="comments">
                            <FaRegComments onClick={handleSubmit} />
                            &bull;
                            <span onClick={() => handlCommentClick(thread._id)}>{thread?.comments.data.length} Comments</span>
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
                            forceUpdate={forceUpdate}
                            loading={loading}
                            // updateComments={(newComment) => {
                            //   const updatedThreads = threads.slice();
                            //   const foundThreadBeingUpadted = updatedThreads.find(
                            //     (thread) => thread._id === thread._id
                            //   );
                            //   if (foundThreadBeingUpadted) {
                            //     foundThreadBeingUpadted.comments.data.push(newComment);
                            //     setThreads(updatedThreads);
                            //   }
                            // }}
                            updateComments={(newComment) => handleUpdateCommentState(newComment, thread._id)}

                          />
                        )
                      }
                    </div>
                  </div>

                }
                )
              }
            </>
          }

          {
            status == "Resolved" && <>
              {resolvedThreads.map((thread) => {
                const assignedTeam = teamNamesArray.find((item) => item[1].id === thread.team_alerted_id);
                const assignedTeamName = assignedTeam ? assignedTeam[0].name : 'N/A';

                return <div className="team-screen-threads-card" key={thread._id}>

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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        width: "100%",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <p
                        style={{
                          backgroundColor:
                            thread.thread_type === "BUG"
                              ? "red"
                              : thread.thread_type === "SUGGESTION"
                                ? "green"
                                : null,
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          padding: "0.3rem 0.5rem",
                          borderRadius: "1.5rem",
                        }}
                      >
                        {thread.thread_type}
                      </p>
                    </div>
                    <div className="team-screen-threads-container">
                      <p
                        style={{
                          color: "#005734",
                          fontSize: "1.2rem",
                          fontWeight: "500",
                          marginBottom: "0",
                          textTransform: "capitalize",
                        }}
                      >
                        {thread.thread_title}
                      </p>
                      <div>
                        <p>Assigned to : {assignedTeamName}</p>
                        <p>Raised by : {thread.created_by}</p>
                      </div>
                      <p
                        style={{
                          color: "#005734",
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "0",
                          textTransform: "capitalize",
                        }}
                      >
                        <p>Details:</p>
                        <p style={{ color: "#005734" }}>{thread.thread}</p>
                        <br></br>
                        <p>Steps to Reproduce:</p>
                        <p style={{ color: "#005734" }}>
                          {thread.steps_to_reproduce_thread}
                        </p>
                        <br></br>
                        <p>Expected Behavior:</p>
                        <p style={{ color: "#005734" }}>
                          {thread.expected_product_behavior}
                        </p>
                        <br></br>
                        <p>Actual Behavior:</p>
                        <p style={{ color: "#005734" }}>
                          {thread.actual_product_behavior}
                        </p>
                        <br></br>
                      </p>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        Status
                      </div>
                      <div className="team-screen-threads-progress">
                        <div className="progress">
                          <div data-tooltip-id='created' className={thread.current_status == "Created" || "In progress" ? "active-thread-btn" : "threads-btn"}></div>
                          <ReactTooltip
                            id="created"
                            place="bottom"
                            content=" Status Created"
                          />
                        </div>
                        <div className="progress">
                          <div data-tooltip-id='progress' className={thread.current_status == "In progress" ? "active-thread-btn" : "active-thread-btn"}></div>
                          <ReactTooltip
                            id="progress"
                            place="bottom"
                            content=" Status In Progress"
                          />
                        </div>
                        <div className="progress">
                          <div data-tooltip-id='completed' className={thread.current_status == "Completed" ? "active-thread-btn" : "active-thread-btn"}></div>
                          <ReactTooltip
                            id="completed"
                            place="bottom"
                            content="Status Completed"
                          />
                        </div>
                        <div className="progress">
                          <div data-tooltip-id='resolved' className={thread.current_status == "Resolved" ? "active-thread-btn" : "threads-btn"}></div>
                          <ReactTooltip
                            id="resolved"
                            place="bottom"
                            content="Current Status Resolved"
                          />
                        </div>
                      </div>
                      <div className="comments-section">
                        <p className="comments">
                          <FaRegComments onClick={handleSubmit} />
                          &bull;
                          <span onClick={() => handlCommentClick(thread._id)}>{thread?.comments.data.length} Comments</span>
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
                          forceUpdate={forceUpdate}
                          loading={loading}
                          // updateComments={(newComment) => {
                          //   const updatedThreads = threads.slice();
                          //   const foundThreadBeingUpadted = updatedThreads.find(
                          //     (thread) => thread._id === thread._id
                          //   );
                          //   if (foundThreadBeingUpadted) {
                          //     foundThreadBeingUpadted.comments.data.push(newComment);
                          //     setThreads(updatedThreads);
                          //   }
                          // }}

                          updateComments={(newComment) => handleUpdateCommentState(newComment, thread._id)}

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
    </Wrapper >


  )
}

export default ThreadItem;
