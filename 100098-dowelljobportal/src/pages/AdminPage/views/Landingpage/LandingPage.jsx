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
const LandingPage = () => {
  const { jobs, setJobs } = useJobContext();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  console.log("jobs", jobs);
  useEffect(() => {
    if (jobs.length === 0) {
      axios
        .post(
          "https://100098.pythonanywhere.com/admin_management/get_jobs/",
          {
            company_id: currentUser.portfolio_info[0].org_id,
          },
          []
        )
        .then((response) => {
          setJobs(response.data.response.data.filter(job => job.data_type === currentUser.portfolio_info[0].data_type ).filter(job => job.data_type !== "archive_data"));
          console.log(response.data.response.data);
          console.log(response.data.response.data.filter(job => job.data_type === currentUser.portfolio_info[0].data_type ).filter(job => job.data_type !== "archive_data").map(j => j.data_type));
        })
        .catch((error) => console.log(error));
    }
    // const handleDeleteOfJob = (id) => {
    //   const newJob = [...jobs];
    //   newJob.splice(newJob.indexOf(id), 1);
    //   setJobs(newJob);
    // };

    // User portfolio has already being loaded
    if (currentUser.userportfolio.length > 0) return;

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
        console.log(res.data.portfolio_info[0].data_type) ;
      })
      .catch((err) => {
        console.log("Failed to get user details from login API");
        console.log(err.response ? err.response.data : err.message);
      });
  }, []);

  return (
    <StaffJobLandingLayout
      adminView={true}
      handleNavIconClick={() => navigate("/add-job")}
    >
      <div className="landing-page">
        <div className="cards">
          {jobs.length > 0 ? (
            jobs.filter(job => job.data_type === currentUser.portfolio_info[0].data_type )
              .map((job, index) => (
                <Card {...job} key={index} jobs={jobs} setJobs={setJobs} />
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
