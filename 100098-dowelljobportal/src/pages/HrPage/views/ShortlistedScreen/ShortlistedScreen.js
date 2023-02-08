import React from 'react';
import './Hr_AppliedScreen.css';
import SelectedCandidates from '../../../TeamleadPage/components/SelectedCandidates/SelectedCandidates';
import JobTile from '../../../TeamleadPage/components/JobTile/JobTile';
import { useNavigate } from 'react-router-dom';

function ShortlistedScreen({ shortlistedCandidates, jobData }) {
  const navigate = useNavigate();

  const handleClick = (data) => navigate(`/job/after_initial_meet/${data.applicant}`, { state: { candidate: data } });

  return (
    <div className='Applied__wrapper'>
      <div className='Applied__container'>
        <SelectedCandidates title={'Shortlisted Candidates'} candidatesCount={shortlistedCandidates ? shortlistedCandidates.length : 0} hrPageActive={true} />
        {
          shortlistedCandidates && React.Children.toArray(shortlistedCandidates.map(candidate => {
            return <JobTile hrPageActive={true} candidateData={candidate} setShowCandidate={() => {}} handleJobTileClick={handleClick} jobsSkills={jobData.filter(job => job.id === candidate.id).length >=1 ? jobData.filter(job => job.id === candidate.id)[0].skills : ""} />
          }))
        }
      </div>
    </div>
  )
}

export default ShortlistedScreen