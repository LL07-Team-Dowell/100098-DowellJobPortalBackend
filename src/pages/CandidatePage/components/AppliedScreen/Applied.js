import React, { useState, useEffect } from 'react';
import './Applied.css';
import { mutableNewApplicationStateNames } from '../../../../contexts/NewApplicationContext';
import TogglerNavMenuBar from '../../../../components/TogglerNavMenuBar/TogglerNavMenuBar';
import JobCard from '../../../../components/JobCard/JobCard';
import { candidateStatuses } from '../../utils/candidateStatuses';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useCandidateJobsContext } from '../../../../contexts/CandidateJobsContext';
import { getAppliedJobs, getJobs } from '../../../../services/candidateServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';


function Applied() {
  const [currentNavigationTab, setCurrentNavigationTab] = useState("Applied");
  const { candidateJobs, setCandidateJobs } = useCandidateJobsContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (candidateJobs.appliedJobs.length > 0) return setLoading(false);
    const datass = currentUser.portfolio_info[0].org_id;
    getAppliedJobs(datass).then(async (res) => {
      const userApplication = res.data.response.data.filter(
        (application) => application.data_type === currentUser?.portfolio_info[0].data_type
      );
      // console.log(appliedJobs);
      try {
        const jobs = await (await getJobs(datass));
        // console.log(jobs);
        const userAppliedJobs = jobs.data.response.data.filter(
          (currentJob) => currentJob.data_type === currentUser?.portfolio_info[0].data_type
        )
        // if (Array.isArray(candidateJobs.appliedJobs) && candidateJobs.appliedJobs.length > 1) return setLoading(false);
        const currentUserApplications = userApplication.filter(
          (application) =>
            application.username === currentUser.userinfo.username
        );
        const currentUserAppliedJobs = userAppliedJobs.filter((currentJob) =>
          currentUserApplications.find(
            ({ job_number }) => currentJob.job_number === job_number
          )
        );
        console.log(currentUserAppliedJobs);
        setCandidateJobs((prevJobs) => { return { ...prevJobs, "appliedJobs": currentUserAppliedJobs } });
        setCandidateJobs((prevJobs) => { return { ...prevJobs, "currentUserApplications": currentUserApplications } });
        setCandidateJobs((prevJobs) => { return { ...prevJobs, "userInterviews": currentUserApplications.filter(application => application.status === candidateStatuses.PENDING_SELECTION) } })
        return setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }

    }).catch(err => {
      console.log(err);
      setLoading(false);
    })

  }, [])

  return <>
    <TogglerNavMenuBar className={"applied__Nav__Toggler"} menuItems={["Applied", "Interview", "Declined"]} handleMenuItemClick={(item) => setCurrentNavigationTab(item)} currentActiveItem={currentNavigationTab} />
    <div className="candidate__View__Applications__Container">
      {
        loading ? <LoadingSpinner /> :

          currentNavigationTab === "Applied" ? <>
            {
              React.Children.toArray(candidateJobs.currentUserApplications.map(application => {
                return <JobCard
                  job={candidateJobs.appliedJobs.find(job => job.job_number === application.job_number)}
                  showCandidateAppliedJob={true}
                  buttonText={"View"}
                  candidateData={application}
                  handleBtnClick={
                    candidateJobs.appliedJobs.find(job => job.job_number === application.job_number) ? 
                      () => navigate(
                        "/applied/view_job_application", 
                        { 
                          state: { 
                            jobToView: candidateJobs.appliedJobs.find(job => job.job_number === application.job_number), 
                            applicationDetails: application
                          } 
                        }
                      )
                    :
                    () => {}
                  }
                />
              }))
            }
          </> :

            currentNavigationTab === "Interview" ? <>
              {
                React.Children.toArray(candidateJobs.userInterviews.map(interview => {
                  return <JobCard
                    job={candidateJobs.appliedJobs.find(job => job.job_number === interview.job_number)}
                    interviewDetails={interview}
                    showCandidateInterview={true}
                    guestUser={false}
                    currentApplicationStatus={interview?.status}
                    handleBtnClick={
                      () => window.open(interview.server_discord_link, "_blank")
                    }
                    buttonText={"Discord"}
                  />
                }))
              }
            </> :

              currentNavigationTab === "Declined" ? <>
                {
                  React.Children.toArray(candidateJobs.appliedJobs.filter(job => job.status === candidateStatuses.REJECTED).map(appliedJob => {
                    return <JobCard
                      job={appliedJob}
                      applicationDetails={candidateJobs.currentUserApplications.find(application => application.job === appliedJob.id)}
                      showCandidateDeclinedJob={true}
                      buttonText={"Closed"}
                    />
                  }))
                }
              </> : <></>
      }
    </div>
  </>
}

export default Applied;
