import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
// Fetch Teams for that company 
const Teams = ({back}) => {
  const { currentUser } = useCurrentUserContext();
    console.log(currentUser.portfolio_info[0].org_id)
  const {data , setdata} = useValues() ;
  
  return (
    <>
    <div>{data.TeamsSelected.map(v => <li>{v.team_name} </li>)}</div>
    <button onClick={back}>back</button>
    </>
  )
}

export default Teams