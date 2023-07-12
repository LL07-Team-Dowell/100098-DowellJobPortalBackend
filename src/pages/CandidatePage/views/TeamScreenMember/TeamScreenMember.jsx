import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useTeam } from "../TeamsScreen/useTeams";
import { useEffect, useState } from "react";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";
import TeamScreenLinks from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenLinks/teamScreenLinks";
import TeamScreenMembersContainer from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/teamScreenMembersContainer/teamScreenMembersContainer";
import AddMemberPopup from "../../../TeamleadPage/views/CreateMembersTask/views/compoonent/addMemberPopup/addMemberPopup";
import { HiOutlinePlusSm } from "react-icons/hi";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { getAllTeams } from "../../../../services/createMembersTasks";

const TeamScreenMembersCandidate = () => {
  const { currentUser } = useCurrentUserContext();
    const {id} = useParams();
    const {team , setteam } = useTeam() 
    const [loading , setloading] = useState(false);
    const [showPopup ,setShowPopup] = useState(false)
    const [members, setmembers] = useState([])
    const [teamName , setTeamName] = useState('') ;
    useEffect(()=>{
      if(team?.members === undefined){
        setloading(true)
        getAllTeams(currentUser.portfolio_info[0].org_id)
          .then(resp =>{ 
          setteam(resp.data.response.data.find(team => team["_id"] === id))
          console.log(resp.data.response.data.find(team => team["_id"] === id))
          setloading(false)})
      .catch(err => console.log(err))
      }
    },[])
        const getElementToTeamState = (teamName, members )=>{
          setteam({...team ,members:members,team_name:teamName })
          setTeamName(teamName);
          setmembers(members)
        }
    const bigMember = ['boxboy','ayo','sagar','isaac','Hardic','akram','manish']
    console.log({team, loading})
    if(loading) return <LoadingSpinner/>
  return (
    <div style={{height:'110%'}}>
      <Navbar title={team?.team_name} removeButton={true}/>
      <TeamScreenLinks id={id}/>
      <TeamScreenMembersContainer members={team?.members} />
      {showPopup && <AddMemberPopup bigMember={bigMember} members={team?.members} setmembers={setmembers} setTeamName={setTeamName} team_name={team?.team_name} close={()=>setShowPopup(false)} getElementToTeamState={getElementToTeamState} team={team} setteam={setteam}/>}
    </div>
  )
}

export default TeamScreenMembersCandidate