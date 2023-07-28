import React, { useState, useEffect } from "react";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenThreads.css";
import { FaRegComments } from "react-icons/fa";
import { testThreadsToWorkWith } from "../../../../../../../utils/testData";
import userIcon from "./assets/user_icon.png";

const TeamScreenThreads = () => {
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

  useEffect(() => {
    setThreads(testThreadsToWorkWith);
    console.log("testThreadsToWorkWith", testThreadsToWorkWith)
  }, []);

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

  const addComment = (text, id) => {
    console.log("addComment", text, id);

    const updatedThreads = threads.map((thread) => {
      if (thread._id === id) {
        const newComment = {
          user: currentUser.userinfo.username,
          comment: text,
          thread_id: id,
          _id: crypto.randomUUID(),
        };
        return {
          ...thread,
          comments: [...thread.comments, newComment],
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
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

  const onSubmit = (e, id) => {
    e.preventDefault();
    addComment(text, id);
    setText("");
  };

  const getStatusColor = (status) => {
    if (
      status === "Created" ||
      status === "In progress" ||
      status === "Completed" ||
      status === "Resolved"
    ) {
      return "green";
    } else {
      return "red";
    }
  };


  const isTextareaDisabled = text.length === 0;

  return (
    <div className="team-screen-threads">
      <div className="team-screen-thread-container">
        {React.Children.toArray(
          threads.map((thread) => (
            <div className="team-screen-threads-card">
              <div className="thread-card">
                {thread.image ? (
                  <div>
                    <img src={thread.image} alt="thread" />
                  </div>
                ) : (
                  <></>
                )}
                <div className="team-screen-threads-container">
                  <h3 style={{ color: "#005734", fontSize: "1.3rem" }}>
                    {thread.thread}
                  </h3>
                  <div>
                    <p>Assigned to : Team Development A</p>
                    <p>Raised by : {thread.created_by}</p>
                  </div>
                  <div className="team-screen-threads-progress">
                    {thread.previous_statuses
                      .concat(thread.current_status)
                      .map((status, index) => (
                        <div key={index} className="progress">
                          <p style={{ color: getStatusColor(status) }}>
                            {status}
                          </p>
                          <div
                            className={`threads-progress ${getStatusColor(
                              status
                            )}`}
                          ></div>
                        </div>
                      ))}
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
                      >{`${thread.comments.length} Comment${
                        thread.comments.length !== 1 ? "s" : ""
                      }`}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="comment-action">
                {formVisibility[thread._id] && (
                  <form onSubmit={(e) => onSubmit(e, thread._id)}>
                    <h3 style={{ fontSize: "0.8rem", marginBottom: "0.6rem" }}>
                      Add Comment
                    </h3>
                    <textarea
                      value={text}
                      onChange={handleChange}
                      placeholder="Enter your comment..."
                      className="comment-input"
                    />
                    <button disabled={isTextareaDisabled}>Send</button>
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
                          <div>
                            <img
                              src={userIcon}
                              alt="userIcon"
                              width={35}
                              height={35}
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
                                  saveEditedComment(comment._id, thread._id)
                                }
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
                              >
                                Edit
                              </button>
                              {/*<button
                                onClick={() =>
                                  deleteComment(comment._id, thread._id)
                                }
                              >
                                Delete
                              </button> */}
                              <button
                                onClick={() =>
                                  setReplyingComment({
                                    commentId: comment._id,
                                    threadId: thread._id,
                                    text: "",
                                  })
                                }
                              >
                                Reply
                              </button>
                              {replyingComment.commentId === comment._id &&
                                replyingComment.threadId === thread._id && (
                                  <div>
                                    <textarea
                                      name="text"
                                      value={replyingComment.text}
                                      onChange={handleReplyChange}
                                      className="comment-input"
                                      placeholder="Enter your reply..."
                                    />
                                    <button onClick={onSubmitReply}>
                                      Reply
                                    </button>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamScreenThreads;
