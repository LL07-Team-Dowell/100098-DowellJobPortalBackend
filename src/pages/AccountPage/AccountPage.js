import React, { useEffect, useState } from "react";
import {
  useCandidateContext,
  initialCandidatesDataStateNames,
} from "../../contexts/CandidatesContext";
import { useNavigationContext } from "../../contexts/NavigationContext";
import { candidateDataReducerActions } from "../../reducers/CandidateDataReducer";
import ErrorPage from "../ErrorPage/ErrorPage";
import SelectedCandidates from "../TeamleadPage/components/SelectedCandidates/SelectedCandidates";
import SelectedCandidatesScreen from "../TeamleadPage/views/SelectedCandidatesScreen/SelectedCandidatesScreen";
import RejectedCandidates from "./components/RejectedCandidates/RejectedCandidates";
import { candidateStatuses } from "../CandidatePage/utils/candidateStatuses";
import UserScreen from "./views/UserScreen/UserScreen";
import { useLocation, useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../components/TitleNavigationBar/TitleNavigationBar";
import TogglerNavMenuBar from "../../components/TogglerNavMenuBar/TogglerNavMenuBar";
import JobCard from "../../components/JobCard/JobCard";
import { useMediaQuery } from "@mui/material";
import { BsPersonCheck, BsPersonPlus, BsPersonX } from "react-icons/bs";
import { AiOutlineRedo } from "react-icons/ai";
import { getJobs2 } from "../../services/commonServices";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { getCandidateApplicationsForTeamLead } from "../../services/teamleadServices";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IoMdRefresh } from "react-icons/io";

