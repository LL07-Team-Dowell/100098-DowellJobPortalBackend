import React from "react";
import "./teamScreenLinks.scss";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const TeamScreenLinks = ({ id, issueLinkTabActive }) => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');

  return (
    <div className='team-screen-member-links'>
      <NavLink
        className={({ isActive }) => `${isActive && "link-isActive"}`}
        to={`/team-screen-member/${id}/team-info`}
      >
        {
          'Team Info'
        }
      </NavLink>

      <NavLink
        className={({ isActive }) => `${isActive && "link-isActive"}`}
        to={`/team-screen-member/${id}/team-members`}
      >
        {
          isSmallScreen ?
            'Members'
          :
          'Team Members'
        }
      </NavLink>
      <NavLink
        className={({ isActive }) => `${isActive && "link-isActive"}`}
        to={`/team-screen-member/${id}/team-tasks`}
      >
        {
          isSmallScreen ?
            'Tasks'
          :
          'Team Tasks'
        }
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${(isActive || issueLinkTabActive) && "link-isActive"}`
        }
        to={`/team-screen-member/${id}/team-issues`}
      >
        {
          isSmallScreen ?
            'Issues'
          :
          'Team Issues'
        }
      </NavLink>
    </div>
  );
};

export default TeamScreenLinks;
