import React, { useState, useEffect } from "react";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenThreads.css";
import { FaRegComments } from "react-icons/fa";
import Comment from "../../../../../../CandidatePage/views/TeamsScreen/components/addComment";
import { testThreadsToWorkWith } from "../../../../../../../utils/testData";
import userIcon from "./assets/user_icon.png";
import { set } from "date-fns";

const TeamScreenThreads = () => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });

  const [text, setText] = useState("");
  const [threads, setThreads] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    setThreads(testThreadsToWorkWith);
    console.log({ threads });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
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
          comment._id === commentId
            ? { ...comment, comment: text }
            : comment
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

  const deleteComment = (commentId, threadId) => {
    const updatedThreads = threads.map((thread) => {
      if (thread._id === threadId) {
        const filteredComments = thread.comments.filter(
          (comment) => comment._id !== commentId
        );
        return {
          ...thread,
          comments: filteredComments,
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
    setDeletingCommentId(commentId);
  };

  const handleEdit = (text, commentId, threadId) => {
    editComment(text, commentId, threadId);
  };

  // const handleDelete = (commentId, threadId) => {
  //   deleteComment(commentId, threadId);
  // };

  const onSubmit = (e, id) => {
    e.preventDefault();
    addComment(text, id);
    setText("");
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
                  <p>{thread.thread}</p>
                  <div>
                    <p>Assigned to : Team Development A</p>
                    <p>Raised by : {thread.created_by}</p>
                  </div>
                  <div className="team-screen-threads-progress">
                    <div className="progress">
                      <p>Created</p>
                      <div className="threads-progress"></div>
                    </div>
                    <div className="progress">
                      <p>In progress</p>
                      <div className="threads-progress"></div>
                    </div>
                    <div className="progress">
                      <p>Completed</p>
                      <div className="threads-progress"></div>
                    </div>
                    <div className="progress">
                      <p>Resolved</p>
                      <div className="threads-progress"></div>
                    </div>
                  </div>
                  <div className="comments-section">
                    <p className="comments">
                      <FaRegComments />
                      &bull;
                      <span>10 Comments</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="comment-action">
                <form onSubmit={(e) => onSubmit(e, thread._id)}>
                  <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder="Enter your comment..."
                    className="comment-input"
                  />
                  <button disabled={isTextareaDisabled}>Send</button>
                </form>
                <div>
                  <div style={{ fontSize: "0.8rem", marginBottom: "0.6rem" }}>
                    Comments
                  </div>
                  {React.Children.toArray(
                    thread.comments.map((comment) => (
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginBottom: "0.7rem",
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
                            <p style={{ fontWeight: "600" }}>{comment.user}</p>
                            <p>{comment.comment}</p>
                            <button
                              onClick={() =>
                                handleEdit(comment.comment, comment._id, thread._id)
                              }
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                deleteComment(comment._id, thread._id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamScreenThreads;
