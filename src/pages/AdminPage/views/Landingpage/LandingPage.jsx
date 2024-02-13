import React, { useContext, useEffect } from "react";
import { useJobContext } from "../../../../contexts/Jobs";
import "./index.scss";
import Card from "./component/Card";
import { useNavigate } from "react-router-dom";
import Loading from "../../../CandidatePage/views/ResearchAssociatePage/Loading";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import {
  getCreatedProductLinks,
  getJobsFromAdmin,
  getMasterLinks,
  getSettingUserSubProject,
} from "../../../../services/adminServices";
import Select from "react-select";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { getSettingUserProject } from "../../../../services/hrServices";
import { testingRoles } from "../../../../utils/testingRoles";
import { teamManagementProductName } from "../../../../utils/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const LandingPage = ({ subAdminView }) => {
  const [stateTrackingProgress, setstateTrackingProgress] = useState(false);
  const [isActive, setIsActive] = useState("active");

  const navigate = useNavigate();
  const { 
    currentUser, 
    setCurrentUser,
    allApplications,
    userRemovalStatusChecked,
  } = useCurrentUserContext();

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
    setSubProjectsAdded,
    setSubProjectsLoaded,
    setSubProjectsLoading,
    setReportLinks,
    reportLinks,
    applicationsLoaded,
    setApplicationsLoaded,
    applications,
    dashboardDataLoaded,
  } = useJobContext();
  const [showShareModal, setShowShareModal] = useState(false);
  const [jobLinkToShareObj, setJobLinkToShareObj] = useState({});
  const [selectValue, setSelectValue] = useState("");
  const [activeLinkTab, setActiveLinkTab] = useState("jobs");
  const [cardGroupNumber, setCardGroupNumber] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardActivePagination, setCardActivePagination] = useState(0);
  const [cardInactivePagination, setCardInactivePagination] = useState(0);
  const initializePagination = () => {
    setCardActivePagination(0);
    setCardInactivePagination(0);
  };
  const incrementStepPagination = (steps, length, activeCard) => {
    if (steps + 1 <= length) {
      if (activeCard) {
        if (steps + cardActivePagination !== length) {
          setCardActivePagination(cardActivePagination + 1);
        }
      } else {
        if (steps + cardInactivePagination !== length) {
          setCardInactivePagination(cardInactivePagination + 1);
        }
      }
    }
  };
  const decrementStepPagination = (activeCard) => {
    if (activeCard) {
      if (cardActivePagination !== 0) {
        setCardActivePagination(cardActivePagination - 1);
      }
    } else {
      if (cardInactivePagination !== 0) {
        setCardInactivePagination(cardInactivePagination - 1);
      }
    }
  };
  // low functions
  const changeCardGroupNumber = (number) => {
    setCardGroupNumber(number);
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
    if (applicationsLoaded) return setlist(applications);

    if (!userRemovalStatusChecked) return;
    
    setlist(allApplications?.reverse());
    setApplicationsLoaded(true);
  }, [userRemovalStatusChecked, currentUser]);

  console.log("currentUser", currentUser);
  // console.log("jobs", jobs);

  useEffect(() => {
    if (dashboardDataLoaded) {
      setJobs(jobs);
      setjobs2(jobs);

      Promise.all([
        getMasterLinks(currentUser.portfolio_info[0].org_id),
        getCreatedProductLinks(currentUser.portfolio_info[0].org_id),
      ])
        .then((response) => {
          setJobLinks([
            ...new Map(
              response[0]?.data?.data
                ?.reverse()
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setProductLinks([
            ...new Map(
              response[1]?.data?.response
                ?.reverse()
                .filter((link) => link.type === "product")
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setReportLinks([
            ...new Map(
              response[1]?.data?.response
                ?.reverse()
                .filter((link) => link.type === "report")
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setresponse(true);
        })
        .catch((error) => {
          console.log(error);
          setresponse(true);
        });
    }

    if (jobs?.length === 0 && !resp && !dashboardDataLoaded) {
      Promise.all([
        getJobsFromAdmin(currentUser.portfolio_info[0].org_id),
        getMasterLinks(currentUser.portfolio_info[0].org_id),
        getSettingUserProject(),
        getCreatedProductLinks(currentUser.portfolio_info[0].org_id),
        getSettingUserSubProject(),
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
              response[1]?.data?.data
                ?.reverse()
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setProductLinks([
            ...new Map(
              response[3]?.data?.response
                ?.reverse()
                .filter((link) => link.type === "product")
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setReportLinks([
            ...new Map(
              response[3]?.data?.response
                ?.reverse()
                .filter((link) => link.type === "report")
                .map((link) => [link.master_link, link])
            ).values(),
          ]);

          setSubProjectsAdded(
            response[4]?.data?.data
              ?.filter(
                (item) =>
                  item.company_id === currentUser.portfolio_info[0].org_id &&
                  item.data_type === currentUser.portfolio_info[0].data_type
              )
              .reverse()
          );
          setSubProjectsLoading(false);
          setSubProjectsLoaded(true);

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
      (item) =>
        item.product === teamManagementProductName &&
        item.member_type === "owner"
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
    .filter((v) =>
      selectValue !== ""
        ? selectValue === "is_internal"
          ? v?.is_internal === true
          : selectValue === "not_internal"
          ? !v?.is_internal
          : v?.is_regional
        : true
    )
    .filter((v) => v.is_active === true).length;
  const inactiveJobsLength = jobs
    ?.filter((job) => job.data_type === currentUser.portfolio_info[0].data_type)
    ?.filter((v) =>
      selectValue !== ""
        ? selectValue === "is_internal"
          ? v?.is_internal === true
          : selectValue === "not_internal"
          ? !v?.is_internal
          : v?.is_regional
        : true
    )
    ?.filter((v) => v.is_active === false).length;
  console.log({ activeJobsLength, inactiveJobsLength });

  return (
    <StaffJobLandingLayout
      adminView={true}
      handleNavIconClick={() =>
        subAdminView ? navigate("/add-job") : navigate("/add")
      }
      searchValue={searchValue}
      setSearchValue={handleSearchChange}
      subAdminView={subAdminView}
      showLoadingOverlay={stateTrackingProgress}
      modelDurationInSec={5.81}
      showShareModalForJob={showShareModal}
      jobLinkToShareObj={jobLinkToShareObj}
      handleCloseShareJobModal={() => setShowShareModal(false)}
      newSidebarDesign={!subAdminView ? true : false}
    >
      <div className='isActive-container'>
        <p
          onClick={() => {
            setIsActive("active");
            setCardGroupNumber(0);
            initializePagination();
          }}
          className={isActive === "active" && "isActive"}
        >
          Active jobs
        </p>
        <p
          onClick={() => {
            setIsActive("inactive");
            setCardGroupNumber(0);
            initializePagination();
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
      <Select
        className='select__jobs'
        options={[
          { label: "Internal", value: "is_internal" },
          { label: "Public", value: "not_internal" },
          { label: "Regional", value: "Regional" },
        ]}
        onChange={(val) => {
          setSelectValue(val.value);
        }}
        placeholder={"Filter job"}
      />
      <div
        className={`landing-page ${
          isActive === "active" || isActive === "inactive" ? "" : "linkss"
        }`}
      >
        {isActive === "links" && (
          <div className='landing_Nav_Wrapper'>
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
            <div
              className={`landing_Nav_Item ${
                activeLinkTab === "reports" ? "active" : ""
              }`}
              onClick={() => setActiveLinkTab("reports")}
            >
              <p>Report links</p>
              <span></span>
            </div>
          </div>
        )}
        <div className='cards'>
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
                .filter((v) =>
                  selectValue !== ""
                    ? selectValue === "is_internal"
                      ? v?.is_internal === true
                      : selectValue === "not_internal"
                      ? !v?.is_internal
                      : v?.is_regional
                    : true
                )
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
                .filter((v) =>
                  selectValue !== ""
                    ? selectValue === "is_internal"
                      ? v?.is_internal === true
                      : selectValue === "not_internal"
                      ? !v?.is_internal
                      : v?.is_regional
                    : true
                )
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
                            <div className='job__Link__Wrapper'>
                              <p>{link.link_name}</p>
                              <div
                                className='job__Link__Container'
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
                            <div className='job__Link__Wrapper'>
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
                                className='job__Link__Container'
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
                {activeLinkTab === "reports" && (
                  <>
                    {reportLinks.length < 1 ? (
                      <div>
                        <p>You have not created any links yet</p>
                      </div>
                    ) : (
                      React.Children.toArray(
                        reportLinks.map((link) => {
                          return (
                            <div className='job__Link__Wrapper'>
                              <p>{link.link_name}</p>
                              <div
                                className='job__Link__Container'
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
      {(isActive === "active" || isActive === "inactive") &&
        (activeJobsLength !== 0 || inactiveJobsLength !== 0) && (
          <div className='JobsChanger_containter admin'>
            <button
              onClick={() =>
                decrementStepPagination(isActive === "active" ? true : false)
              }
            >
              <IoIosArrowBack />
            </button>
            {createArrayWithLength(
              isActive === "active"
                ? Math.ceil(activeJobsLength / 4)
                : Math.ceil(inactiveJobsLength / 4)
            )
              .slice(
                isActive === "active"
                  ? cardActivePagination
                  : cardInactivePagination,
                isActive === "active"
                  ? cardActivePagination + 6
                  : cardInactivePagination + 6
              )
              .map((s, index) => (
                <button
                  className={s !== cardIndex ? "active" : "desactive"}
                  onClick={() => {
                    changeCardGroupNumber(s * 4);
                    setCardIndex(s);
                  }}
                  key={`${index}_button${
                    isActive === "active" ? "_active" : "_desactive"
                  }`}
                >
                  {s + 1}
                </button>
              ))}
            <button
              onClick={() =>
                incrementStepPagination(
                  6,
                  isActive === "active"
                    ? Math.ceil(activeJobsLength / 4)
                    : Math.ceil(inactiveJobsLength / 4),
                  isActive === "active" ? true : false
                )
              }
            >
              <IoIosArrowForward />
            </button>
          </div>
        )}
    </StaffJobLandingLayout>
  );
};

export default LandingPage;
export function createArrayWithLength(length) {
  return Array.from({ length }, (_, index) => index);
}
