import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenThreads.css";

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
            <div>
                <h1>Wordings</h1>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamScreenThreads;