const AccountPage = () => {
  const { currentUser } = useCurrentUserContext();
  const { section, searchParams } = useNavigationContext();
  const {
    candidatesData,
    dispatchToCandidatesData,
    candidatesDataLoaded,
    setCandidatesDataLoaded,
  } = useCandidateContext();
  const [currentCandidate, setCurrentCandidate] = useState({});
  const [showCandidate, setShowCandidate] = useState(false);
  const [rehireTabActive, setRehireTabActive] = useState(false);
  const [hireTabActive, setHireTabActive] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const location = useLocation();
  const [currentActiveItem, setCurrentActiveItem] = useState("Hire");
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const [searchValue, setSearchValue] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newJoniees, setNewJoniees] = useState(false);

  const handleSearch = (value) => {
    console.log("value", value);
    setSearchValue(value);
    console.log("value", candidatesData.selectedCandidates);
    if (section === "home" || section == undefined) {
      if (hireTabActive) {
        setFilteredCandidates(
          candidatesData.candidatesToHire.filter((application) =>
            application.applicant
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
          )
        );
      }
      if (showOnboarding) {
        setFilteredCandidates(
          candidatesData.onboardingCandidates.filter((application) =>
            application.applicant
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
          )
        );
      }
      if (rehireTabActive) {
        setFilteredCandidates(
          candidatesData.candidatesToRehire.filter((application) =>
            application.applicant
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
          )
        );
      }
    }

    if (section === "rejected") {
      setFilteredCandidates(
        candidatesData.rejectedCandidates.filter((application) =>
          application.applicant
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    if (candidatesDataLoaded) return;

    const requestData = {
      company_id: currentUser?.portfolio_info[0].org_id,
    };

    setLoading(true);

    Promise.all([
      getJobs2(requestData),
      getCandidateApplicationsForTeamLead(
        currentUser?.portfolio_info[0].org_id
      ),
    ])
      .then((res) => {
        const jobsMatchingCurrentCompany = res[0].data.response.data.filter(
          (job) =>
            job.data_type === currentUser?.portfolio_info[0].data_type &&
            job.is_active
        );
        setJobs(jobsMatchingCurrentCompany);

        const applicationForMatching = res[1].data.response.data
          .filter(
            (application) =>
              application.data_type === currentUser?.portfolio_info[0].data_type
          )
          .reverse();
        const candidatesToHire = applicationForMatching.filter(
          (application) =>
            application.status === candidateStatuses.TEAMLEAD_HIRE
        );
        const candidatesToRehire = applicationForMatching.filter(
          (application) =>
            application.status === candidateStatuses.TO_REHIRE ||
            application.status === candidateStatuses.TEAMLEAD_TOREHIRE ||
            application.status === candidateStatuses.REHIRE
        );
        const candidatesOnboarding = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.ONBOARDING
        );
        const candidatesRejected = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.REJECTED
        );
        console.log("applicationForMatching", applicationForMatching);
        console.log("candidates onboarding", candidatesOnboarding);

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_CANDIDATES_TO_HIRE,
          payload: {
            stateToChange: initialCandidatesDataStateNames.candidatesToHire,
            value: candidatesToHire,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_REHIRED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.candidatesToRehire,
            value: candidatesToRehire,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
            value: candidatesOnboarding,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_REJECTED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.rejectedCandidates,
            value: candidatesRejected,
          },
        });

        setLoading(false);
        setCandidatesDataLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const currentTab = searchParams.get("tab");

    if (currentTab === "rehire") {
      setRehireTabActive(true);
      setHireTabActive(false);
      setShowOnboarding(false);
      setCurrentActiveItem("Rehire");
      return;
    }

    if (currentTab === "onboarding") {
      setShowOnboarding(true);
      setHireTabActive(false);
      setRehireTabActive(false);
      setCurrentActiveItem("Onboarding");
      return;
    }

    setHireTabActive(true);
    setShowOnboarding(false);
    setRehireTabActive(false);
  }, [searchParams]);

  useEffect(() => {
    setShowCandidate(false);

    const currentPath = location.pathname.split("/")[1];
    const currentTab = searchParams.get("tab");

    if (!currentPath && !currentTab) return setCurrentActiveItem("Hire");
    if (currentPath && currentPath === "rejected")
      return setCurrentActiveItem("Reject");
  }, [location]);

  const handleMenuItemClick = (item) => {
    typeof item === "object"
      ? setCurrentActiveItem(item.text)
      : setCurrentActiveItem(item);

    if (item === "Reject") return navigate("/rejected");

    const passedItemInLowercase =
      typeof item === "object"
        ? item.text.toLocaleLowerCase()
        : item.toLocaleLowerCase();
    return navigate(`/?tab=${passedItemInLowercase}`);
  };

  const handleBackBtnClick = () => {
    setShowCandidate(false);
  };

  const handleViewBtnClick = (passedData) => {
    setShowCandidate(true);
    setCurrentCandidate(passedData);
  };

  const handleRefreshForCandidateApplicationsForTeamlead = () => {
    setLoading(true);
    getCandidateApplicationsForTeamLead(currentUser?.portfolio_info[0].org_id)
      .then((res) => {
        const applicationForMatching = res.data.response.data
          .filter(
            (application) =>
              application.data_type === currentUser?.portfolio_info[0].data_type
          )
          .reverse();
        const candidatesToHire = applicationForMatching.filter(
          (application) =>
            application.status === candidateStatuses.TEAMLEAD_HIRE
        );
        const candidatesToRehire = applicationForMatching.filter(
          (application) =>
            application.status === candidateStatuses.TO_REHIRE ||
            application.status === candidateStatuses.TEAMLEAD_TOREHIRE ||
            application.status === candidateStatuses.REHIRE
        );
        const candidatesOnboarding = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.ONBOARDING
        );
        const candidatesRejected = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.REJECTED
        );

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_CANDIDATES_TO_HIRE,
          payload: {
            stateToChange: initialCandidatesDataStateNames.candidatesToHire,
            value: candidatesToHire,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_REHIRED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.candidatesToRehire,
            value: candidatesToRehire,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
            value: candidatesOnboarding,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_REJECTED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.rejectedCandidates,
            value: candidatesRejected,
          },
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const present_date = new Date();

  return (
    <>
      <StaffJobLandingLayout
        accountView={true}
        searchValue={searchValue}
        setSearchValue={handleSearch}
        searchPlaceHolder={
          section === "home"
            ? "hire"
            : section === "rejected"
            ? "reject"
            : showOnboarding
            ? "onboarding"
            : rehireTabActive
            ? "rehire"
            : "hire"
        }
        hideSearchBar={section === "user" ? true : false}
      >
        <TitleNavigationBar
          title={
            showCandidate
              ? "Application Details"
              : section === "user"
              ? "Profile"
              : "Applications"
          }
          hideBackBtn={!showCandidate ? true : false}
          handleBackBtnClick={handleBackBtnClick}
        />
        {section !== "user" && !showCandidate && (
          <TogglerNavMenuBar
            menuItems={
              isLargeScreen
                ? ["Hire", "Onboarding", "Rehire", "Reject"]
                : [
                    { icon: <BsPersonPlus />, text: "Hire" },
                    { icon: <BsPersonCheck />, text: "Onboarding" },
                    { icon: <AiOutlineRedo />, text: "Rehire" },
                    { icon: <BsPersonX />, text: "Reject" },
                  ]
            }
            currentActiveItem={currentActiveItem}
            handleMenuItemClick={handleMenuItemClick}
          />
        )}

        <>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {section === "home" || section == undefined ? (
                showCandidate ? (
                  <SelectedCandidatesScreen
                    selectedCandidateData={currentCandidate}
                    updateShowCandidate={setShowCandidate}
                    accountPage={true}
                    rehireTabActive={rehireTabActive}
                    hireTabActive={hireTabActive}
                    showOnboarding={showOnboarding}
                    updateCandidateData={dispatchToCandidatesData}
                    allCandidatesData={
                      hireTabActive
                        ? candidatesData.candidatesToHire
                        : showOnboarding
                        ? candidatesData.onboardingCandidates
                        : rehireTabActive
                        ? candidatesData.candidatesToRehire
                        : []
                    }
                    jobTitle={
                      jobs.filter(
                        (job) => job.job_number === currentCandidate.job_number
                      ).length >= 1
                        ? jobs.filter(
                            (job) =>
                              job.job_number === currentCandidate.job_number
                          )[0].job_title
                        : ""
                    }
                    showApplicationDetails={true}
                    handleViewApplicationBtnClick={() =>
                      setShowApplicationDetails(!showApplicationDetails)
                    }
                    job={
                      jobs.find(
                        (job) => job.job_number === currentCandidate.job_number
                      )
                        ? jobs.find(
                            (job) =>
                              job.job_number === currentCandidate.job_number
                          )
                        : null
                    }
                  />
                ) : (
                  <>
                    <SelectedCandidates
                      candidatesCount={
                        searchValue.length >= 1
                          ? filteredCandidates.length
                          : hireTabActive
                          ? candidatesData.candidatesToHire.length
                          : showOnboarding
                          ? newJoniees
                            ? candidatesData.onboardingCandidates.filter(
                                (applicant) =>
                                  (present_date.getTime() -
                                    new Date(applicant.hired_on).getTime()) /
                                    (1000 * 3600 * 24) <=
                                    14 ||
                                  (present_date.getTime() -
                                    new Date(
                                      applicant.onboarded_on
                                    ).getTime()) /
                                    (1000 * 3600 * 24) <=
                                    14
                              ).length
                            : candidatesData.onboardingCandidates.length
                          : rehireTabActive
                          ? candidatesData.candidatesToRehire.length
                          : 0
                      }
                    />

                    <div className="refresh-container-account">
                      <div className="refresh-nav-container">
                        <div
                          className={`nav-links-cont ${
                            newJoniees === false ? "active" : ""
                          }`}
                        >
                          <p onClick={() => setNewJoniees(false)}>All</p>
                          <span className="span"></span>
                        </div>
                        <div
                          className={`nav-links-cont ${
                            newJoniees === true ? "active" : ""
                          }`}
                        >
                          <p onClick={() => setNewJoniees(true)}>New Joniees</p>
                          <span className="span"></span>
                        </div>
                      </div>
                      <button
                        className="refresh-btn-account"
                        onClick={
                          handleRefreshForCandidateApplicationsForTeamlead
                        }
                      >
                        <IoMdRefresh />
                        <p>Refresh</p>
                      </button>
                    </div>

                    <div className="jobs-container">
                      {hireTabActive ? (
                        searchValue.length >= 1 ? (
                          React.Children.toArray(
                            filteredCandidates.map((dataitem) => {
                              return (
                                <JobCard
                                  buttonText={"View"}
                                  candidateCardView={true}
                                  candidateData={dataitem}
                                  jobAppliedFor={
                                    jobs.find(
                                      (job) =>
                                        job.job_number === dataitem.job_number
                                    )
                                      ? jobs.find(
                                          (job) =>
                                            job.job_number ===
                                            dataitem.job_number
                                        ).job_title
                                      : ""
                                  }
                                  handleBtnClick={handleViewBtnClick}
                                />
                              );
                            })
                          )
                        ) : (
                          React.Children.toArray(
                            candidatesData.candidatesToHire.map((dataitem) => {
                              return (
                                <JobCard
                                  buttonText={"View"}
                                  candidateCardView={true}
                                  candidateData={dataitem}
                                  jobAppliedFor={
                                    jobs.find(
                                      (job) =>
                                        job.job_number === dataitem.job_number
                                    )
                                      ? jobs.find(
                                          (job) =>
                                            job.job_number ===
                                            dataitem.job_number
                                        ).job_title
                                      : ""
                                  }
                                  handleBtnClick={handleViewBtnClick}
                                />
                              );
                            })
                          )
                        )
                      ) : showOnboarding ? (
                        searchValue.length >= 1 ? (
                          React.Children.toArray(
                            filteredCandidates.map((dataitem) => {
                              return (
                                <JobCard
                                  buttonText={"View"}
                                  candidateCardView={true}
                                  candidateData={dataitem}
                                  jobAppliedFor={
                                    jobs.find(
                                      (job) =>
                                        job.job_number === dataitem.job_number
                                    )
                                      ? jobs.find(
                                          (job) =>
                                            job.job_number ===
                                            dataitem.job_number
                                        ).job_title
                                      : ""
                                  }
                                  handleBtnClick={handleViewBtnClick}
                                />
                              );
                            })
                          )
                        ) : newJoniees ? (
                          React.Children.toArray(
                            candidatesData.onboardingCandidates
                              .filter(
                                (applicant) =>
                                  (present_date.getTime() -
                                    new Date(applicant.hired_on).getTime()) /
                                    (1000 * 3600 * 24) <=
                                    14 ||
                                  (present_date.getTime() -
                                    new Date(
                                      applicant.onboarded_on
                                    ).getTime()) /
                                    (1000 * 3600 * 24) <=
                                    14
                              )
                              .map((dataitem) => {
                                return (
                                  <JobCard
                                    buttonText={"View"}
                                    candidateCardView={true}
                                    candidateData={dataitem}
                                    jobAppliedFor={
                                      jobs.find(
                                        (job) =>
                                          job.job_number === dataitem.job_number
                                      )
                                        ? jobs.find(
                                            (job) =>
                                              job.job_number ===
                                              dataitem.job_number
                                          ).job_title
                                        : ""
                                    }
                                    handleBtnClick={handleViewBtnClick}
                                  />
                                );
                              })
                          )
                        ) : (
                          React.Children.toArray(
                            candidatesData.onboardingCandidates.map(
                              (dataitem) => {
                                return (
                                  <JobCard
                                    buttonText={"View"}
                                    candidateCardView={true}
                                    candidateData={dataitem}
                                    jobAppliedFor={
                                      jobs.find(
                                        (job) =>
                                          job.job_number === dataitem.job_number
                                      )
                                        ? jobs.find(
                                            (job) =>
                                              job.job_number ===
                                              dataitem.job_number
                                          ).job_title
                                        : ""
                                    }
                                    handleBtnClick={handleViewBtnClick}
                                  />
                                );
                              }
                            )
                          )
                        )
                      ) : rehireTabActive ? (
                        searchValue.length >= 1 ? (
                          React.Children.toArray(
                            filteredCandidates.map((dataitem) => {
                              return (
                                <JobCard
                                  buttonText={"View"}
                                  candidateCardView={true}
                                  candidateData={dataitem}
                                  jobAppliedFor={
                                    jobs.find(
                                      (job) =>
                                        job.job_number === dataitem.job_number
                                    )
                                      ? jobs.find(
                                          (job) =>
                                            job.job_number ===
                                            dataitem.job_number
                                        ).job_title
                                      : ""
                                  }
                                  handleBtnClick={handleViewBtnClick}
                                />
                              );
                            })
                          )
                        ) : (
                          React.Children.toArray(
                            candidatesData.candidatesToRehire.map(
                              (dataitem) => {
                                return (
                                  <JobCard
                                    buttonText={"View"}
                                    candidateCardView={true}
                                    candidateData={dataitem}
                                    jobAppliedFor={
                                      jobs.find(
                                        (job) =>
                                          job.job_number === dataitem.job_number
                                      )
                                        ? jobs.find(
                                            (job) =>
                                              job.job_number ===
                                              dataitem.job_number
                                          ).job_title
                                        : ""
                                    }
                                    handleBtnClick={handleViewBtnClick}
                                  />
                                );
                              }
                            )
                          )
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                )
              ) : section === "rejected" ? (
                <>
                  <button
                    className="refresh-container"
                    onClick={handleRefreshForCandidateApplicationsForTeamlead}
                  >
                    <div className="refresh-btn">
                      <IoMdRefresh />
                      <p>Refresh</p>
                    </div>
                  </button>

                  <RejectedCandidates
                    candidatesCount={
                      searchValue.length >= 1
                        ? filteredCandidates.length
                        : candidatesData.rejectedCandidates.length
                    }
                  />

                  <div className="jobs-container">
                    {React.Children.toArray(
                      candidatesData.rejectedCandidates.map((dataitem) => {
                        return (
                          <JobCard
                            buttonText={"View"}
                            candidateCardView={true}
                            candidateData={dataitem}
                            jobAppliedFor={
                              jobs.find(
                                (job) => job.job_number === dataitem.job_number
                              )
                                ? jobs.find(
                                    (job) =>
                                      job.job_number === dataitem.job_number
                                  ).job_title
                                : ""
                            }
                            handleBtnClick={handleViewBtnClick}
                          />
                        );
                      })
                    )}
                  </div>
                </>
              ) : section === "user" ? (
                <UserScreen currentUser={currentUser} />
              ) : (
                <>
                  <ErrorPage disableNav={true} />
                </>
              )}
            </>
          )}
        </>
      </StaffJobLandingLayout>
    </>
  );
};

export default AccountPage;
