import {useEffect, useState} from 'react'
import "./index.scss";
import { testJobToWorkWith } from "../../../../utils/testData";
import { light } from "@mui/material/styles/createPalette";
import {MdArrowBackIosNew } from "react-icons/md" ;
import { addNewJob } from '../../../../services/adminServices';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
// AiFillEdit 
import {AiFillEdit } from "react-icons/ai"
import axios from 'axios';

const ViewJob = () => {
    const {job_number , job_title , description , skills , qualification , job_catagory , type_of_job , payment , is_active , time_interval , technical_specification , workflow_terms , other_info , company_id} = testJobToWorkWith
    const [loading , setLoading] = useState(false)
    useEffect(()=>{
        setLoading(true)
        axios.post('https://100098.pythonanywhere.com/admin_management/create_jobs/', {
            company_id: '100098',
    },[])
    .then(response => {
    setLoading(false)
    console.log(response.data);
    })
    .catch(error => {
    console.log(error);
    });
    },[])
    if (loading) return  <h1>Loadding...</h1>
        return <>
        <div className="container">
            <div className="header">
            <div>
            <button><MdArrowBackIosNew/></button>
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
                <h4>General Terms:</h4>
                <ol>
                    {workflow_terms.map((term , index) => <li key={index}>{term}</li>)}
                </ol>
                <h4>Technical Specifications:</h4>
                <ol>
                    {technical_specification.map((specif , index) => <li key={index}>{specif}</li>)}
                </ol>
                <h4>Payment Terms:</h4>
                <ol>
                    {technical_specification.map((specif , index) => <li key={index}>{specif}</li>)}
                </ol>
                <h4>Workflow:</h4>
                <ol>
                    {workflow_terms.map((term , index) => <li key={index}>{term}</li>)}
                </ol>
                <div className="others">
                    <h5>others:</h5>    <span>Your discord profile Id</span>
                </div> 
                <button>edit <AiFillEdit/></button>
            </div>
        </div>
    </>
}

export default ViewJob;
