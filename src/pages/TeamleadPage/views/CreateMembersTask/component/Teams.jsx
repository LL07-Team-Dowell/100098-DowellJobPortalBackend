import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import {HiArrowNarrowRight} from 'react-icons/hi'
// Fetch Teams for that company 
import { teams ,imageReturn} from '../assets/teamsName';
const Teams = ({back , setChoosedTeam}) => {
  const { currentUser } = useCurrentUserContext();
    console.log(currentUser.portfolio_info[0].org_id)
  const {data , setdata} = useValues() ;
  
  return (
    <div className='teams_data'>
    <div>{data.TeamsSelected.map(v => <Team v={v} team_name={v.team_name} setChoosedTeam={setChoosedTeam}/>  )}</div>
    <button onClick={back}>back</button>
    </div>
  )
}

export default Teams

const Team = ({v,team_name ,setChoosedTeam}) => {
  
  return (
    <li onClick={()=>{setChoosedTeam({choosed:true , value:v.team_name ,id:v._id})}}>
      <img src={imageReturn(team_name)}  />
      <h4>{team_name}</h4>
      <button>View More <HiArrowNarrowRight/></button>
    </li>
  )
}