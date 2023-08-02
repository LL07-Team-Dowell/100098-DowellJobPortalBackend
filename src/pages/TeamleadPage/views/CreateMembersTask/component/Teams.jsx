import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { HiArrowNarrowRight } from 'react-icons/hi'
// Fetch Teams for that company 
import { teams, imageReturn } from '../assets/teamsName';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineTeam } from 'react-icons/ai';
import { deleteTeam } from '../../../../../services/createMembersTasks';
import { Tooltip } from 'react-tooltip';
import { RiEdit2Fill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
const Teams = ({ back, setChoosedTeam, searchValue, data, deleteTeamState }) => {
  const { currentUser } = useCurrentUserContext();
  const reversedTeams = [...data.TeamsSelected].reverse();
  // console.log({reversedTeams})
  return (
    <div className='teams_data'>
      {
        reversedTeams
          .filter(team => team.created_by === currentUser.userinfo.username)
          .filter(e => e.team_name.includes(searchValue)).length !== 0 ?
          <div>{reversedTeams
            .filter(team => team.created_by === currentUser.userinfo.username)
            .filter(e => e.team_name.includes(searchValue))
            .map(v => <Team v={v} team_name={v.team_name} setChoosedTeam={setChoosedTeam} deleteTeamState={deleteTeamState} />
            )}</div>
          :
          <h4>There is no Team in this Profile.</h4>
      }

    </div>
  )
}

export default Teams

const Team = ({ v, team_name, setChoosedTeam, deleteTeamState }) => {
  const navigate = useNavigate();
  const deleteTeamFunction = () => {
    deleteTeam(v._id)
      .then(resp => {
        deleteTeamState(v._id)
        console.log(resp)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <li className='team' >
      <div
        style={{ position: 'absolute', top: 10, right: 10, width: 'fit-content', zIndex: 999, cursor: 'pointer' }}
        onClick={deleteTeamFunction}
        data-tooltip-id={v._id}
        data-tooltip-content={'Delete'}
      >
        <MdDelete style={{ fontSize: "1.3rem", color: "#000" }} />
        <Tooltip
          id={v._id}
          style={{ fontSize: '0.7rem', fontWeight: "normal" }}
        />
      </div>
      {imageReturn(team_name) ? <img className='team_logo' style={{ width: 56, height: 56 }} src={imageReturn(team_name)} /> : <AiOutlineTeam style={{ width: 56, height: 56, backgroundColor: 'rgba(225, 251, 226, 1)', color: 'rgba(0, 87, 52, 1)', borderRadius: '50%', fontSize: 10, fontWeight: 600, padding: 10, boxSizing: 'border-box', marginLeft: 5 }} />}
      <h2>{team_name}</h2>
      <p className='paragraph-discription'>{(v.team_description !== null && v.team_description !== undefined) ? v.team_description : "no description"}</p>
      <button onClick={() => { navigate(`/team-screen-member/${v._id}/team-tasks`) }}>View More <HiArrowNarrowRight /></button>
    </li>
  )
}