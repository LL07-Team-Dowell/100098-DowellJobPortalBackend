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
import {
  s,
  useCurrentUserContext,
} from "../../../../contexts/CurrentUserContext";
import {
  getApplicationForAdmin,
  getCreatedProductLinks,
  getJobsFromAdmin,
  getMasterLinks,
} from "../../../../services/adminServices";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { getSettingUserProject } from "../../../../services/hrServices";
import { testingRoles } from "../../../../utils/testingRoles";

const LandingPage = ({ subAdminView }) => {
  const [stateTrackingProgress, setstateTrackingProgress] = useState(false);
  const [isActive, setIsActive] = useState("active");
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
    setProductLinks,
    productLinks,
  } = useJobContext();
  const [showShareModal, setShowShareModal] = useState(false);
  const [jobLinkToShareObj, setJobLinkToShareObj] = useState({});
  const [activeLinkTab, setActiveLinkTab] = useState("jobs");
  const [cardGroupNumber, setCardGroupNumber] = useState(0);

  // low functions
  const changeCardGroupNumber = (number) => {
    setCardGroupNumber(number);
  };

  const ChangeCardGroupNumberAction = (cards, action) => {
    const cardsGroupLength = Number.ceil(cards.length / 4);
    if (action == "add") {
      if (cardsGroupLength <= cardGroupNumber) return;
      setCardGroupNumber((cardGroupNumber) => cardGroupNumber + 1);
    } else if (action == "back") {
      if (cardsGroupLength <= 0) return;
      setCardGroupNumber((cardGroupNumber) => cardGroupNumber - 1);
    }
  };

  const handleSearchChange = (value) => {
    console.log("kasaksldjalksdjalksdjlkjsakl");
    setsearchValue(value);
    setJobs(
      jobs2.filter(
        (job) =>
          job.job_title.toLowerCase().includes(value.toLowerCase()) ||
          job.skills.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getApplicationForAdmin(currentUser?.portfolio_info[0].org_id)
      .then((resp) => {
        setlist(
          resp?.data?.response?.data?.filter(
            (j) => currentUser.portfolio_info[0].data_type === j.data_type
          )
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUserContext();

  console.log("currentUser", currentUser);
  // console.log("jobs", jobs);

  useEffect(() => {
    if (jobs?.length === 0 && !resp) {
      Promise.all([
        getJobsFromAdmin(currentUser.portfolio_info[0].org_id),
        getMasterLinks(currentUser.portfolio_info[0].org_id),
        getSettingUserProject(),
        getCreatedProductLinks(currentUser.portfolio_info[0].org_id),
      ])
        .then((response) => {
          console.log(
            "AAAAAAAA",
            response[0]?.data?.response?.data?.filter(
              (job) => job.data_type === currentUser.portfolio_info[0].data_type
            )
          );
          setJobs(
            response[0]?.data?.response?.data
              ?.reverse()
              ?.filter(
                (job) =>
                  job.data_type === currentUser.portfolio_info[0].data_type
              )
              ? response[0]?.data?.response?.data
                  ?.reverse()
                  ?.filter(
                    (job) =>
                      job.data_type === currentUser.portfolio_info[0].data_type
                  )
                  .reverse()
              : []
          );
          setjobs2(
            response[0]?.data?.response?.data
              ?.reverse()
              ?.filter(
                (job) =>
                  job.data_type === currentUser.portfolio_info[0].data_type
              )
              ? response[0]?.data?.response?.data
                  ?.reverse()
                  ?.filter(
                    (job) =>
                      job.data_type === currentUser.portfolio_info[0].data_type
                  )
                  .reverse()
              : []
          );
          setresponse(true);

          setJobLinks([
            ...new Map(
              response[1]?.data?.master_link
                ?.reverse()
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setProductLinks([
            ...new Map(
              response[3]?.data?.response
                ?.reverse()
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          const projectsGotten = response[2]?.data
            ?.filter(
              (project) =>
                project?.data_type ===
                  currentUser.portfolio_info[0].data_type &&
                project?.company_id === currentUser.portfolio_info[0].org_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse();

          setProjectsLoaded(true);
          setProjectsLoading(false);

          if (projectsGotten.length < 1) return;

          setProjectsAdded(projectsGotten);
        })
        .catch((error) => {
          console.log(error);
          setresponse(true);
        });
    }
    if (currentUser?.userportfolio?.length > 0) return;

    const currentSessionId = sessionStorage.getItem("session_id");

    if (!currentSessionId) return;
    const teamManagementProduct = currentUser?.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return;

    if (
      (currentUser.settings_for_profile_info &&
        currentUser.settings_for_profile_info.profile_info[
          currentUser.settings_for_profile_info.profile_info.length - 1
        ].Role === testingRoles.superAdminRole) ||
      currentUser.isSuperAdmin
    )
      return;

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
      view: "public",
      job_company_id: currentUser?.portfolio_info[0].org_id,
      job_id: jobId,
      company_data_type: currentUser?.portfolio_info[0]?.data_type,
      job_name: jobName,
    });
  };

  const handleCopyLink = async (link) => {
    await navigator.clipboard.writeText(decodeURIComponent(link));
    toast.success("Link copied to clipboard!");
  };

  console.log({ searchValue });
  const EditActiveCardStatus = (id) => {
    console.log({ id });
    setJobs(
      jobs.map((job) => {
        if (job._id !== id) return job;
        return { ...job, is_active: !job.is_active };
      })
    );
    setjobs2(
      jobs.map((job) => {
        if (job._id !== id) return job;
        return { ...job, is_active: !job.is_active };
      })
    );
  };
  function createArrayWithLength(length) {
    return Array.from({ length }, (_, index) => index);
  }
  const activeJobsLength = jobs
    .filter((job) => job.data_type === currentUser.portfolio_info[0].data_type)
    .filter((v) => v.is_active === true).length;
  const inactiveJobsLength = jobs
    ?.filter((job) => job.data_type === currentUser.portfolio_info[0].data_type)
    ?.filter((v) => v.is_active === false).length;
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
        <p
          onClick={() => {
            setIsActive("active");
            setCardGroupNumber(0);
          }}
          className={isActive === "active" && "isActive"}
        >
          Active jobs
        </p>
        <p
          onClick={() => {
            setIsActive("inactive");
            setCardGroupNumber(0);
          }}
          className={isActive === "inactive" && "isActive"}
        >
          Inactive jobs
        </p>
        <p
          onClick={() => {
            setIsActive("links");
            setCardGroupNumber(0);
          }}
          className={isActive === "links" && "isActive"}
        >
          Links
        </p>
      </div>
      {/* asd */}
      <div className="JobsChanger_containter">
        {createArrayWithLength(
          isActive
            ? Math.ceil(activeJobsLength / 4)
            : Math.ceil(inactiveJobsLength / 4)
        ).map((s, index) => (
          <button
            className={s !== cardGroupNumber ? "active" : "desactive"}
            onClick={() => changeCardGroupNumber(s + 1)}
          >
            {s + 1}
          </button>
        ))}
      </div>
      <div className="landing-page">
        {isActive === "links" && (
          <div className="landing_Nav_Wrapper">
            <div
              className={`landing_Nav_Item ${
                activeLinkTab === "jobs" ? "active" : ""
              }`}
              onClick={() => setActiveLinkTab("jobs")}
            >
              <p>Job links</p>
              <span></span>
            </div>
            <div
              className={`landing_Nav_Item ${
                activeLinkTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveLinkTab("products")}
            >
              <p>Product links</p>
              <span></span>
            </div>
          </div>
        )}
        <div className="cards">
          {(jobs?.length === 0 && searchValue) ||
          (jobs?.length === 0 && resp) ? (
            <h3 style={{ textAlign: "center" }}>
              You have not created any jobs yet
            </h3>
          ) : jobs?.length > 0 ? (
            isActive === "active" ? (
              jobs
                .filter(
                  (job) =>
                    job.data_type === currentUser.portfolio_info[0].data_type
                )
                .filter((v) => v.is_active === true)
                .slice(cardGroupNumber, cardGroupNumber + 4)
                .map((job, index) => (
                  <Card
                    {...job}
                    key={`job-Active-${job._id}`}
                    jobs={jobs}
                    setJobs={setJobs}
                    setShowOverlay={setstateTrackingProgress}
                    handleShareIconClick={(passedJobId, passedJobName) =>
                      handleShareIconClick(passedJobId, passedJobName)
                    }
                    index={index}
                    EditActiveCardStatus={EditActiveCardStatus}
                  />
                ))
            ) : isActive === "inactive" ? (
              jobs
                ?.filter(
                  (job) =>
                    job.data_type === currentUser.portfolio_info[0].data_type
                )
                ?.filter((v) => v.is_active === false)
                .slice(cardGroupNumber, cardGroupNumber + 4)
                ?.map((job, index) => (
                  <Card
                    {...job}
                    key={`job-InActive-${job._id}`}
                    jobs={jobs}
                    setJobs={setJobs}
                    setShowOverlay={setstateTrackingProgress}
                    handleShareIconClick={(passedJobId, passedJobName) =>
                      handleShareIconClick(passedJobId, passedJobName)
                    }
                    index={index}
                    EditActiveCardStatus={EditActiveCardStatus}
                  />
                ))
            ) : (
              <>
                {activeLinkTab === "products" && (
                  <>
                    {productLinks.length < 1 ? (
                      <div>
                        <p>You have not created any links yet</p>
                      </div>
                    ) : (
                      React.Children.toArray(
                        productLinks.map((link) => {
                          return (
                            <div className="job__Link__Wrapper">
                              <p>{link.link_name}</p>
                              <div
                                className="job__Link__Container"
                                onClick={() => handleCopyLink(link.master_link)}
                              >
                                <span>{link.master_link}</span>
                                <IoCopyOutline />
                              </div>
                            </div>
                          );
                        })
                      )
                    )}
                  </>
                )}
                {activeLinkTab === "jobs" && (
                  <>
                    {jobLinks.length < 1 ? (
                      <div>
                        <p>You have not created any links yet</p>
                      </div>
                    ) : (
                      React.Children.toArray(
                        jobLinks.map((link) => {
                          return (
                            <div className="job__Link__Wrapper">
                              {link.newly_created ? (
                                <p>{link.job_name}</p>
                              ) : (
                                jobs.find((job) => job._id === link.job_id) && (
                                  <p>
                                    {
                                      jobs.find(
                                        (job) => job._id === link.job_id
                                      )?.job_title
                                    }
                                  </p>
                                )
                              )}
                              <div
                                className="job__Link__Container"
                                onClick={() => handleCopyLink(link.master_link)}
                              >
                                <span>{link.master_link}</span>
                                <IoCopyOutline />
                              </div>
                            </div>
                          );
                        })
                      )
                    )}
                  </>
                )}
              </>
            )
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default LandingPage;
