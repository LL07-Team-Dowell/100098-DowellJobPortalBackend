import React from 'react'
import './teamScreenLinks.scss'
import { NavLink } from 'react-router-dom'
const TeamScreenLinks = ({id}) => {
  return (
    <div className='team-screen-member-links'>
        <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-members`}>Team Members</NavLink>
        <NavLink className={({ isActive }) => `${isActive && 'link-isActive'}`} to={`/team-screen-member/${id}/team-tasks`}>Team Tasks</NavLink>
    </div>
  )
}

export default TeamScreenLinks