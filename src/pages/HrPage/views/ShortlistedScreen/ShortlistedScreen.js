import React, { useState } from 'react';
import './Hr_AppliedScreen.css';
import SelectedCandidates from '../../../TeamleadPage/components/SelectedCandidates/SelectedCandidates';
import JobTile from '../../../TeamleadPage/components/JobTile/JobTile';
import { useNavigate } from 'react-router-dom';
import JobCard from '../../../../components/JobCard/JobCard';
import { IoMdClose, IoMdRefresh } from "react-icons/io";
import { BsEye } from 'react-icons/bs';
import SubmitResponseModal from '../../../CandidatePage/views/TraningProgress.js/SubmitResponseModal/SubmitResponseModal';

function ShortlistedScreen({ shortlistedCandidates, jobData, handleRefreshForCandidateApplications, candidateTrainingResponses, hideSideNavBar }) {
  const navigate = useNavigate();
  const [ currentData, setCurrentData ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ showCandidateTrainingResponse, setShowCandidateTrainingResponse ] = useState(false);
  const [ candidateResponse, setCandidateResponse ] = useState(null);

  const handleClick = (data) => {
    setCurrentData(data);
    setShowModal(true);
    hideSideNavBar(true);

    const foundCandidateResponse = candidateTrainingResponses?.find(response => response.username === data.username);
    if (!foundCandidateResponse) return
    setCandidateResponse(foundCandidateResponse);
  }
  
  const handleViewApplication = () => {
    hideSideNavBar(false);
    navigate(`/job/after_initial_meet/${currentData?.applicant}`, { state: { candidate: currentData } });
  }

  const handleViewResponse = () => {
    setShowModal(false);
    hideSideNavBar(false);

    setShowCandidateTrainingResponse(true);
  }

  const handleCloseModal = () => {
    setShowModal(false)
    hideSideNavBar(false)
  }


  return (
    <div className="Applied__wrapper">
      <button
        className="refresh-container"
        onClick={handleRefreshForCandidateApplications}
      >
        <div className="refresh-btn">
          <IoMdRefresh />
          <p>Refresh</p>
        </div>
      </button>
      <div className="Applied__container">
        <SelectedCandidates
          title={"Shortlisted Candidates"}
          candidatesCount={
            shortlistedCandidates ? shortlistedCandidates.length : 0
          }
          hrPageActive={true}
        />
        {shortlistedCandidates &&
          React.Children.toArray(
            shortlistedCandidates.map((candidate) => {
              return (
                <JobCard
                  candidateData={candidate}
                  candidateCardView={true}
                  jobAppliedFor={
                    jobData.find(
                      (job) => job.job_number === candidate.job_number
                    )
                      ? jobData.find(
                          (job) => job.job_number === candidate.job_number
                        ).job_title
                      : ""
                  }
                  buttonText={"View"}
                  handleBtnClick={handleClick}
                />
              );
              // <JobTile hrPageActive={true} candidateData={candidate} setShowCandidate={() => {}} handleJobTileClick={handleClick} jobsSkills={jobData.filter(job => job.job_number === candidate.job_number).length >=1 ? jobData.filter(job => job.job_number === candidate.job_number)[0].skills : ""} />
            })
          )}

          {showModal && (
            <>
              <div className={'modal__Overlay'}>
                <div className={'modal__Container'}>
                  <div
                    className={'close__Container'}
                    onClick={handleCloseModal}
                  >
                    <IoMdClose />
                  </div>
                  <div className='view__Shortlisted__Options'>
                    <div className='option__Item'>
                      <div className='iconn'>
                        <BsEye />
                      </div>
                      <h3>View application</h3>
                      <p className='subtitle'>View candidate application to make further decisions on the candidate</p>
                      <button className='view__Short__Btn' onClick={handleViewApplication}>
                        View
                      </button>
                    </div>
                    <div className='option__Item'>
                      <div className='iconn'>
                        <BsEye />
                      </div>
                      <h3>View training response</h3>
                      <p className='subtitle'>
                        {
                          !candidateResponse ?
                          "Candidate has not yet submitted a response to the questions you set"
                          :
                          "View candidate training response to questions you set"
                        }
                      </p>
                      <button className='view__Short__Btn' disabled={candidateResponse ? false : true} onClick={handleViewResponse}>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
      </div>
      
      {
        showCandidateTrainingResponse && <>
          <SubmitResponseModal 
            closeModal={() => setShowCandidateTrainingResponse(false)}
            inputValuesAreReadOnly={true}
            inputValues={candidateResponse}
            isHrView={true}
          />
        </>
      }
    </div>
  );
}

export default ShortlistedScreen