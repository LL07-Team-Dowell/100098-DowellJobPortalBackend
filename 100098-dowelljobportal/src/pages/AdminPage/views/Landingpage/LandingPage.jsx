import React ,{useContext , useEffect}from 'react'
import { useJobContext } from '../../../../contexts/Jobs';
import './index.scss'
import backpage from './assets/backpage.svg'
import plus from './assets/plus.svg' ; 
import search from './assets/search.svg'
import Card from './component/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../../CandidatePage/views/ResearchAssociatePage/Loading';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
const LandingPage = () => {
  const {jobs , setJobs} = useJobContext() ; 
  const navigate = useNavigate() ; 
  console.log("jobs",jobs)
  useEffect(()=>{
    if(jobs.length === 0 ){
      axios.post('https://100098.pythonanywhere.com/admin_management/get_jobs/', {
      company_id: '100098'},[]).then(response => {setJobs(response.data.response.data); console.log(response.data.response.data)}).catch(error => console.log(error))
    }

  },[])
  return (
    <StaffJobLandingLayout adminView={true} handleNavIconClick={() => navigate("/add-job")}>
    <div className='landing-page'>
            
           
            <div className="cards">
            {
              jobs.length > 0 ? jobs.reverse().map((job , index) => <Card {...job} key={index}/>) :<Loading/>
            }
            </div>
    </div>
    </StaffJobLandingLayout>
  )
}

export default LandingPage