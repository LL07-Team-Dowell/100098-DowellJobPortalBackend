// styles
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import "./teamScreenTaskProgress.scss";

// react
import React from "react";
const TeamScreenTaskProgress = ({ progessPercentage }) => {
  const { currentUser } = useCurrentUserContext();
  console.log({ currentUser });
  return (
    <div className='team-screen-task-progress'>
      <div className='team-screen-task-progress-welcome'>
        <h2>
          Hi,Welcome {currentUser.userinfo.first_name}{" "}
          {currentUser.userinfo.last_name} !
        </h2>
        <p>See your team progress</p>
      </div>
      <div className='team-screen-task-progress-data'>
        <div className='team-screen-task-progress-data-circle'>
          <span>{progessPercentage}%</span>
        </div>
        <p>team progress</p>
      </div>
    </div>
  );
};

export default TeamScreenTaskProgress;
