import React from 'react'
import './teamScreenLinks.scss'
import { NavLink } from 'react-router-dom'
const TeamScreenLinks = ({ id }) => {
  return (
    <div className='team-screen-member-links'>
<<<<<<< HEAD
        <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-members`}>Team Members</NavLink>
        <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-tasks`}>Team Tasks</NavLink>
        <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-issues`}>Team Issues</NavLink>
=======
      <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-members`}>Team Members</NavLink>
      <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-tasks`}>Team Tasks</NavLink>
      <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-issues`}>Team Issues</NavLink>
>>>>>>> 72b592f53a963fd18c2a1fa6a9d9d225b1a6439b
    </div>
  )
}

export default TeamScreenLinks