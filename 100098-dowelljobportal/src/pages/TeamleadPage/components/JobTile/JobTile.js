import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FiEdit } from 'react-icons/fi';

import "./style.css";
import DropdownButton from '../DropdownButton/Dropdown';
import { mutableNewApplicationStateNames } from '../../../../contexts/NewApplicationContext';
import { formatDateAndTime } from '../../../../helpers/helpers';

const JobTile = ({ setShowCandidate, showTask, setShowCandidateTask, disableClick, candidateData, jobData, handleJobTileClick, taskData, hrPageActive, routeToJob, adminPageActive, handleEditIconClick, candidateForJobCount, jobsSkills, jobTitle, handleViewBtnClick }) => {

    const handleJobItemClick = ( currentData ) => {
        if (disableClick) return

        if (showTask) {
            handleJobTileClick(currentData.user);
            return setShowCandidateTask(true);
        }

        handleJobTileClick(currentData);

        setShowCandidate(true);
    }

    return <>
        <div className={`job-tile-container job__Container ${adminPageActive ? 'rel__Pos' : ''}`} onClick={() => routeToJob ? handleJobTileClick(jobData) : handleJobItemClick(showTask ? taskData : candidateData)}>
            {
                jobData ? <>
                    <div className={`job__Details ${adminPageActive ? 'flex__Display' : ''}`}>
                        <h2><b>{jobData.title && jobData.title.length > 21 ? jobData.title.slice(0, 21) + "..." : jobData.title}</b></h2>
                        {
                            adminPageActive && <div className="edit__Job__Container" onClick={() => handleEditIconClick(jobData)}>
                                <FiEdit />
                                <span>Edit</span>  
                            </div>
                        }
                    </div>
                    <p>Skills: {jobData.skills && jobData.skills.length > 20 ? jobData.skills.slice(0, 21) + "..." : jobData.skills}</p>
                    <div className={`job__Details__Container`}>
                        <div className="job__Detail__Item">
                            <BusinessCenterIcon />
                            <span>{jobData.time_period}</span>
                        </div>

                        <div className="job__Tile__Bottom__Row">
                            <span>{candidateForJobCount} candidates applied for this role</span>
                            <div className="view-application-btn" onClick={() => adminPageActive ? handleViewBtnClick(jobData) : routeToJob ? handleJobTileClick(jobData) : handleJobItemClick(showTask ? taskData : candidateData)}>
                                <span>View</span>
                                <ArrowForwardIcon />
                            </div>
                        </div>

                    </div>
                    
                    {
                        adminPageActive && 
                        
                        <DropdownButton
                            adminPageActive={true}
                            currentSelection={jobData.is_active ? 'Active' : 'Inactive'}
                            selections={['Active', 'Inactive']}
                        />
                    }
                    
                </> : 
                
                <>
                    <div className="applicant-details">
                        <h2><b>{showTask ? taskData.user.length > 17 ? taskData.user.slice(0, 17) + "..." : taskData.user : hrPageActive ? candidateData[mutableNewApplicationStateNames.applicant] && candidateData[mutableNewApplicationStateNames.applicant] : candidateData.applicant && candidateData.applicant.length > 20 ? candidateData.applicant.slice(0, 21) + "..." : candidateData.applicant}</b></h2>
                        <p>{showTask ? formatDateAndTime(taskData.created) : formatDateAndTime(candidateData.others[mutableNewApplicationStateNames.others_date_applied])}</p>
                    </div>
                    <p>{hrPageActive ? `` : `Job: ${showTask ? taskData.title : jobTitle}` }</p>
                    <div className={`applicant-qualifications-container ${showTask ? 'task-active' : ''}`}>
                        {
                            showTask ? <></> :
                        
                            <div className="applicant-experience">
                                <BusinessCenterIcon />
                                <span>{candidateData.time_period}</span>
                            </div>
                        }

                        <div className="view-application-btn" onClick={() => routeToJob ? handleJobTileClick(jobData) : handleJobItemClick(showTask ? taskData : candidateData)}>
                            <span>View</span>
                            <ArrowForwardIcon />
                        </div>
                    </div>
                </>
            }
            
        </div>
    </>
}

export default JobTile;
