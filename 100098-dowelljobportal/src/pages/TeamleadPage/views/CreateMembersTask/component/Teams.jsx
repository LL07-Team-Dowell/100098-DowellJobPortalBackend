import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';

const Teams = () => {
            const [teams , setteams] = useState([]) ; 
  const {data , setdata} = useValues() ;

            useEffect(()=>{
              console.log("aaaaaaaaaaaaaaaaaaaaa")
                        axios("https://100098.pythonanywhere.com/team_task_management/create_get_team/")
                        .then(resp =>{ setteams(resp.data);console.log(resp.data);setdata({...data , TeamsSelected:resp.data})})
                        .catch(err => console.log(err))
            },[])
  return (
    <div>{teams.map(v => <li>{v.team_name} names:<span>{v.members.map((j,i)=><span>{j.name}{" "}</span>)}</span></li>)}</div>
  )
}

export default Teams