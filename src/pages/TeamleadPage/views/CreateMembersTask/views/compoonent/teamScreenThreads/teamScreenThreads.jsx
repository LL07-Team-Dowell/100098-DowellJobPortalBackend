import React, { useState, useEffect } from "react";
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
  updateComment,
} from "../../../../../../../services/threadServices";
import { toast } from "react-toastify";
import { getAllTeams } from "../../../../../../../services/createMembersTasks";
import Avatar from "react-avatar";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import { set } from "date-fns";

const TeamScreenThreads = ({ status, id }) => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });

  const [text, setText] = useState("");
  const [threads, setThreads] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  // const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyingComment, setReplyingComment] = useState({
    commentId: null,
    threadId: null,
    text: "",
  });
  const [formVisibility, setFormVisibility] = useState({});
  const [commentsVisibility, setCommentsVisibility] = useState({});
  const [showModalStates, setShowModalStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingcmnt, setLoadingcmnt] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  // handle reply input change
  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setReplyingComment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  useEffect(() => {
    const documentId = id;
    console.log(documentId);
    setLoading(true);
    fetchThread(documentId).then((resp) => {
      console.log(resp.data.data);
      setThreads(resp.data.data);
      setLoading(false);
    });
  }, []);

  const addComment = async (text, id) => {
    console.log("addComment", text, id);
    setLoadingcmnt(true);
    try {
      const updatedThreads = await postComment({
        created_by: currentUser.userinfo.username,
        comment: text,
        thread_id: id,
        _id: crypto.randomUUID(),
      });
      console.log(updatedThreads);
      toast.success("Comment added successfully");
      setText("");
      setLoadingcmnt(false);
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const editComment = (text, commentId, threadId) => {
    // const updatedThreads = threads.slice();

    // const threadToUpdate = updatedThreads.find(thread => thread._id === threadId);
    // if (!threadToUpdate) return

    // const updatedComments = threadToUpdate.comments.slice();
    // const commentToEdit = updatedComments.find(comment => comment._id === commentId);
    // if (!commentToEdit) return

    // commentToEdit.comment = text;

    // threadToUpdate.comments = updatedComments;

    const updatedThreads = threads.map((thread) => {
      if (thread._id === threadId) {
        const updatedComments = thread.comments.map((comment) =>
          comment._id === commentId ? { ...comment, comment: text } : comment
        );
        return {
          ...thread,
          comments: updatedComments,
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
    setEditingCommentId(commentId);
    setEditingCommentText(text);
  };

  const saveEditedComment = (commentId, threadId) => {
    editComment(editingCommentText, commentId, threadId);
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const replyToComment = (text, commentId, threadId) => {
    const updatedThreads = threads.map((thread) => {
      if (thread._id === threadId) {
        const newComment = {
          user: currentUser.userinfo.username,
          comment: text,
          thread_id: threadId,
          _id: crypto.randomUUID(),
          parentId: commentId,
        };
        return {
          ...thread,
          comments: [...thread.comments, newComment],
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
    setReplyingCommentId(null);
  };

  // const deleteComment = (commentId, threadId) => {
  //   const updatedThreads = threads.map((thread) => {
  //     if (thread._id === threadId) {
  //       const filteredComments = thread.comments.filter(
  //         (comment) => comment._id !== commentId
  //       );
  //       return {
  //         ...thread,
  //         comments: filteredComments,
  //       };
  //     }
  //     return thread;
  //   });
  //   setThreads(updatedThreads);
  //   setDeletingCommentId(commentId);
  // };

  const handleEdit = (text, commentId, threadId) => {
    editComment(text, commentId, threadId);
  };

  // handle reply submission
  const onSubmitReply = (e) => {
    e.preventDefault();
    replyToComment(
      replyingComment.text,
      replyingComment.commentId,
      replyingComment.threadId
    );
    setReplyingComment({
      commentId: null,
      threadId: null,
      text: "",
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

  const onSubmit = (e, id) => {
    e.preventDefault();
    addComment(text, id);
    setText("");
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
        console.log(
          resp.data.response.data
            .filter((item) => item.admin_team === true)
            .map((data) => {
              return [{ name: data.team_name }, { id: data._id }];
            })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const isTextareaDisabled = text.length === 0;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="team-screen-threads">
      <div className="team-screen-thread-container">
        {status === "Completed" && (
          <>
            {React.Children.toArray(
              threads
                .filter((thread) => thread.current_status === "Completed")
                .map((thread) => {
                  const assignedTeam = teamNamesArray.find(
                    (item) => item[1].id === thread.team_alerted_id
                  );
                  const assignedTeamName = assignedTeam
                    ? assignedTeam[0].name
                    : "N/A";
                  return (
                    <div className="team-screen-threads-card">
                      <div className="thread-card">
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
                          <h3
                            style={{
                              color: "#005734",
                              fontSize: "1.3rem",
                              marginBottom: "0",
                            }}
                          >
                            {thread.thread}
                          </h3>
                          <div>
                            <p>Assigned to : {assignedTeamName}</p>
                            <p>Raised by : {thread.created_by}</p>
                          </div>
                          <div className="team-screen-threads-progress">
                            <div className="progress">
                              <p>Created</p>
                              <div
                                className={
                                  thread.current_status === "Created" ||
                                  "In progress"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>In progress</p>
                              <div
                                className={
                                  thread.current_status === "In progress"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>Completed</p>
                              <div
                                className={
                                  thread.current_status === "Completed"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>Resolved</p>
                              <div
                                className={
                                  thread.current_status === "Resolved"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                          </div>
                          <div className="comments-section">
                            <p className="comments">
                              <FaRegComments
                                onClick={() =>
                                  setFormVisibility((prevVisibility) => ({
                                    ...prevVisibility,
                                    [thread._id]: !prevVisibility[thread._id],
                                  }))
                                }
                              />
                              &bull;
                              <span
                                onClick={() =>
                                  setCommentsVisibility((prevVisibility) => ({
                                    ...prevVisibility,
                                    [thread._id]: !prevVisibility[thread._id],
                                  }))
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
                                className="comment-input"
                              />
                              <button
                                disabled={isTextareaDisabled}
                                className="action-btn"
                              >
                                Post
                              </button>
                            </div>
                          </form>
                        )}
                        {commentsVisibility[thread._id] && (
                          <div>
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
                              thread.comments.data.map((comment) => (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "1rem",
                                    marginBottom: "0.7rem",
                                    marginLeft: comment.parentId ? "2rem" : "0",
                                  }}
                                >
                                  <div className="avatar-container">
                                    <Avatar
                                      name={thread.created_by}
                                      size={40}
                                      round
                                    />
                                  </div>
                                  {editingCommentId === comment._id ? (
                                    <div>
                                      <textarea
                                        value={editingCommentText}
                                        onChange={(e) =>
                                          setEditingCommentText(e.target.value)
                                        }
                                        className="comment-input"
                                      />
                                      <button
                                        onClick={() =>
                                          saveEditedComment(
                                            comment._id,
                                            thread._id
                                          )
                                        }
                                        className="action-btn"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      <p style={{ fontWeight: "600" }}>
                                        {comment.created_by}
                                      </p>
                                      <p>{comment.comment}</p>
                                      <button
                                        onClick={() =>
                                          handleEdit(
                                            comment.comment,
                                            comment._id,
                                            thread._id
                                          )
                                        }
                                        className="action-btn"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
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

        {(status === "In progress" || status === "Created") && (
          <>
            {React.Children.toArray(
              threads
                .filter(
                  (thread) =>
                    thread.current_status === "In progress" ||
                    thread.current_status === "Created"
                )
                .map((thread) => {
                  const assignedTeam = teamNamesArray.find(
                    (item) => item[1].id === thread.team_alerted_id
                  );
                  const assignedTeamName = assignedTeam
                    ? assignedTeam[0].name
                    : "N/A";
                  return (
                    <div className="team-screen-threads-card">
                      <div className="thread-card">
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
                          <h3
                            style={{
                              color: "#005734",
                              fontSize: "1.3rem",
                              marginBottom: "0",
                            }}
                          >
                            {thread.thread}
                          </h3>
                          <div>
                            <p>Assigned to : {assignedTeamName}</p>
                            <p>Raised by : {thread.created_by}</p>
                          </div>
                          <div className="team-screen-threads-progress">
                            <div className="progress">
                              <p>Created</p>
                              <div
                                className={
                                  thread.current_status === "Created"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>In progress</p>
                              <div
                                className={
                                  thread.current_status === "In progress"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>Completed</p>
                              <div
                                className={
                                  thread.current_status === "Completed"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>Resolved</p>
                              <div
                                className={
                                  thread.current_status === "Resolved"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                          </div>
                          <div className="comments-section">
                            <p className="comments">
                              <FaRegComments
                                onClick={() =>
                                  setFormVisibility((prevVisibility) => ({
                                    ...prevVisibility,
                                    [thread._id]: !prevVisibility[thread._id],
                                  }))
                                }
                              />
                              &bull;
                              <span
                                onClick={() =>
                                  setCommentsVisibility((prevVisibility) => ({
                                    ...prevVisibility,
                                    [thread._id]: !prevVisibility[thread._id],
                                  }))
                                }
                              >{`${thread.comments.data.length} Comment${
                                thread.comments.data.length !== 1 ? "s" : ""
                              }`}</span>
                            </p>
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
                              <textarea
                                value={text}
                                onChange={handleChange}
                                placeholder="Enter a comment..."
                                className="comment-input"
                              />
                              <button
                                disabled={isTextareaDisabled}
                                className="action-btn"
                                onClick={addComment}
                              >
                                Comment
                              </button>
                            </form>
                          )}
                          {commentsVisibility[thread._id] && (
                            <div>
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
                                thread.comments.data.map((comment) => {
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
                                      {editingCommentId === comment._id ? (
                                        <div>
                                          <textarea
                                            value={editingCommentText}
                                            onChange={(e) =>
                                              setEditingCommentText(
                                                e.target.value
                                              )
                                            }
                                            className="comment-input"
                                          />
                                          <button
                                            onClick={() =>
                                              saveEditedComment(
                                                comment._id,
                                                thread._id
                                              )
                                            }
                                            className="action-btn"
                                          >
                                            Save
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          <p style={{ fontWeight: "600" }}>
                                            {comment.created_by}
                                          </p>
                                          <p>{comment.comment}</p>
                                          <button
                                            onClick={() =>
                                              handleEdit(
                                                comment.comment,
                                                comment._id,
                                                thread._id
                                              )
                                            }
                                            className="action-btn"
                                          >
                                            Edit
                                          </button>
                                        </div>
                                      )}
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
              threads
                .filter((thread) => thread.current_status === "Resolved")
                .map((thread) => {
                  const assignedTeam = teamNamesArray.find(
                    (item) => item[1].id === thread.team_alerted_id
                  );
                  const assignedTeamName = assignedTeam
                    ? assignedTeam[0].name
                    : "N/A";
                  return (
                    <div className="team-screen-threads-card">
                      <div className="thread-card">
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
                          <h3
                            style={{
                              color: "#005734",
                              fontSize: "1.3rem",
                              marginBottom: "0",
                            }}
                          >
                            {thread.thread}
                          </h3>
                          <div>
                            <p>Assigned to : {assignedTeamName}</p>
                            <p>Raised by : {thread.created_by}</p>
                          </div>
                          <div className="team-screen-threads-progress">
                            <div className="progress">
                              <p>Created</p>
                              <div
                                className={
                                  thread.current_status === "Created"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>In progress</p>
                              <div
                                className={
                                  thread.current_status === "In progress"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>Completed</p>
                              <div
                                className={
                                  thread.current_status === "Completed"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                            <div className="progress">
                              <p>Resolved</p>
                              <div
                                className={
                                  thread.current_status === "Resolved"
                                    ? "active-thread-btn"
                                    : "threads-btn"
                                }
                              ></div>
                            </div>
                          </div>
                          <div className="comments-section">
                            <p className="comments">
                              <FaRegComments
                                onClick={() =>
                                  setFormVisibility((prevVisibility) => ({
                                    ...prevVisibility,
                                    [thread._id]: !prevVisibility[thread._id],
                                  }))
                                }
                              />
                              &bull;
                              <span
                                onClick={() =>
                                  setCommentsVisibility((prevVisibility) => ({
                                    ...prevVisibility,
                                    [thread._id]: !prevVisibility[thread._id],
                                  }))
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
                            <textarea
                              value={text}
                              onChange={handleChange}
                              placeholder="Enter a comment..."
                              className="comment-input"
                            />
                            <button
                              disabled={isTextareaDisabled}
                              className="action-btn"
                            >
                              Comment
                            </button>
                          </form>
                        )}
                        {commentsVisibility[thread._id] && (
                          <div>
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
                              thread.comments.map((comment) => (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "1rem",
                                    marginBottom: "0.7rem",
                                    marginLeft: comment.parentId ? "2rem" : "0",
                                  }}
                                >
                                  <div className="avatar-container">
                                    <Avatar
                                      name={thread.created_by}
                                      size={40}
                                      round
                                    />
                                  </div>
                                  {editingCommentId === comment._id ? (
                                    <div>
                                      <textarea
                                        value={editingCommentText}
                                        onChange={(e) =>
                                          setEditingCommentText(e.target.value)
                                        }
                                        className="comment-input"
                                      />
                                      <button
                                        onClick={() =>
                                          saveEditedComment(
                                            comment._id,
                                            thread._id
                                          )
                                        }
                                        className="action-btn"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      <p style={{ fontWeight: "600" }}>
                                        {comment.user}
                                      </p>
                                      <p>{comment.comment}</p>
                                      <button
                                        onClick={() =>
                                          handleEdit(
                                            comment.comment,
                                            comment._id,
                                            thread._id
                                          )
                                        }
                                        className="action-btn"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
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
  );
};

export default TeamScreenThreads;
