import React, { useContext, useEffect } from "react";
import { useJobContext } from "../../../../contexts/Jobs";
import "./index.scss";
import backpage from "./assets/backpage.svg";
import plus from "./assets/plus.svg";
import search from "./assets/search.svg";
import Card from "./component/Card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../../CandidatePage/views/ResearchAssociatePage/Loading";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import { s, useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getApplicationForAdmin, getJobsFromAdmin, getMasterLinks } from "../../../../services/adminServices";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { getSettingUserProject } from "../../../../services/hrServices";
import { testingRoles } from "../../../../utils/testingRoles";
 

const LandingPage = ({ subAdminView }) => {

  const [stateTrackingProgress, setstateTrackingProgress] = useState(false);
  const [isActive, setIsActive] = useState('active') ;
  const { 
    jobs, 
    setJobs, 
    setlist, 
    jobs2, 
    setjobs2, 
    searchValue, 
    setsearchValue, 
    resp, 
    setresponse, 
    jobLinks, 
    setJobLinks, 
    setProjectsAdded,
    setProjectsLoaded,
    setProjectsLoading,
  } = useJobContext();
  const [ showShareModal, setShowShareModal ] = useState(false);
  const [ jobLinkToShareObj, setJobLinkToShareObj ] = useState({});

  const handleSearchChange = (value) => {
    console.log("kasaksldjalksdjalksdjlkjsakl")
    setsearchValue(value);
    setJobs(jobs2.filter(job => job.job_title.toLowerCase().includes(value.toLowerCase()) || job.skills.toLowerCase().includes(value.toLowerCase())))

  }

  useEffect(() => {
    getApplicationForAdmin(currentUser?.portfolio_info[0].org_id)
      .then(resp => {
        setlist(resp?.data?.response?.data?.filter(j => currentUser.portfolio_info[0].data_type === j.data_type));
      })
      .catch(err => console.log(err))
  }, [])

  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  
  console.log("currentUser", currentUser)
  // console.log("jobs", jobs);

  useEffect(() => {
    if (jobs?.length === 0 && !resp) {

      Promise.all([
        getJobsFromAdmin(currentUser.portfolio_info[0].org_id),
        getMasterLinks(currentUser.portfolio_info[0].org_id),
        getSettingUserProject(),
      ]).then((response) => {
        console.log('AAAAAAAA', response[0]?.data?.response?.data?.filter(job => job.data_type === currentUser.portfolio_info[0].data_type));
        setJobs(
          response[0]?.data?.response?.data?.reverse()?.filter(job => job.data_type === currentUser.portfolio_info[0].data_type) ?
          response[0]?.data?.response?.data?.reverse()?.filter(job => job.data_type === currentUser.portfolio_info[0].data_type)
          :
          []
        );
        setjobs2(
          response[0]?.data?.response?.data?.reverse()?.filter(job => job.data_type === currentUser.portfolio_info[0].data_type) ?
          response[0]?.data?.response?.data?.reverse()?.filter(job => job.data_type === currentUser.portfolio_info[0].data_type)
          : 
          []
        );
        setresponse(true);

        setJobLinks(response[1].data?.master_link)

        const projectsGotten = response[2].data
        ?.filter(
          (project) =>
            project?.data_type === currentUser.portfolio_info[0].data_type &&
            project?.company_id === currentUser.portfolio_info[0].org_id &&
            project.project_list &&
            project.project_list.every(
              (listing) => typeof listing === "string"
            )
        )
        ?.reverse()

        setProjectsLoaded(true);
        setProjectsLoading(false);

        if (projectsGotten.length < 1) return

        setProjectsAdded(projectsGotten);
      })
      .catch((error) => console.log(error));
    }
    if (currentUser?.userportfolio?.length > 0) return;

    const currentSessionId = sessionStorage.getItem("session_id");

    if (!currentSessionId) return;
    const teamManagementProduct = currentUser?.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return;

    if (
      (
        currentUser.settings_for_profile_info && 
        currentUser.settings_for_profile_info.profile_info[0].Role === testingRoles.superAdminRole
      ) || 
      (
        currentUser.isSuperAdmin
      )
    ) return

    const dataToPost = {
      session_id: currentSessionId,
      product: teamManagementProduct.product,
    };

    getUserInfoFromLoginAPI(dataToPost)
      .then((res) => {
        setCurrentUser(res.data);
        console.log(res.data.portfolio_info[0].data_type);
      })
      .catch((err) => {
        console.log("Failed to get user details from login API");
        console.log(err.response ? err.response.data : err.message);
      });
  }, []);

  const handleShareIconClick = (jobId, jobName) => {
    // console.log(jobId);
    setShowShareModal(true);
    setJobLinkToShareObj({
      view: 'public',
      job_company_id: currentUser?.portfolio_info[0].org_id,
      job_id: jobId,
      company_data_type: currentUser?.portfolio_info[0]?.data_type,
      job_name: jobName,
    });
  }

  

  const handleCopyLink = async (link) => {
    await navigator.clipboard.writeText(decodeURIComponent(link));
    toast.success('Link copied to clipboard!')
  }


  console.log({ searchValue });
  const EditActiveCardStatus = (id) => {
    console.log({id})
    setJobs(jobs.map(job => {
      if(job._id !== id) return job
      return {...job,is_active:!job.is_active} 
    }))
    setjobs2(jobs.map(job => {
      if(job._id !== id) return job
      return {...job,is_active:!job.is_active} 
    }))
  }
  return (
    <StaffJobLandingLayout
      adminView={true}
      handleNavIconClick={() => navigate("/add")}
      searchValue={searchValue}
      setSearchValue={handleSearchChange}
      subAdminView={subAdminView}
      showLoadingOverlay={stateTrackingProgress}
      modelDurationInSec={5.81}
      showShareModalForJob={showShareModal}
      jobLinkToShareObj={jobLinkToShareObj}
      handleCloseShareJobModal={() => setShowShareModal(false)}
    >
      <div className="isActive-container">
        <p onClick={()=>setIsActive('active')} className={isActive === 'active' && 'isActive'}>Active jobs</p>
        <p onClick={()=>setIsActive('inactive')} className={isActive === 'inactive' && 'isActive'}>Inactive jobs</p>
        <p onClick={() => setIsActive('links')} className={isActive === 'links' && 'isActive'}>Job Links</p>
      </div>
      <div className="landing-page">
        <div className="cards">
          {
            jobs?.length === 0 && searchValue || jobs?.length === 0 && resp ? <h3 style={{ textAlign: 'center' }}>You have not created any jobs yet</h3>
              :
              jobs?.length > 0 ? (
                isActive === 'active' ? 
                 jobs
                 .filter(job => job.data_type === currentUser.portfolio_info[0].data_type)
                 .filter(v => v.is_active === true)
                  .map((job, index) => (
                    <Card 
                      {...job} 
                      key={`job-Active-${index}`} 
                      jobs={jobs} 
                      setJobs={setJobs} 
                      setShowOverlay={setstateTrackingProgress} 
                      handleShareIconClick={(passedJobId, passedJobName) => handleShareIconClick(passedJobId, passedJobName)}
                      index={index}
                      EditActiveCardStatus={EditActiveCardStatus}
                    />
                  ))
                :
                 isActive === 'inactive' ? 
                  jobs
                  ?.filter(job => job.data_type === currentUser.portfolio_info[0].data_type)
                  ?.filter(v => v.is_active === false)
                  ?.map((job, index) => (
                    <Card 
                      {...job} 
                      key={`job-InActive-${index}`} 
                      jobs={jobs} 
                      setJobs={setJobs} 
                      setShowOverlay={setstateTrackingProgress} 
                      handleShareIconClick={(passedJobId, passedJobName) => handleShareIconClick(passedJobId, passedJobName)}
                      index={index}
                      EditActiveCardStatus={EditActiveCardStatus}
                    />
                  ))
                :
                <>
                  {
                    React.Children.toArray(jobLinks.map(link => {
                      return <div className="job__Link__Container" onClick={() => handleCopyLink(link)}>
                        <span>{link}</span>
                        <IoCopyOutline />
                      </div>
                    }))
                  }
                </>
              ) : (
                <Loading />
              )}

        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default LandingPage;
