import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenThreads.css";
import { FaRegComments } from "react-icons/fa";
// import { testThreadsToWorkWith } from "../../../../../../../utils/testData";
import userIcon from "./assets/user_icon.png";
import Modal from "../TeamThread/Modal";
import {
  fetchThread,
  postComment,
  updateSingleComment,
  updateThread,
} from "../../../../../../../services/threadServices";
import { toast } from "react-toastify";
import { getAllTeams } from "../../../../../../../services/createMembersTasks";
import Avatar from "react-avatar";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { formatDateForAPI } from "../../../../../../../helpers/helpers";
import LittleLoading from "../../../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import dateFormat, { masks } from "dateformat";

const TeamScreenThreads = ({ status, id }) => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });

  const [text, setText] = useState("");
  const [threads, setThreads] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [formVisibility, setFormVisibility] = useState({});
  const [commentsVisibility, setCommentsVisibility] = useState({});
  const [showModalStates, setShowModalStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingcmnt, setLoadingcmnt] = useState(false);
  const [completedThreads, setCompletedThreads] = useState([]);
  const [resolvedThreads, setResolvedThreads] = useState([]);
  const [inProgressThreads, setInProgressThreads] = useState([]);
  const [reducerComment, forceUpdate] = useReducer((x) => x + 1, 0);
  const [reducerStatus, forceUpdateStatus] = useReducer((x) => x + 1, 0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [updateCommentInput, setUpdateCommentInput] = useState("");
  const [updateComment, setUpdateComment] = useState([]);
  const [editIndex, setEditIndex] = useState();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    console.log("status", status);
  }, []);

  useEffect(() => {
    console.log("Hiiiiiiiiiiiiiiiiii");
    console.log(
      threads.filter(
        (thread) =>
          thread.current_status === "In progress" ||
          thread.current_status === "Created"
      )
    );
  }, [status]);

  // useEffect(() => {
  //   const documentId = id;
  //   console.log(documentId);
  //   setLoading(true);
  //   fetchThread(documentId).then((resp) => {
  //     console.log(resp.data.data);
  //     setThreads(resp.data.data);
  //     setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    const documentId = id;
    setLoading(true);
    fetchThread(documentId)
      .then((resp) => {
        const threads = resp.data.data;
        const sortedThreads = threads.reverse();
        setThreads(sortedThreads);

        const completedThreads = sortedThreads.filter(
          (thread) => thread.current_status === "Completed"
        );
        const resolvedThreads = sortedThreads.filter(
          (thread) => thread.current_status === "Resolved"
        );
        const inProgressThreads = sortedThreads.filter(
          (thread) =>
            thread.current_status === "In progress" ||
            thread.current_status === "Created"
        );

        setCompletedThreads(completedThreads);
        setResolvedThreads(resolvedThreads);
        setInProgressThreads(inProgressThreads);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [reducerComment, reducerStatus]);

  const addComment = async (text, id) => {
    console.log("addComment", text, id);
    setLoadingcmnt(true);

    const newComment = {
      created_by: currentUser.userinfo.username,
      comment: text,
      thread_id: id,
    };

    const updatedThreads = threads.slice();
    const foundThreadBeingUpadted = updatedThreads.find(
      (thread) => thread._id === id
    );

    try {
      const newCommentRes = (await postComment(newComment)).data;
      console.log(newCommentRes);
      // setThreads(updatedThreads);
      toast.success("Comment added successfully");
      setLoadingcmnt(false);
      setText("");

      const now = new Date();

      if (foundThreadBeingUpadted) {
        const newCommentToAddToState = {
          ...newComment,
          created_date: dateFormat(now),
          _id: newCommentRes.info.inserted_id,
        }
        foundThreadBeingUpadted.comments.data.push(newCommentToAddToState);
        setThreads(updatedThreads);

        const completedThreads = updatedThreads.filter(
          (thread) => thread.current_status === "Completed"
        );
        const resolvedThreads = updatedThreads.filter(
          (thread) => thread.current_status === "Resolved"
        );
        const inProgressThreads = updatedThreads.filter(
          (thread) =>
            thread.current_status === "In progress" ||
            thread.current_status === "Created"
        );

        setCompletedThreads(completedThreads);
        setResolvedThreads(resolvedThreads);
        setInProgressThreads(inProgressThreads);

        // switch to comments to show user new comment
        setCommentsVisibility((prevVisibility) => ({
          ...prevVisibility,
          [foundThreadBeingUpadted._id]: true,
        }))
        setFormVisibility((prevVisibility) => ({
          ...prevVisibility,
          [foundThreadBeingUpadted._id]: false,
        }))
      }
    } catch (error) {
      console.log(error);
      setLoadingcmnt(false);
      toast.error("An error occured while trying to add your comment. Please try again later");
    }
  };

  const handleUpdate = (comment) => {
    const document_id = comment._id;
    const created_by = comment.created_by;
    setLoadingcmnt(true);

    // Make an API request to update the comment
    updateSingleComment({
      comment: updateCommentInput,
      document_id: document_id,
      created_by: created_by,
    })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 200) {
          // Update the state with the edited comment
          setUpdateComment((prevComments) =>
            prevComments.map((c) =>
              c._id === comment._id ? { ...c, comment: updateCommentInput } : c
            )
          );
          setEditIndex(null);
          setLoadingcmnt(false);
        }
      })
      .catch((error) => {
        console.error("Failed to update comment:", error.message);
        setLoadingcmnt(false);
        toast.error("An error occured while trying to update your comment. Please try again later");
      });
  };

  const handleClose = (threadId) => {
    setShowModalStates((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: false,
    }));
  };

  const handleImageClick = (threadId) => {
    setShowModalStates((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: true,
    }));
  };

  const onSubmit = (e, id, submitBtnPressed = false) => {
    e.preventDefault();

    if (submitBtnPressed) return addComment(text, id);
    addComment(text, id);
  };

  const [teamdata, setTeamData] = useState([]);
  const filteredData = teamdata.filter((item) => item.admin_team === true);
  const [teamNamesArray, setTeamNamesArray] = useState([]);

  useEffect(() => {
    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        setTeamNamesArray(
          resp.data.response.data
            .filter((item) => item.admin_team === true)
            .map((data) => {
              return [{ name: data.team_name }, { id: data._id }];
            })
        );
        // console.log(
        //   resp.data.response.data
        //     .filter((item) => item.admin_team === true)
        //     .map((data) => {
        //       return [{ name: data.team_name }, { id: data._id }];
        //     })
        // );
      })
      .catch((e) => {
        console.log(e);
      });
  }, [status]);

  const updateStatus = (data) => {
    setStatusLoading(true);
    updateThread({
      document_id: data.document_id,
      current_status: data.status,
    }).then((resp) => {
      console.log(resp);
      if (resp.data.data.isSuccess) {
        setStatusLoading(false);
        toast.success("Thread Status Update");
        forceUpdateStatus();
      }
    });
  };

  const isTextareaDisabled = text.length === 0;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="wrapper">
      <div className="team-screen-threads">
        <div className="team-screen-thread-container">
          {status === "Completed" && (
            <>
              {React.Children.toArray(
                completedThreads.map((thread) => {
                  const assignedTeam = teamNamesArray.find(
                    (item) => item[1].id === thread.team_alerted_id
                  );
                  const assignedTeamName = assignedTeam
                    ? assignedTeam[0].name
                    : "N/A";
                  return (
                    <div className="team-screen-threads-card">
                      <div className="thread-card">
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
                        {showModalStates[thread._id] && (
                          <div
                            className="modal-cont"
                            onClick={() => handleClose(thread._id)}
                          >
                            <div className="modal_main_container">
                              <div
                                className="modal_content"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img src={thread.image} alt="thread" />
                                <button
                                  className="close-btn"
                                  onClick={() => handleClose(thread._id)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {thread.image ? (
                          <div className="image-container">
                            <img src={thread.image} alt="thread" />
                            <div className="view-btn-container">
                              <button
                                className="view-btn"
                                onClick={() => handleImageClick(thread._id)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
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
                          <div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                margin: "0.6rem",
                              }}
                            >
                              Status
                            </div>
                            <div className="team-screen-threads-progress">
                              <div className="progress">
                                <div
                                  data-tooltio-id="created"
                                  className={
                                    thread.current_status === "Created" ||
                                    "In progress"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="created"
                                  place="bottom"
                                  content="Status Created"
                                />
                              </div>
                              <div className="progress">
                                <div
                                  data-tooltip-id="inprogress"
                                  className={
                                    thread.current_status === "In progress" ||
                                    "Completed"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="inprogress"
                                  place="bottom"
                                  content="Status In Progress"
                                />
                              </div>
                              <div className="progress">
                                <div
                                  data-tooltip-id="completed"
                                  className={
                                    thread.current_status === "Completed"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="completed"
                                  place="bottom"
                                  content="Current Status Completed"
                                />
                              </div>
                              <div className="progress">
                                <div
                                  data-tooltip-id="resolved"
                                  className={
                                    thread.current_status === "Resolved"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                  onClick={(e) =>
                                    updateStatus({
                                      status: "Resolved",
                                      document_id: thread._id,
                                    })
                                  }
                                ></div>
                                <ReactTooltip
                                  id="resolved"
                                  place="bottom"
                                  content="Update Status Completed to Resolved"
                                />
                              </div>
                            </div>
                            <div className="comments-section">
                              <p className="comments">
                                <FaRegComments
                                  onClick={() =>
                                    {
                                      setFormVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: !prevVisibility[thread._id],
                                      }));
                                      setCommentsVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: false,
                                      }))
                                    }
                                  }
                                />
                                &bull;
                                <span
                                  onClick={() =>
                                    {
                                      setCommentsVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: !prevVisibility[thread._id],
                                      }));
                                      setFormVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: false,
                                      }));
                                    }
                                  }
                                >{`${thread.comments.data.length} Comment${
                                  thread.comments.data.length !== 1 ? "s" : ""
                                }`}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="comment-action">
                        {formVisibility[thread._id] && (
                          <form onSubmit={(e) => onSubmit(e, thread._id)}>
                            <h3
                              style={{
                                fontSize: "0.8rem",
                                marginBottom: "0.6rem",
                              }}
                            >
                              Add Comment
                            </h3>
                            <div className="text-area">
                              <textarea
                                value={text}
                                onChange={handleChange}
                                placeholder="Enter a comment..."
                              />
                              {text.length > 0 &&
                                (loadingcmnt ? (
                                  <LittleLoading />
                                ) : (
                                  <button
                                    disabled={isTextareaDisabled}
                                    className="button-comment"
                                    onClick={(e) =>
                                      onSubmit(e, thread._id, true)
                                    }
                                  >
                                    Comment
                                  </button>
                                ))}
                              {loading && <LittleLoading />}
                            </div>
                          </form>
                        )}
                        {commentsVisibility[thread._id] && (
                          <div className="new__comments">
                            <h3
                              style={{
                                fontSize: "0.8rem",
                                marginBottom: "0.6rem",
                                marginTop: "0.6rem",
                                color: "#005734",
                              }}
                            >
                              Comments
                            </h3>
                            {React.Children.toArray(
                              [...thread.comments.data].reverse().map((comment, index) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "1rem",
                                      marginBottom: "0.7rem",
                                      marginLeft: comment.parentId
                                        ? "2rem"
                                        : "0",
                                    }}
                                  >
                                    <div className="avatar-container">
                                      <Avatar
                                        name={thread.created_by}
                                        size={40}
                                        round
                                      />
                                    </div>
                                    <div className="candidate-comments-section">
                                      <p className="user-candidate">
                                        {comment.created_by}
                                        <p className="date">
                                          {dateFormat(comment.created_date)}
                                        </p>
                                      </p>
                                      {editIndex === index ? (
                                        <input
                                          className="comment-area"
                                          style={{
                                            paddingLeft: "5px",
                                            border: "1px solid black",
                                          }}
                                          defaultValue={comment.comment}
                                          onChange={(e) =>
                                            setUpdateCommentInput(
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        <input
                                          className="comment-area"
                                          defaultValue={comment.comment}
                                          disabled
                                        />
                                      )}
                                      {editIndex === index ? (
                                        <>
                                          <div className="button">
                                            {currentUser.portfolio_info[0]
                                              .username ===
                                              comment.created_by &&
                                              (loadingcmnt ? (
                                                <LittleLoading />
                                              ) : (
                                                <button
                                                  style={{
                                                    padding: "0.3rem 0.5rem",
                                                    cursor: "pointer",
                                                    backgroundColor: "#005734",
                                                    border: "none",
                                                    color: "white",
                                                    borderRadius: "5px",
                                                  }}
                                                  onClick={() =>
                                                    handleUpdate(comment)
                                                  }
                                                >
                                                  Update
                                                </button>
                                              ))}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="button">
                                            {currentUser.portfolio_info[0]
                                              .username ===
                                              comment.created_by && (
                                              <button
                                                style={{
                                                  padding: "0.3rem 0.5rem",
                                                  cursor: "pointer",
                                                  backgroundColor: "#005734",
                                                  border: "none",
                                                  color: "white",
                                                  borderRadius: "5px",
                                                }}
                                                onClick={() =>
                                                  setEditIndex(index)
                                                }
                                              >
                                                Edit
                                              </button>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {status === "In progress" && (
            <>
              {React.Children.toArray(
                inProgressThreads.map((thread) => {
                  const assignedTeam = teamNamesArray.find(
                    (item) => item[1].id === thread.team_alerted_id
                  );
                  const assignedTeamName = assignedTeam
                    ? assignedTeam[0].name
                    : "N/A";
                  return (
                    <div className="team-screen-threads-card">
                      <div className="thread-card">
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
                        {showModalStates[thread._id] && (
                          <div
                            className="modal-cont"
                            onClick={() => handleClose(thread._id)}
                          >
                            <div className="modal_main_container">
                              <div
                                className="modal_content"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img src={thread.image} alt="thread" />
                                <button
                                  className="close-btn"
                                  onClick={() => handleClose(thread._id)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {thread.image ? (
                          <div className="image-container">
                            <img src={thread.image} alt="thread" />
                            <div className="view-btn-container">
                              <button
                                className="view-btn"
                                onClick={() => handleImageClick(thread._id)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="team-screen-threads-container">
                          <p
                            style={{
                              color: "#005734",
                              fontSize: "1.3rem",
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
                          <div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                margin: "0.6rem",
                              }}
                            >
                              Status
                            </div>
                            <div className="team-screen-threads-progress">
                              <div className="progress">
                                <div
                                  data-tooltip-id="created"
                                  className={
                                    thread.current_status === "Created" ||
                                    "In progress"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="created"
                                  place="bottom"
                                  content="Current Status Created"
                                />
                              </div>
                              <div className="progress">
                                {currentUser.portfolio_info[0].username ===
                                  thread.created_by &&
                                thread.current_status === "In progress" ? (
                                  <div
                                    data-tooltip-id="inprogress"
                                    className={
                                      thread.current_status === "In progress"
                                        ? "active-thread-btn"
                                        : "threads-btn"
                                    }
                                    onClick={(e) =>
                                      updateStatus({
                                        status: "In progress",
                                        document_id: thread._id,
                                      })
                                    }
                                  ></div>
                                ) : (
                                  <div
                                    data-tooltip-id="inprogress"
                                    className={
                                      thread.current_status === "In progress"
                                        ? "active-thread-btn"
                                        : "threads-btn"
                                    }
                                    onClick={() =>
                                      toast.info(
                                        "Only Assigned team to issue can update this status"
                                      )
                                    }
                                  ></div>
                                )}
                                <ReactTooltip
                                  id="inprogress"
                                  place="bottom"
                                  content="Update Status Inprogress to Completed"
                                />
                              </div>
                              <div className="progress">
                                {currentUser.portfolio_info[0].username ===
                                  thread.created_by &&
                                thread.current_status === "Completed" ? (
                                  <div
                                    data-tooltip-id="completed"
                                    className={
                                      thread.current_status === "Completed"
                                        ? "active-thread-btn"
                                        : "threads-btn"
                                    }
                                    onClick={(e) =>
                                      updateStatus({
                                        status: "Completed",
                                        document_id: thread._id,
                                      })
                                    }
                                  ></div>
                                ) : (
                                  <div
                                    data-tooltip-id="completed"
                                    className={
                                      thread.current_status === "Completed"
                                        ? "active-thread-btn"
                                        : "threads-btn"
                                    }
                                    onClick={() =>
                                      toast.info(
                                        "Only Assigned team to issue can update this status"
                                      )
                                    }
                                  ></div>
                                )}
                                <ReactTooltip
                                  id="completed"
                                  place="bottom"
                                  content="Update Status Inprogress to Completed"
                                />
                              </div>
                              <div className="progress">
                                {currentUser.portfolio_info[0].username ===
                                  thread.created_by &&
                                thread.current_status === "Resolved" ? (
                                  <div
                                    data-tooltip-id="resolved"
                                    className={
                                      thread.current_status === "Resolved"
                                        ? "active-thread-btn"
                                        : "threads-btn"
                                    }
                                    onClick={(e) =>
                                      updateStatus({
                                        status: "Resolved",
                                        document_id: thread._id,
                                      })
                                    }
                                  ></div>
                                ) : (
                                  <div
                                    data-tooltip-id="resolved"
                                    className={
                                      thread.current_status === "Resolved"
                                        ? "active-thread-btn"
                                        : "threads-btn"
                                    }
                                    onClick={() =>
                                      toast.info(
                                        "Wait for Assigned team to issue to update completed status"
                                      )
                                    }
                                  ></div>
                                )}
                                <ReactTooltip
                                  id="resolved"
                                  place="bottom"
                                  content="Update Status Completed to Resolve"
                                />
                              </div>
                            </div>
                            <div className="comments-section">
                              <p className="comments">
                                <FaRegComments
                                  onClick={() => 
                                    {
                                      setFormVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: !prevVisibility[thread._id],
                                      }))
                                      setCommentsVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: false,
                                      }))
                                    }
                                  }
                                />
                                &bull;
                                <span
                                  onClick={() => 
                                    {
                                      setCommentsVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: !prevVisibility[thread._id],
                                      }))
                                      setFormVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: false,
                                      }));
                                    }
                                  }
                                >{`${thread.comments.data.length} Comment${
                                  thread.comments.data.length !== 1 ? "s" : ""
                                }`}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="comment-action">
                          {formVisibility[thread._id] && (
                            <form onSubmit={(e) => onSubmit(e, thread._id)}>
                              <h3
                                style={{
                                  fontSize: "0.8rem",
                                  marginBottom: "0.6rem",
                                }}
                              >
                                Add Comment
                              </h3>
                              <div className="text-area">
                                <textarea
                                  value={text}
                                  onChange={handleChange}
                                  placeholder="Enter a comment..."
                                />
                                {text.length > 0 &&
                                  (loadingcmnt ? (
                                    <LittleLoading />
                                  ) : (
                                    <button
                                      disabled={isTextareaDisabled}
                                      className="button-comment"
                                      onClick={(e) =>
                                        onSubmit(e, thread._id, true)
                                      }
                                    >
                                      Comment
                                    </button>
                                  ))}
                                {loading && <LittleLoading />}
                              </div>
                            </form>
                          )}
                          {commentsVisibility[thread._id] && (
                            <div className="new__comments">
                              <h3
                                style={{
                                  fontSize: "0.8rem",
                                  marginBottom: "0.6rem",
                                  marginTop: "0.6rem",
                                  color: "#005734",
                                }}
                              >
                                Comments
                              </h3>
                              {React.Children.toArray(
                                [...thread.comments.data].reverse().map((comment, index) => {
                                  return (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "1rem",
                                        marginBottom: "0.7rem",
                                        marginLeft: comment.parentId
                                          ? "2rem"
                                          : "0",
                                      }}
                                    >
                                      <div className="avatar-container">
                                        <Avatar
                                          name={thread.created_by}
                                          size={40}
                                          round
                                        />
                                      </div>
                                      <div className="candidate-comments-section">
                                        <p className="user-candidate">
                                          {comment.created_by}
                                          <p className="date">
                                            {dateFormat(comment.created_date)}
                                          </p>
                                        </p>
                                        {editIndex === index ? (
                                          <input
                                            className="comment-area"
                                            style={{
                                              paddingLeft: "5px",
                                              border: "1px solid black",
                                            }}
                                            defaultValue={comment.comment}
                                            onChange={(e) =>
                                              setUpdateCommentInput(
                                                e.target.value
                                              )
                                            }
                                          />
                                        ) : (
                                          <input
                                            className="comment-area"
                                            defaultValue={comment.comment}
                                            disabled
                                          />
                                        )}
                                        {editIndex === index ? (
                                          <>
                                            <div className="button">
                                              {currentUser.portfolio_info[0]
                                                .username ===
                                                comment.created_by &&
                                                (loadingcmnt ? (
                                                  <LittleLoading />
                                                ) : (
                                                  <button
                                                    style={{
                                                      padding: "0.3rem 0.5rem",
                                                      cursor: "pointer",
                                                      backgroundColor:
                                                        "#005734",
                                                      border: "none",
                                                      color: "white",
                                                      borderRadius: "5px",
                                                    }}
                                                    onClick={() =>
                                                      handleUpdate(comment)
                                                    }
                                                  >
                                                    Update
                                                  </button>
                                                ))}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="button">
                                              {currentUser.portfolio_info[0]
                                                .username ===
                                                comment.created_by && (
                                                <button
                                                  style={{
                                                    padding: "0.3rem 0.5rem",
                                                    cursor: "pointer",
                                                    backgroundColor: "#005734",
                                                    border: "none",
                                                    color: "white",
                                                    borderRadius: "5px",
                                                  }}
                                                  onClick={() =>
                                                    setEditIndex(index)
                                                  }
                                                >
                                                  Edit
                                                </button>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {status === "Resolved" && (
            <>
              {React.Children.toArray(
                resolvedThreads.map((thread) => {
                  const assignedTeam = teamNamesArray.find(
                    (item) => item[1].id === thread.team_alerted_id
                  );
                  const assignedTeamName = assignedTeam
                    ? assignedTeam[0].name
                    : "N/A";
                  return (
                    <div className="team-screen-threads-card">
                      <div className="thread-card">
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
                        {showModalStates[thread._id] && (
                          <div
                            className="modal-cont"
                            onClick={() => handleClose(thread._id)}
                          >
                            <div className="modal_main_container">
                              <div
                                className="modal_content"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img src={thread.image} alt="thread" />
                                <button
                                  className="close-btn"
                                  onClick={() => handleClose(thread._id)}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {thread.image ? (
                          <div className="image-container">
                            <img src={thread.image} alt="thread" />
                            <div className="view-btn-container">
                              <button
                                className="view-btn"
                                onClick={() => handleImageClick(thread._id)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="team-screen-threads-container">
                          <p
                            style={{
                              color: "#005734",
                              fontSize: "1.3rem",
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
                          <div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                margin: "0.6rem",
                              }}
                            >
                              Status
                            </div>
                            <div className="team-screen-threads-progress">
                              <div className="progress">
                                <div
                                  data-tooltip-id="created"
                                  className={
                                    thread.current_status === "Created" ||
                                    "In progress"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="created"
                                  place="bottom"
                                  content=" Status Created"
                                />
                              </div>
                              <div className="progress">
                                <div
                                  data-tooltip-id="progress"
                                  className={
                                    thread.current_status === "In progress" ||
                                    "Completed"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="progress"
                                  place="bottom"
                                  content=" Status In Progress"
                                />
                              </div>
                              <div className="progress">
                                <div
                                  data-tooltip-id="completed"
                                  className={
                                    thread.current_status === "Completed" ||
                                    "Resolved"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="completed"
                                  place="bottom"
                                  content="Status Completed"
                                />
                              </div>
                              <div className="progress">
                                <div
                                  data-tooltip-id="resolved"
                                  className={
                                    thread.current_status === "Resolved"
                                      ? "active-thread-btn"
                                      : "threads-btn"
                                  }
                                ></div>
                                <ReactTooltip
                                  id="resolved"
                                  place="bottom"
                                  content="Current Status Resolved"
                                />
                              </div>
                            </div>
                            <div className="comments-section">
                              <p className="comments">
                                <FaRegComments
                                  onClick={() => 
                                    {
                                      setFormVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: !prevVisibility[thread._id],
                                      }))
                                      setCommentsVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: false,
                                      }))
                                    }
                                  }
                                />
                                &bull;
                                <span
                                  onClick={() =>
                                    {
                                      setCommentsVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: !prevVisibility[thread._id],
                                      }))
                                      setFormVisibility((prevVisibility) => ({
                                        ...prevVisibility,
                                        [thread._id]: false,
                                      }))
                                    }
                                  }
                                >{`${thread.comments.data.length} Comment${
                                  thread.comments.data.length !== 1 ? "s" : ""
                                }`}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="comment-action">
                        {formVisibility[thread._id] && (
                          <form onSubmit={(e) => onSubmit(e, thread._id)}>
                            <h3
                              style={{
                                fontSize: "0.8rem",
                                marginBottom: "0.6rem",
                              }}
                            >
                              Add Comment
                            </h3>
                            <div className="text-area">
                              <textarea
                                value={text}
                                onChange={handleChange}
                                placeholder="Enter a comment..."
                              />
                              {text.length > 0 &&
                                (loadingcmnt ? (
                                  <LittleLoading />
                                ) : (
                                  <button
                                    disabled={isTextareaDisabled}
                                    className="button-comment"
                                    onClick={(e) =>
                                      onSubmit(e, thread._id, true)
                                    }
                                  >
                                    Comment
                                  </button>
                                ))}
                              {loading && <LittleLoading />}
                            </div>
                          </form>
                        )}
                        {commentsVisibility[thread._id] && (
                          <div className="new__comments">
                            <h3
                              style={{
                                fontSize: "0.8rem",
                                marginBottom: "0.6rem",
                                marginTop: "0.6rem",
                                color: "#005734",
                              }}
                            >
                              Comments
                            </h3>
                            {React.Children.toArray(
                              [...thread.comments.data].reverse().map((comment, index) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "1rem",
                                      marginBottom: "0.7rem",
                                      marginLeft: comment.parentId
                                        ? "2rem"
                                        : "0",
                                    }}
                                  >
                                    <div className="avatar-container">
                                      <Avatar
                                        name={thread.created_by}
                                        size={40}
                                        round
                                      />
                                    </div>
                                    <div className="candidate-comments-section">
                                      <p className="user-candidate">
                                        {comment.created_by}
                                        <p className="date">
                                          {dateFormat(comment.created_date)}
                                        </p>
                                      </p>
                                      {editIndex === index ? (
                                        <input
                                          className="comment-area"
                                          style={{
                                            paddingLeft: "5px",
                                            border: "1px solid black",
                                          }}
                                          defaultValue={comment.comment}
                                          onChange={(e) =>
                                            setUpdateCommentInput(
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        <input
                                          className="comment-area"
                                          defaultValue={comment.comment}
                                          disabled
                                        />
                                      )}
                                      {editIndex === index ? (
                                        <>
                                          <div className="button">
                                            {currentUser.portfolio_info[0]
                                              .username ===
                                              comment.created_by &&
                                              (loadingcmnt ? (
                                                <LittleLoading />
                                              ) : (
                                                <button
                                                  style={{
                                                    padding: "0.3rem 0.5rem",
                                                    cursor: "pointer",
                                                    backgroundColor: "#005734",
                                                    border: "none",
                                                    color: "white",
                                                    borderRadius: "5px",
                                                  }}
                                                  onClick={() =>
                                                    handleUpdate(comment)
                                                  }
                                                >
                                                  Update
                                                </button>
                                              ))}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="button">
                                            {currentUser.portfolio_info[0]
                                              .username ===
                                              comment.created_by && (
                                              <button
                                                style={{
                                                  padding: "0.3rem 0.5rem",
                                                  cursor: "pointer",
                                                  backgroundColor: "#005734",
                                                  border: "none",
                                                  color: "white",
                                                  borderRadius: "5px",
                                                }}
                                                onClick={() =>
                                                  setEditIndex(index)
                                                }
                                              >
                                                Edit
                                              </button>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamScreenThreads;
