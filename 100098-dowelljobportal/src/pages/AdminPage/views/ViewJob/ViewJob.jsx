import {useEffect, useState} from 'react'
import "./index.scss";
import { testJobToWorkWith } from "../../../../utils/testData";
import { light } from "@mui/material/styles/createPalette";
import {MdArrowBackIosNew } from "react-icons/md" ;
import { addNewJob } from '../../../../services/adminServices';
import Loading from '../../../CandidatePage/views/ResearchAssociatePage/Loading';
// AiFillEdit 
import {AiFillEdit } from "react-icons/ai"
import axios from 'axios';
import { Link , useNavigate , useParams} from 'react-router-dom';
import { useJobContext } from '../../../../contexts/Jobs';

const ViewJob = () => {
    
    const [loading , setLoading] = useState(false)
  
    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        },10000)
        },[]);
        const navigate = useNavigate() ;
        // asd
        const {jobs , setJobs} = useJobContext() ; 
        const {id} = useParams() ;
        console.log({jobs , id , job:jobs.filter(job => job["_id"] === id)}) ;
        console.log({jobs , id , data:jobs.filter(job => job["_id"] === id)})
        const singleJob = jobs.filter(job => job["_id"] === id)[0] ; 
        console.log({singleJob})
        const {company_id , created_by , created_on , data_type , description , document_id , eventId , general_terms , is_active , job_category , job_number , job_title , other_info , payment
 , qualification , skills , technical_specification, time_interval , type_of_job ,workflow_terms , _id        } = singleJob
    if (loading) return  <Loading/>
        return <>
        <div className="container">
            <div className="header">
            <div>
            <button onClick={() => navigate(-1)} style={{position:"relative"}}><MdArrowBackIosNew style={{color:"#005734" ,position:'absolute' ,fontSize:25,top:"20%",left:"21%" }}/></button>
            <p>{job_title}</p>
            </div>
            <button>edit <AiFillEdit/></button>      
            </div>
            <div className="job-discription">
                <div><h5>Skills:</h5> <span>{skills}</span></div>
                <div><h5>TimePeriod:</h5> <span>{time_interval}</span></div>
                <div><h5>Payment:</h5> <span>{payment}</span></div>
                <div><h5>Job Type:</h5> <span>{type_of_job}</span></div>
                <h4>Job Description:</h4>
                <ol>
                {/* change */}
                <li>Setting goals and developing plans for business and revenue growth. Researching, planning, and implementing new target market initiatives. </li>
                </ol>

               { general_terms.length > 0 &&
                <>
                <h4>General Terms:</h4>
                <ol>
                    {general_terms.map((term , index) => <li key={index}>{term}</li>)}
                </ol>
                </>}

                {technical_specification.length > 0  && <> <h4>Technical Specification:</h4>    
                <ol>
                    {technical_specification.map((specif , index) => <li key={index}>{specif}</li>)}
                </ol> </>}
                
                
                { workflow_terms.length > 0 &&
                <>
                <h4>Workflow Terms:</h4>
                <ol>
                    {workflow_terms.map((term , index) => <li key={index}>{term}</li>)}
                </ol>
                </>}
                
                { other_info.length > 0 &&
                <>
                <h4>Others:</h4>
                <ol>
                    {other_info.map((term , index) => <li key={index}>{term}</li>)}
                </ol>
                </>}
                <button>Edit <AiFillEdit/></button>
            </div>
        </div>
    </>
}

export default ViewJob;
