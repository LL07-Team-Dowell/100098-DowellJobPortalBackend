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
import "./index.scss"
import { getAllTeams } from '../../../../services/createMembersTasks';
import Navbar from './component/Navbar';
const Index = () => {
  const { currentUser } = useCurrentUserContext();
  const {data , setdata} = useValues() ;
  const [impLoading , setImpLoading] = useState(false) ; 
  useEffect(()=>{
    setImpLoading(true)
    getAllTeams(currentUser.portfolio_info[0].org_id)
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
  if(choose === 1) return <StaffJobLandingLayout teamleadView={true}> <div className="container"><Teams back={back}/></div> </StaffJobLandingLayout> 
  if(choose === 2 ) return <StaffJobLandingLayout teamleadView={true}> <div className="container"><TasksCo bback={back}/></div> </StaffJobLandingLayout>
  if(impLoading)return <StaffJobLandingLayout teamleadView={true}><LoadingSpinner/></StaffJobLandingLayout> 
  return (
    <StaffJobLandingLayout teamleadView={true}>
      <Navbar title={"All Teams"} />
      <div className='container'>
      <Teams/>
      </div>
    </StaffJobLandingLayout>
  )
}

export default Index
const iconsStyle = {
  fontSize:60 ,

}