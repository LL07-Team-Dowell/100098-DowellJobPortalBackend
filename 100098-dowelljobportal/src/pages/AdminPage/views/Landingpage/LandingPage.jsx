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
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getApplicationForAdmin, getJobsFromAdmin } from "../../../../services/adminServices";
import { useState } from "react";
const LandingPage = ({subAdminView}) => {

  const [ stateTrackingProgress , setstateTrackingProgress ] = useState(false) ;

  const { jobs, setJobs , setlist , jobs2 , setjobs2 , searchValue ,setsearchValue ,resp , setresponse  } = useJobContext();
  const handleSearchChange = (value) =>{
    console.log("kasaksldjalksdjalksdjlkjsakl") 
    setsearchValue(value) ; 
    setJobs(jobs2.filter(job => job.job_title.toLowerCase().includes(value.toLowerCase()) || job.skills.toLowerCase().includes(value.toLowerCase())))

  }

  useEffect(() => {
    getApplicationForAdmin({ company_id: currentUser?.portfolio_info[0].org_id })
      .then(resp => {
        setlist(resp.data.response.data.filter(j => currentUser.portfolio_info[0].data_type === j.data_type));
      })
      .catch(err => console.log(err))
  }, [])
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  // console.log("currentUser", currentUser)
  // console.log("jobs", jobs);
  useEffect(() => {
    if (jobs.length === 0) {

      getJobsFromAdmin({ company_id: currentUser.portfolio_info[0].org_id })
        .then((response) => {
          console.log('AAAAAAAA',response.data.response.data.filter(job => job.data_type === currentUser.portfolio_info[0].data_type )) ; 
          setJobs(response.data.response.data.reverse().filter(job => job.data_type === currentUser.portfolio_info[0].data_type ));
          setjobs2(response.data.response.data.reverse().filter(job => job.data_type === currentUser.portfolio_info[0].data_type )) ; 
          setresponse(true);
          
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


  console.log({ searchValue });
  return (
    <StaffJobLandingLayout
      adminView={true}
      handleNavIconClick={() => navigate("/add-job")}
      searchValue={searchValue}
      setSearchValue={handleSearchChange}
      subAdminView={subAdminView}
      showLoadingOverlay={stateTrackingProgress}
      modelDurationInSec={5.81}
    >
      <div className="landing-page">
        <div className="cards">
          {
            jobs.length === 0 && searchValue || jobs.length === 0  && resp ? <h1>No Job Found</h1>
            :
            jobs.length > 0 ? (
              jobs.filter(job => job.data_type === currentUser.portfolio_info[0].data_type )
                .map((job, index) => (
                  <Card {...job} key={index} jobs={jobs} setJobs={setJobs} setShowOverlay={setstateTrackingProgress} />
                ))
            ) : (
              <Loading />
            )}
          
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default LandingPage;
