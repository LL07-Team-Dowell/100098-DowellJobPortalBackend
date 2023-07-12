import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import {HiArrowNarrowRight} from 'react-icons/hi'
// Fetch Teams for that company 
import { teams ,imageReturn} from '../assets/teamsName';
import { useNavigate } from 'react-router-dom';
import { AiOutlineTeam } from 'react-icons/ai';
const Teams = ({back , setChoosedTeam, searchValue, data}) => {
  
  const reversedTeams = [...data.TeamsSelected].reverse();
  return (
    <div className='teams_data'>
    <div>{reversedTeams.filter(e => e.team_name.includes(searchValue)).map(v => <Team v={v} team_name={v.team_name} setChoosedTeam={setChoosedTeam}/>  )}</div>
    </div>
  )
}

export default Teams

const Team = ({v,team_name ,setChoosedTeam}) => {
  const navigate = useNavigate() ; 
  
  return (
    <li className='team' onClick={()=>{navigate(`/team-screen-member/${v._id}/team-tasks`)}}>
    {imageReturn(team_name) ?  <img className='team_logo' style={{width:56,height:56}} src={imageReturn(team_name)} /> : <AiOutlineTeam style={{width:56,height:56,backgroundColor:'rgba(225, 251, 226, 1)',color:'rgba(0, 87, 52, 1)',borderRadius:'50%',fontSize:10,fontWeight:600,padding:10,boxSizing:'border-box',marginLeft:5}}/>}
      <h2>{team_name}</h2>
      <p className='paragraph-discription'>{(v.team_description !== null && v.team_description !== undefined) ? v.team_description : "no description"}</p>
      <button>View More <HiArrowNarrowRight/></button>
    </li>
  )
}