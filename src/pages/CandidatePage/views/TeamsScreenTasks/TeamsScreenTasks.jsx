import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useTeam } from "../TeamsScreen/useTeams";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import TeamScreenLinks from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import TeamScreenTaskProgress from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenTaskProgress/teamScreenTaskProgress";
import TeamScreeTaskProgessDetail from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreeTaskProgessDetail/teamScreeTaskProgessDetail";
import CreateTask from "../../../TeamleadPage/views/CreateMembersTask/component/smallComponents/CreateTask";
import { getAllTeams } from "../../../../services/createMembersTasks";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";

const TeamScreenTasksCandidate = () => {
  const { currentUser } = useCurrentUserContext();
    const {id} = useParams();
    const {team , setteam } = useTeam() ; 
    const [loading , setloading] = useState(false);
    const [detail ,setdetail] = useState('in progress') ;
    const [showCreatTask,setShowCreateTask] = useState(false) 
    useEffect(()=>{
      if(team?.members === undefined){
        setloading(true)
        getAllTeams(currentUser.portfolio_info[0].org_id)
          .then(resp =>{ 
          setteam(resp.data.response.data.find(team => team["_id"] === id))
          setloading(false)})
      .catch(err => console.log(err))
      }
    },[])
    console.log({team})
    if (loading) return <LoadingSpinner/>
      return (
        <div style={{height:'130%'}}>
          { team?.team_name !== undefined ? <Navbar title={team?.team_name.toString()} removeButton={true}/> : null }
          <TeamScreenLinks id={id}/>
          <TeamScreenTaskProgress />
          <TeamScreeTaskProgessDetail id={id} title={team?.team_name} members={team?.members}  detail={detail} setdetail={setdetail} ShowCreateTask={()=>setShowCreateTask(true)} showAddTaskButton={false}/>
        </div>
        )
 
}

export default TeamScreenTasksCandidate