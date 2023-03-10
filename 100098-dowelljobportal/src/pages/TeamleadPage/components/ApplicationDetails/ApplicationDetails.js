import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';
import { excludedApplicantInfo, mutableNewApplicationStateNames } from '../../../../contexts/NewApplicationContext';
import { changeToTitleCase, formatDateAndTime } from '../../../../helpers/helpers';

import "./style.css";


const ApplicantDetails = ({ hrPageActive, applicantData, candidateApplicationPageActive, showApplicationDetails, handleViewApplicationBtnClick, hideIntro }) => {
    return <>
        { 
            !candidateApplicationPageActive && !hideIntro && <div className={`selected-applicant-details ${showApplicationDetails ? 'teamlead__Page' : ''}`} onClick={handleViewApplicationBtnClick}>
                <p>Application details: </p>
                { !hrPageActive &&<span>View <KeyboardArrowDownIcon className="down-icon" /></span> }
            </div>
        }

        {
            (hrPageActive || candidateApplicationPageActive || showApplicationDetails) && <div className={`selected-applicant-info ${candidateApplicationPageActive ? 'candidate__Page' : showApplicationDetails ? 'teamlead__Page' : ''}`}>
                {
                    !applicantData ?
                    <>
                        <span>Name</span>
                        <span>Country</span>
                        <span>Email ID</span>
                        <span>Freelance Platform</span>
                        <span>Profile Link of your Freelance</span>
                        <span>Academic Qualification</span>
                        <span>Discord Id</span>
                        <span>Comments, remarks</span>
                        <span>Speed test</span>
                    </> : 
                    <>
                    {
                        React.Children.toArray(Object.keys(applicantData || {}).map(key => {
                            
                            if ( excludedApplicantInfo.includes(key) || (typeof applicantData[key] === "object") ) return <></>

                            if (typeof applicantData[key] === "object") return <></>

                            if (key === mutableNewApplicationStateNames.applicant) return <span> <span className="highlight__Item">{applicantData[key].split("_")[0] === 'guest' ? 'Username' : 'Name' }:</span> {applicantData[key]}</span>
                            if (key === mutableNewApplicationStateNames.country) return <span><span className="highlight__Item">Country:</span> {applicantData[key]}</span>
                            if (key === mutableNewApplicationStateNames.freelancePlatform) return <span><span className="highlight__Item">Freelance Platform:</span> {applicantData[key]}</span>
                            if (key === mutableNewApplicationStateNames.freelancePlatformUrl) return <span><span className="highlight__Item">Freelance Platform Url:</span> {applicantData[key]}</span>
                            if (key === "job_title") return <span><span className="highlight__Item">Job title:</span> {applicantData[key]}</span>
                            if (key === "applicant_email") return <span><span className="highlight__Item">Email of applicant:</span> {applicantData[key]}</span>
                            if (key === "academic_qualification_type") return <span><span className="highlight__Item"> Qualification type:</span> {applicantData[key]}</span>
                            if (key === "academic_qualification") return <span><span className="highlight__Item">Qualification:</span> {applicantData[key]}</span>
                            if (key === "agree_to_all_terms") return <span><span className="highlight__Item">Agreed to terms:</span> {applicantData[key] === true ? "True" : "False"}</span>
                            if (key === "internet_speed") return <span><span className="highlight__Item">Internet speed:</span> {applicantData[key]}</span>
                            if (key === "_id") return null 
                            if (key === "job_number") return null 
                            if (key === "eventId") return null 
                            if (key === "company_id") return null 
                            if (key === "data_type") return null 
                            if (applicantData[key] === "" ) return null 
                            return <span><span className="highlight__Item">{changeToTitleCase(key.replace(/_/g, " "))}:</span> {applicantData[key] === true ? "True" : formatDateAndTime(applicantData[key])}</span>

                        }))
                    }

                    {
                        React.Children.toArray(Object.keys(applicantData.others || {}).map(key => {

                            if ( excludedApplicantInfo.includes(key) ) return <></>

                            if (key === mutableNewApplicationStateNames.others_property_qualification) return <span><span className="highlight__Item">Academic Qualification:</span> {applicantData.others[key]}</span>
                            if (key === mutableNewApplicationStateNames.others_property_qualification_type) return <span><span className="highlight__Item">Qualification Type:</span> {applicantData.others[key]}</span>
                            if (key === mutableNewApplicationStateNames.others_comments) return <span><span className="highlight__Item">Comments:</span> {applicantData.others[key]}</span>
                            if (key === mutableNewApplicationStateNames.others_applicant_first_name) return <span><span className="highlight__Item">First Name:</span> {applicantData.others[key]}</span>
                            if (key === mutableNewApplicationStateNames.others_applicant_email) return <span><span className="highlight__Item">Email:</span> {applicantData.others[key]}</span>
                            
                            return <span><span className="highlight__Item">{key}:</span> {applicantData.others[key]}</span>
                        }))
                    }
                    </>
                }
                
            </div>
        }
    </>
}

export default ApplicantDetails;
