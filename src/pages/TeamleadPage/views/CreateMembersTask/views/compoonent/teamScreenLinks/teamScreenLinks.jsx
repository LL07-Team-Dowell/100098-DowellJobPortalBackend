import React from "react";
import "./teamScreenLinks.scss";
import { NavLink } from "react-router-dom";
const TeamScreenLinks = ({ id, issueLinkTabActive }) => {
  return (
    <div className='team-screen-member-links'>
      <NavLink
        className={({ isActive }) => `${isActive && "link-isActive"}`}
        to={`/team-screen-member/${id}/team-info`}
      >
        Team Info
      </NavLink>

      <NavLink
        className={({ isActive }) => `${isActive && "link-isActive"}`}
        to={`/team-screen-member/${id}/team-members`}
      >
        Team Members
      </NavLink>
      <NavLink
        className={({ isActive }) => `${isActive && "link-isActive"}`}
        to={`/team-screen-member/${id}/team-tasks`}
      >
        Team Tasks
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${(isActive || issueLinkTabActive) && "link-isActive"}`
        }
        to={`/team-screen-member/${id}/team-issues`}
      >
        Team Issues
      </NavLink>
    </div>
  );
};

export default TeamScreenLinks;
