// styles
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
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
      <div
        className='team-screen-task-progress-data'
        style={{ width: 200, height: 200 }}
      >
        {/* <div className='team-screen-task-progress-data-circle'>
          <span>{progessPercentage}%</span>
          
        </div> */}
        <CircularProgressbar
          value={progessPercentage ? progessPercentage : "00"}
          text={`${progessPercentage ? progessPercentage : "00"}%`}
          styles={buildStyles({
            pathColor: `#005734`,
            textColor: "#005734",
            trailColor: "#efefef",
            backgroundColor: "#005734",
            width: "100%",
            height: "100%",
          })}
        />
        <p>team progress</p>
      </div>
    </div>
  );
};

export default TeamScreenTaskProgress;
