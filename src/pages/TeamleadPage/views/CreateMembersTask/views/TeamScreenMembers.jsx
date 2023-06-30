import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TeamScreenLinks   from './compoonent/teamScreenLinks/teamScreenLinks';
import Navbar from '../component/Navbar';
import { useTeam } from '../context/Team';
import TeamScreenMembersContainer from './compoonent/teamScreenMembersContainer/teamScreenMembersContainer';
import AddMemberPopup from './compoonent/addMemberPopup/addMemberPopup';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { useCurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import { getAllTeams } from '../../../../../services/createMembersTasks';
const TeamScreenMembers = () => {
  const { currentUser } = useCurrentUserContext();
    const {id} = useParams();
    const {team , setteam } = useTeam() ; 
    const [loading , setloading] = useState(false);
    const [showPopup ,setShowPopup] = useState(false)
    const [members, setmembers] = useState([])
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
      setmembers(team.members)
    })
    const bigMember = ['boxboy','ayo','sagar','isaac','Hardic','akram','manish']
    console.log({team, loading})
    if(loading) return <h1>Loading ..</h1>
  return (
    <div>
      <Navbar title={team.team_name} removeButton={true}/>
      <TeamScreenLinks id={id}/>
      <TeamScreenMembersContainer members={members}/>
      {showPopup && <AddMemberPopup bigMember={bigMember} smallMember={members} setmembers={setmembers} team_name={team.team_name} close={()=>setShowPopup(false)}/>}
      <button className='add-member-btn' onClick={()=>setShowPopup(true)}><div><HiOutlinePlusSm fontWeight={700}/> <span>add member</span></div></button>

    </div>
  )
}

export default TeamScreenMembers