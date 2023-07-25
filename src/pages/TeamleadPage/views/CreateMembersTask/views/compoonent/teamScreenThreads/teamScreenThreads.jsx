import { useState, useEffect } from "react";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenThreads.css";
import { FaRegComments } from "react-icons/fa";
import Comment from "../../../../../../CandidatePage/views/TeamsScreen/components/addComment";
import { Tooltip } from "react-tooltip";
import { testThreadsToWorkWith } from "../../../../../../../utils/testData";

// react
import React from "react";
const TeamScreenThreads = () => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });

  const [text, setText] = useState("");
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    setThreads(testThreadsToWorkWith);
    console.log({ threads });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {};

  return (
    <div className="team-screen-threads">
      <div className="team-screen-thread-container">
        {testThreadsToWorkWith.map((thread) => (
          <div className="team-screen-threads-card" key={thread._id}>
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
                    <FaRegComments onClick={handleSubmit} />
                    &bull;
                    <span>10 Comments</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="comment-action">
              <Comment
                text={text}
                handleChange={handleChange}
                comments={thread.comments[0].comment}
                user={thread.comments[0].user}
                commentInput="comment-input"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamScreenThreads;
