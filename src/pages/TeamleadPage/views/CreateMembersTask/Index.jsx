import React, { useState ,useEffect} from 'react'
import TasksCo from './TasksCo'
import Teams from './component/Teams';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { AiOutlinePlus, AiOutlineTeam } from 'react-icons/ai';
import { useValues } from './context/Values';
import axios from 'axios';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import "./index.scss"
import { getAllTeams } from '../../../../services/createMembersTasks';
import Navbar from './component/Navbar';
const Index = () => {
  const { currentUser } = useCurrentUserContext();
  const {data , setdata} = useValues() ;
  const [searchValue, setSearchValue] = useState('');
  useEffect(()=>{
    getAllTeams(currentUser.portfolio_info[0].org_id)
    .then(resp =>{ 
      console.log(resp.data.response.data)
      setdata({...data , TeamsSelected:resp.data.response.data});
  })
  .catch(e =>{
    console.log(e)
  })
  },[])
  console.log(searchValue)
  console.log(data.TeamsSelected.length)
  if(data.TeamsSelected.length === 0)return <StaffJobLandingLayout  teamleadView={true}><LoadingSpinner/></StaffJobLandingLayout> 
  return (
    <StaffJobLandingLayout teamleadView={true} searchValue={searchValue} setSearchValue={setSearchValue}>
      <Navbar title={"All Teams"} color={'#005734'} noButtonBack={true} />
      <div className='container'>
      <Teams searchValue={searchValue} data={data}/>
      </div>
    </StaffJobLandingLayout>
  )
}

export default Index
const iconsStyle = {
  fontSize:60 ,

}