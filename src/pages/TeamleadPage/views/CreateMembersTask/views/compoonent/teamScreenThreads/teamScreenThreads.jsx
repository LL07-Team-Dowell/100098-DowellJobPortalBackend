import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenThreads.css";
import { FaRegComments } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

// react
import React from "react";
const TeamScreenThreads = () => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });
  return (
    <div className="team-screen-threads">
      <div className="team-screen-threads-card">
        <div className="team-screen-threads-details">
          <div>
            <h1>Image</h1>
          </div>
          <div className="team-screen-threads-container">
            <p>Fixed the Login button</p>
            <div>
              <p>Assigned to : Team Development A</p>
              <p>Raised by : Zeke</p>
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
                &bull; <span>10 Comments</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamScreenThreads;
