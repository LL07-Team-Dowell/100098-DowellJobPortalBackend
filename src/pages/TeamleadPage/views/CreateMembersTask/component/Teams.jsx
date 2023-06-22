import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import {HiArrowNarrowRight} from 'react-icons/hi'
// Fetch Teams for that company 
import { teams ,imageReturn} from '../assets/teamsName';
const Teams = ({back}) => {
  const { currentUser } = useCurrentUserContext();
    console.log(currentUser.portfolio_info[0].org_id)
  const {data , setdata} = useValues() ;
  
  return (
    <div className='teams_data'>
    <div>{data.TeamsSelected.map(v => <Team v={v} team_name={v.team_name}/>  )}</div>
    <button onClick={back}>back</button>
    </div>
  )
}

export default Teams

const Team = ({v,team_name}) => {
  
  return (
    <li>
      <img src={imageReturn(team_name)}  />
      <h4>{team_name}</h4>
      <button>View More <HiArrowNarrowRight/></button>
    </li>
  )
}