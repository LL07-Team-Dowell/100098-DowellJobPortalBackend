import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTeam } from '../context/Team';
import Navbar from '../component/Navbar';
import TeamScreenLinks from './compoonent/teamScreenLinks/teamScreenLinks';
import TeamScreenTaskProgress from './compoonent/teamScreenTaskProgress/teamScreenTaskProgress';
import TeamScreeTaskProgessDetail from './compoonent/teamScreeTaskProgessDetail/teamScreeTaskProgessDetail'; 
import { getAllTeams } from '../../../../../services/createMembersTasks';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import CreateTask from './compoonent/createTask/createTask';

const TeamScreenTasks = () => {
  const { currentUser } = useCurrentUserContext();
    const {id} = useParams();
    const {team , setteam } = useTeam() ; 
    const [loading , setloading] = useState(false);
    const [detail ,setdetail] = useState('in progress') ;
    const [showCreatTask,setShowCreateTask] = useState(false) 
    useEffect(()=>{
      if(team.members === undefined){
        setloading(true)
        getAllTeams(currentUser.portfolio_info[0].org_id)
          .then(resp =>{ 
          setteam(resp.data.response.data.find(team => team["_id"] === id))
          setloading(false)
      })
      .catch(err => console.log(err))
      }
    },[])
    console.log({team})
    if (loading) return <h1>Loading...</h1>
  return (
    <>
    <Navbar title={team.team_name} removeButton={true}/>
    <TeamScreenLinks id={id}/>
    <TeamScreenTaskProgress />
    <TeamScreeTaskProgessDetail members={team.members}  detail={detail} setdetail={setdetail} ShowCreateTask={()=>setShowCreateTask(true)}/>
    {showCreatTask && <CreateTask id={id} members={team.members} team={team} unShowCreateTask={()=>setShowCreateTask(false)}/>}
    </>
    )
}

export default TeamScreenTasks