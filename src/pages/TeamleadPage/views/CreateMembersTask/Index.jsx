import React, { useState ,useEffect} from 'react'
import TasksCo from './TasksCo'
import Teams from './component/Teams';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { AiOutlinePlus, AiOutlineTeam } from 'react-icons/ai';
import { useValues } from './context/Values';
import axios from 'axios';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { RiTeamFill } from 'react-icons/ri';
const Index = () => {
  const { currentUser } = useCurrentUserContext();
  const {data , setdata} = useValues() ;
  const [impLoading , setImpLoading] = useState(false) ; 
  useEffect(()=>{
    setImpLoading(true)
    axios(`https://100098.pythonanywhere.com/team_task_management/get_all_teams/${currentUser.portfolio_info[0].org_id}/`)
    .then(resp =>{ 
      console.log(resp.data.response.data)
      setdata({...data , TeamsSelected:resp.data.response.data});
      setImpLoading(false)
  })
  .catch(e =>{
    console.log(e)
  })
  },[])
  const [choose, setchoose] = useState(0) ; 
  const back = () => {
    setchoose(0)
  }
  if(choose === 1) return <StaffJobLandingLayout teamleadView={true}><Teams back={back}/></StaffJobLandingLayout> 
  if(choose === 2 ) return <StaffJobLandingLayout teamleadView={true}><TasksCo bback={back}/></StaffJobLandingLayout>
  if(impLoading)return <StaffJobLandingLayout teamleadView={true}><LoadingSpinner/></StaffJobLandingLayout> 
  return (
    <StaffJobLandingLayout teamleadView={true}>
    <button onClick={() => setchoose(2)}>Team tasks  <RiTeamFill/> </button>
    <button onClick={() => setchoose(1)}>show teams <AiOutlineTeam/> </button>
    </StaffJobLandingLayout>
  )
}

export default Index