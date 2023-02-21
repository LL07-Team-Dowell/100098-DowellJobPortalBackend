import React ,{useContext , useEffect}from 'react'
import { useJobContext } from '../../../../contexts/Jobs';
import './index.scss'
import backpage from './assets/backpage.svg'
import plus from './assets/plus.svg' ; 

import search from './assets/search.svg'
import Card from './component/Card';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../../CandidatePage/views/ResearchAssociatePage/Loading';
import { useNavigate } from 'react-router-dom'
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
    <div className='landing-page'>
            
            <a onClick={()=>navigate(-1)} ><img src={backpage} alt="" className={"backpage"} /></a>
            <div className="add_new_job">
                        <div>
                        <button><Link to={"/add-job"}><img src={plus} alt="" /></Link></button>
                        <h3>Add New Job</h3>
                        </div>
                        
                        <div className="input">
                                    <img src={search} alt="" />
                                    <input type="text" placeholder='Search by skill, job' />
                        </div>
            </div>
            <div className="cards">
            {/* {jobs.map(job => <Card {...job}/>)} */}
            {
              jobs.length > 0 ? jobs.map(job => <Card {...job}/>) :<Loading/>
            }
            </div>
    </div>
  )
}

export default LandingPage