import React from 'react';
import './Hr_AppliedScreen.css';
import SelectedCandidates from '../../../TeamleadPage/components/SelectedCandidates/SelectedCandidates';
import JobTile from '../../../TeamleadPage/components/JobTile/JobTile';
import { useNavigate } from 'react-router-dom';
import JobCard from '../../../../components/JobCard/JobCard';
import { IoMdRefresh } from "react-icons/io";

function ShortlistedScreen({ shortlistedCandidates, jobData, handleRefreshForCandidateApplications }) {
  const navigate = useNavigate();

  const handleClick = (data) => navigate(`/job/after_initial_meet/${data.applicant}`, { state: { candidate: data } });

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
      </div>
    </div>
  );
}

export default ShortlistedScreen