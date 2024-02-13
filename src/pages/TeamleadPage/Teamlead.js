import React, { useEffect, useState } from "react";
import {
  initialCandidatesDataStateNames,
  useCandidateContext,
} from "../../contexts/CandidatesContext";
import { useNavigationContext } from "../../contexts/NavigationContext";
import ErrorPage from "../ErrorPage/ErrorPage";
import SelectedCandidates from "./components/SelectedCandidates/SelectedCandidates";
import SelectedCandidatesScreen from "./views/SelectedCandidatesScreen/SelectedCandidatesScreen";
import "./style.css";
import { candidateStatuses } from "../CandidatePage/utils/candidateStatuses";
import { candidateDataReducerActions } from "../../reducers/CandidateDataReducer";
import AddTaskScreen from "./views/AddTaskScreen/AddTaskScreen";
import UserScreen from "./views/UserScreen/UserScreen";
import { useLocation, useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../components/TitleNavigationBar/TitleNavigationBar";
import TogglerNavMenuBar from "../../components/TogglerNavMenuBar/TogglerNavMenuBar";
import JobCard from "../../components/JobCard/JobCard";
import { getJobs2 } from "../../services/commonServices";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import {
  getCandidateApplicationsForTeamLead,
} from "../../services/teamleadServices";
import { useCandidateTaskContext } from "../../contexts/CandidateTasksContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from "react-icons/io";
import AddPage from "../GroupLeadPage/components/AddPage";
import { createArrayWithLength } from "../AdminPage/views/Landingpage/LandingPage";
import UsersLogsScreen from "../../common/screens/UserLogsScreen/UserLogsScreen";

const Teamlead = ({ isGrouplead }) => {
  const { 
    currentUser, 
    allApplications, 
    setAllApplications,
    userRemovalStatusChecked,
  } = useCurrentUserContext();
  const { section, searchParams } = useNavigationContext();
  const {
    candidatesData,
    dispatchToCandidatesData,
    candidatesDataLoaded,
    setCandidatesDataLoaded,
  } = useCandidateContext();
  const [showCandidate, setShowCandidate] = useState(false);
  const [showCandidateTask, setShowCandidateTask] = useState(false);
  const [rehireTabActive, setRehireTabActive] = useState(false);
  const [selectedTabActive, setSelectedTabActive] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState({});
  const [jobs, setJobs] = useState([]);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const { userTasks, setUserTasks } = useCandidateTaskContext();
  // console.log("userTasks", userTasks);
  // const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editTaskActive, setEditTaskActive] = useState(false);
  const location = useLocation();
  const [currentActiveItem, setCurrentActiveItem] = useState("Approval");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filteredUsersForLogTiles, setFilteredUsersForLogTiles] = useState([]);
  const [showAddTaskModalForGrouplead, setShowAddTaskModalForGrouplead] = useState(false);
  const [showAddIssueModalForGrouplead, setShowAddIssueModalForGrouplead] = useState(false);
  const [currentSelectedProjectForLead, setCurrentSelectedProjectForLead] = useState('');
  const [cardGroupNumber, setCardGroupNumber] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentSortOption, setCurrentSortOption] = useState(null);
  const [sortResults, setSortResults] = useState([]);
  const [cardPagination, setCardPagination] = useState(0);
  const [cardPagination2, setCardPagination2] = useState(0);
  const [cardPagination3, setCardPagination3] = useState(0);
  const [ logRequestDate, setLogRequestDate ] = useState(null);

  useEffect(() => {
    if (cardPagination || cardPagination2 || cardPagination3) {
      console.log("cardPagination " + cardPagination + "cardPagination2 " + cardPagination2 + "cardPagination3 " + cardPagination3)
    }
  }, [cardPagination, cardPagination2, cardPagination3])
  const initializePagination = () => setCardPagination(0);
  const initializePagination2 = () => setCardPagination2(0);
  const initializePagination3 = () => setCardPagination2(0);

  const incrementStepPagination = (steps, length) => {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    if (steps + 1 <= length) {
      if (steps + cardPagination !== length) {
        setCardPagination(cardPagination + 1);
      }
    }
  };
  const incrementStepPagination2 = (steps, length) => {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2222222222222222222222');
    if (steps + 1 <= length) {
      if (steps + cardPagination2 !== length) {
        setCardPagination2(cardPagination2 + 1);
      }
    }
  };
  const incrementStepPagination3 = (steps, length) => {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3333333333333333333333333');
    console.log({ steps, length, cardPagination3 })
    if (steps + 1 <= length) {
      if (steps + cardPagination3 !== length) {
        setCardPagination3(cardPagination3 + 1);
        console.log(true, true, true)
      }
    }
  };
  const decrementStepPagination = () => {
    if (cardPagination !== 0) {
      setCardPagination(cardPagination - 1);
    }
  }
  const decrementStepPagination2 = () => {
    if (cardPagination2 !== 0) {
      setCardPagination2(cardPagination2 - 1);
    }
  }
  const decrementStepPagination3 = () => {
    if (cardPagination3 !== 0) {
      setCardPagination3(cardPagination3 - 1);
    }
  }

  const handleSearch = (value) => {
    const toAnagram = (word) => {
      return word.toLowerCase().split("").reverse().join("");
    };

    const isAnagram = (word) => {
      const anagram = toAnagram(word);
      return jobs.some(
        (job) => toAnagram(job.job_title || job.applicant) === anagram
      );
    };

    console.log("value", value);
    setSearchValue(value);
    console.log("value", candidatesData.selectedCandidates);
    console.log("section", section);
    if ((section === "home" || section == undefined) && selectedTabActive) {
      setFilteredJobs(
        candidatesData.selectedCandidates.filter(
          (job) =>
            job.job_title
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase()) ||
            job.applicant
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
        )
      );

      console.log("filteredJobs", filteredJobs);
    } else if (section === "rehire" && rehireTabActive) {
      setFilteredJobs(
        candidatesData.candidatesToRehire.filter(
          (job) =>
            job.job_title
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase()) ||
            job.applicant
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
        )
      );

      console.log("filteredJobs", filteredJobs);
    } else if (section === "task" || section === 'all-tasks') {
      setFilteredUsersForLogTiles(
        candidatesData.allCandidates
        .filter(candidate => 
          candidate.project && 
          Array.isArray(candidate.project) &&
          candidate.project.includes(currentSelectedProjectForLead) &&
          (
            candidate.applicant.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
            value.toLocaleLowerCase().includes(candidate.applicant.toLocaleLowerCase()) ||
            candidate.username.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
            value.toLocaleLowerCase().includes(candidate.username.toLocaleLowerCase()) 
          )
        )
      );

      console.log("filteredTasks", filteredUsersForLogTiles);
    }
  };

  useEffect(() => {
    if (candidatesDataLoaded || !userRemovalStatusChecked) return;

    const initialProjectSelected = currentUser?.settings_for_profile_info?.profile_info[currentUser?.settings_for_profile_info?.profile_info?.length - 1]?.project;

    setCurrentSelectedProjectForLead(initialProjectSelected);

    setLoading(true);

    const allCandidates = allApplications?.filter(
      (application) =>
        application.data_type === currentUser?.portfolio_info[0]?.data_type
    )?.reverse();

    console.log(allCandidates);

    if (isGrouplead) {
      const onboardingCandidates = allCandidates
      ?.filter(
        (application) =>
          application.status === candidateStatuses.ONBOARDING
      );

      dispatchToCandidatesData({
        type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
        payload: {
          stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
          value: onboardingCandidates,
        },
      });

      dispatchToCandidatesData({
        type: candidateDataReducerActions.UPDATE_ALL_CANDIDATES,
        payload: {
          stateToChange: initialCandidatesDataStateNames.allCandidates,
          value: allCandidates?.filter(candidate => candidate.user_id).filter(candidate => candidate.user_id !== currentUser?.userinfo?.userID)
        }
      });

      setLoading(false);
      setCandidatesDataLoaded(true);

      return
    }

    getJobs2({ company_id: currentUser?.portfolio_info[0]?.org_id })
      .then(async (res) => {
        console.log("res", res);
        const jobsMatchingCurrentCompany = res.data?.response?.data?.filter(
          (job) =>
            job.data_type === currentUser?.portfolio_info[0]?.data_type &&
            job.is_active
        )
        .filter(job => !job.is_internal);
        console.log(jobsMatchingCurrentCompany);
        setJobs(jobsMatchingCurrentCompany);

        const selectedCandidates = allCandidates.filter(
          (application) => application.status === candidateStatuses.SELECTED
        );
        const candidatesToRehire = allCandidates.filter(
          (application) => application.status === candidateStatuses.TO_REHIRE
        );
        const onboardingCandidates = allCandidates.filter(
          (application) => application.status === candidateStatuses.ONBOARDING
        );
        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_SELECTED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.selectedCandidates,
            value: selectedCandidates,
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
            value: onboardingCandidates,
          },
        });

        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_ALL_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.allCandidates,
            value: allCandidates?.filter(candidate => candidate.user_id).filter(candidate => candidate.user_id !== currentUser?.userinfo?.userID)
          }
        });

        setCandidatesDataLoaded(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [allApplications, userRemovalStatusChecked]);

  useEffect(() => {
    const currentTab = searchParams.get("tab");

    if (currentTab === "rehire") {
      setRehireTabActive(true);
      setSelectedTabActive(false);
      setCurrentActiveItem("Rehire");
      return;
    }

    setRehireTabActive(false);
    setSelectedTabActive(true);
  }, [searchParams]);

  useEffect(() => {
    setShowCandidateTask(false);

    if (location.state && location.state?.log_request_date) {

      const validDatePassed = new Date(location.state?.log_request_date);
      if (typeof validDatePassed == 'Invalid Date') return;
  
      setLogRequestDate(location.state?.log_request_date);
      setShowAddTaskModalForGrouplead(true);
  
      // RESET STATE TO PREVENT ADD TASK MODAL FROM POPPING UP AFTER EVERY RELOAD
      if (isGrouplead) window.history.replaceState({}, document.title, '/100098-DowellJobPortal/#/')
      if (!isGrouplead) window.history.replaceState({}, document.title, '/100098-DowellJobPortal/#/task')
    }

    const currentPath = location.pathname.split("/")[1];
    const currentTab = searchParams.get("tab");

    if (!currentPath && !currentTab) return setCurrentActiveItem("Approval");
    if (currentPath && currentPath === "task")
      return setCurrentActiveItem("Work logs");
  }, [location]);

  useEffect(() => {

    if (!currentSortOption) return;

    const categories = {};
    const newArray = [];

    const getCategoryArray = (propertyName, date) => {

      const usersMatchingCurrentProjectSelection = candidatesData.allCandidates
      .filter(candidate => 
        candidate.project && 
        Array.isArray(candidate.project) &&
        candidate.project.includes(currentSelectedProjectForLead)
      );

      usersMatchingCurrentProjectSelection.forEach(user => {
        if (date) {

          if (categories.hasOwnProperty(new Date(user[`${propertyName}`]).toDateString())) return

          categories[`${new Date(user[propertyName]).toDateString()}`] = new Date(user[`${propertyName}`]).toDateString();
          return

        }

        if (!categories.hasOwnProperty(user[`${propertyName}`])) {
          categories[`${user[propertyName]}`] = user[`${propertyName}`]
        }
      })

      let categoryObj = {};

      Object.keys(categories || {}).forEach(key => {

        if (key === "undefined") return;

        if (date) {
          const matchingTasks = usersMatchingCurrentProjectSelection.filter(user => new Date(user[`${propertyName}`]).toDateString() === key);
          categoryObj.name = key;
          categoryObj.data = matchingTasks;
          newArray.push(categoryObj);
          categoryObj = {};
          return
        }

        const matchingTasks = usersMatchingCurrentProjectSelection.filter(user => user[`${propertyName}`] === key);
        categoryObj.name = key;
        categoryObj.data = matchingTasks;
        newArray.push(categoryObj);
        categoryObj = {};
      })

      return newArray;
    }

    switch (currentSortOption) {
      case "applicant":
        const applicantCategoryData = getCategoryArray('applicant');
        setSortResults(applicantCategoryData);
        break;
      case "date":
        const dateCategoryData = getCategoryArray("onboarded_on", true);
        setSortResults(dateCategoryData.sort((a, b) => new Date(b.name) - new Date(a.name)));
        break;
      default:
        setSortResults([]);
        break;
    }

  }, [currentSortOption])

  const handleBackBtnClick = () => {
    setShowCandidate(false);
    setShowCandidateTask(false);
  };

  const handleMenuItemClick = (item) => {
    setCurrentActiveItem(item);

    if (item === "Work logs") return navigate("/task");

    const passedItemInLowercase = item.toLocaleLowerCase();
    return navigate(`/?tab=${passedItemInLowercase}`);
  };

  const handleViewTaskBtnClick = (data) => {
    navigate(`/logs-approval-screen?applicant=${data.applicant}&project=${currentSelectedProjectForLead}&user-id=${data.user_id}`);
    // navigate(`/new-task-screen?applicant=${data.applicant}&project=${data.project}&name=${data.applicantName}`);
  };

  const handleViewBtnClick = (data) => {
    setShowCandidate(true);
    setCurrentCandidate(data);
  };

  const handleRefreshForCandidateApplicationsForTeamlead = () => {
    setLoading(true);
    getCandidateApplicationsForTeamLead(currentUser?.portfolio_info[0].org_id)
      .then((res) => {
        console.log("res", res);
        const dataGotten = res.data.response.data
        .filter(
          (application) =>
            application.data_type === currentUser?.portfolio_info[0].data_type
        );

        setAllApplications(dataGotten);

        const applicationForMatching = dataGotten.reverse();
        const selectedCandidates = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.SELECTED
        );
        const candidatesToRehire = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.TO_REHIRE
        );
        const onboardingCandidates = applicationForMatching.filter(
          (application) => application.status === candidateStatuses.ONBOARDING
        );
        
        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_SELECTED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.selectedCandidates,
            value: selectedCandidates,
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
            value: onboardingCandidates,
          },
        });
        dispatchToCandidatesData({
          type: candidateDataReducerActions.UPDATE_ALL_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.allCandidates,
            value: applicationForMatching?.filter(candidate => candidate.user_id).filter(candidate => candidate.user_id !== currentUser?.userinfo?.userID)
          }
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <StaffJobLandingLayout
        teamleadView={true}
        hideSideBar={showAddTaskModal || showAddIssueModalForGrouplead || showAddTaskModalForGrouplead}
        searchValue={searchValue}
        setSearchValue={handleSearch}
        searchPlaceHolder={
          section === "home"
            ? isGrouplead ?
              "task" :
              "applicant"
            : section === "task"
              ?
              ""
              : rehireTabActive
                ? "rehire"
                :
                section === 'all-tasks' ?
                  'user'
                  :
                  "applicant"
        }
        hideSearchBar={((isGrouplead && (section === "home" || section === undefined)) || section === "user") ? true : section === 'task' ? true : false}
        isGrouplead={isGrouplead}
      >
        {
          !(isGrouplead && (section === "home" || section === undefined)) && <>
            {
              section === 'user-tasks' ? <></> :
                <>
                <br />
                <TitleNavigationBar
                  title={
                    (section === "task" || section === 'all-tasks')
                      ?
                      "Work Logs"
                      : section === "user"
                        ? "Profile"
                        : showCandidate
                          ? "Application Details"
                          :
                          isGrouplead ?
                            " "
                            : "Applications"
                  }
                  hideBackBtn={
                    showCandidate || showCandidateTask || (section === "task" && isGrouplead) ? false
                      :
                      section === 'task' ?
                        true
                        :
                        section === 'all-tasks' ?
                          false
                          :
                          true
                  }
                  handleBackBtnClick={
                    (section === "task" && isGrouplead) ?
                      () => navigate(-1)
                      :
                      (section === 'all-tasks') ?
                        () => navigate(-1)
                        :
                        () => handleBackBtnClick()
                  }
                />
                </>
            }
          </>
        }
        {section !== "user" && !showCandidate && !isGrouplead && (
          section === 'user-tasks' ? <></> :
            section === 'all-tasks' ? <>
              <button
                className="refresh-container-teamlead desktop"
              >
                <div className="refresh-btn refresh-btn-teamlead" onClick={loading ? () => {} : () => handleRefreshForCandidateApplicationsForTeamlead()}
                >
                  {
                    loading ? 
                      <LoadingSpinner 
                        width={'0.8rem'} 
                        height={'0.8rem'} 
                      /> 
                    :
                    <IoMdRefresh />
                  }
                  <p>Refresh</p>
                </div>
              </button>
            </>
              :
              <>
                <TogglerNavMenuBar
                  className={"teamlead"}
                  menuItems={
                    ["Approval", "Work logs", "Rehire"]
                  }
                  currentActiveItem={currentActiveItem}
                  handleMenuItemClick={handleMenuItemClick}
                />

                {
                  section === 'task' ? <></>
                    :
                    <button
                      className="refresh-container-teamlead desktop"
                    >
                      <div className="refresh-btn refresh-btn-teamlead" onClick={loading ? () => {} : () => handleRefreshForCandidateApplicationsForTeamlead()}
                      >
                        <IoMdRefresh />
                        <p>Refresh</p>
                      </div>
                    </button>
                }

              </>


        )}
        {/* {
          (
            section === 'task' ||
            section === 'user' ||
            isGrouplead ||
            section === 'user-tasks'
          ) ? <></>
            :
            <button
              className="refresh-container-teamlead desktop"
            >
              <div className="refresh-btn refresh-btn-teamlead" onClick={section === "all-tasks" ? () => handleRefreshForCandidateTask() : () => handleRefreshForCandidateApplicationsForTeamlead()}
              >
                <IoMdRefresh />
                <p>Refresh</p>
              </div>
            </button>
        } */}

        {
          section !== "user" && !showCandidate && isGrouplead && section === 'task' && <button
            className="refresh-container-teamlead desktop"
          >
            <div className="refresh-btn refresh-btn-teamlead" onClick={() => handleRefreshForCandidateApplicationsForTeamlead()}
            >
              <IoMdRefresh />
              <p>Refresh</p>
            </div>
          </button>
        }
        <>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {showAddTaskModal && (
                <AddTaskScreen
                  closeTaskScreen={() => setShowAddTaskModal(false)}
                  teamMembers={candidatesData.onboardingCandidates}
                  updateTasks={setUserTasks}
                  editPage={editTaskActive}
                  setEditPage={setEditTaskActive}
                  taskToEdit={{}}
                />
              )}

              {section === "home" || section == undefined ? (
                showCandidate ? (
                  <div className="teamlead__Selected__Wrapper">
                    <SelectedCandidatesScreen
                      selectedCandidateData={currentCandidate}
                      updateShowCandidate={setShowCandidate}
                      rehireTabActive={rehireTabActive}
                      allCandidatesData={
                        selectedTabActive
                          ? candidatesData.selectedCandidates
                          : rehireTabActive
                            ? candidatesData.candidatesToRehire
                            : []
                      }
                      updateCandidateData={dispatchToCandidatesData}
                      jobTitle={
                        jobs?.filter(
                          (job) =>
                            job.job_number === currentCandidate.job_number
                        ).length >= 1
                          ? jobs?.filter(
                            (job) =>
                              job.job_number === currentCandidate.job_number
                          )[0].job_title
                          : ""
                      }
                      showApplicationDetails={true}
                      teamleadPageActive={true}
                      handleViewApplicationBtnClick={() =>
                        setShowApplicationDetails(!showApplicationDetails)
                      }
                      job={
                        jobs?.find(
                          (job) => job.job_number === currentCandidate.job_number
                        ) ?
                          jobs?.find(
                            (job) => job.job_number === currentCandidate.job_number
                          ) :
                          null
                      }
                    />

                    {/* <button
                      className="refresh-container-teamlead"
                    >
                      <div className="refresh-btn refresh-btn-teamlead" onClick={handleRefreshForCandidateApplicationsForTeamlead}
                      >
                        <IoMdRefresh />
                        <p>Refresh</p>
                      </div>
                    </button> */}
                  </div>
                ) : (
                  <>
                    {isGrouplead && (section === 'home' || section === undefined) ? <></> :
                      <>
                        {/* <button
                          className="refresh-container"
                          onClick={handleRefreshForCandidateApplicationsForTeamlead}
                        >
                          <div className="refresh-btn">
                            <IoMdRefresh />
                            <p>Refresh</p>
                          </div>
                        </button> */}
                        <SelectedCandidates
                          candidatesCount={
                            selectedTabActive
                              ? searchValue.length >= 1
                                ? filteredJobs.length
                                : candidatesData.selectedCandidates.length
                              : rehireTabActive
                                ? candidatesData.candidatesToRehire.length
                                : 0
                          }
                          availableSortOptions={sortOptionsForLead}
                          hideSortOptions={true}
                        />

                        <button
                          className="refresh-container-teamlead mobile"
                        >
                          <div className="refresh-btn refresh-btn-teamlead" onClick={handleRefreshForCandidateApplicationsForTeamlead}
                          >
                            <IoMdRefresh />
                            <p>Refresh</p>
                          </div>
                        </button>

                      </>
                    }

                    {
                      isGrouplead ? <>
                        {/* <p style={{ textAlign: 'center' }}>More content coming soon...</p> */}
                        <AddPage
                          showAddIssueModal={showAddIssueModalForGrouplead}
                          setShowAddIssueModal={setShowAddIssueModalForGrouplead}
                          showAddTaskModal={showAddTaskModalForGrouplead}
                          setShowAddTaskModal={setShowAddTaskModalForGrouplead}
                          logRequestDate={logRequestDate}
                        />
                      </> :
                        <div className="jobs-container">
                          {selectedTabActive ? (
                            searchValue.length >= 1 ? (
                              React.Children.toArray(
                                filteredJobs.map((dataitem) => {
                                  return (
                                    <JobCard
                                      buttonText={"View"}
                                      candidateCardView={true}
                                      candidateData={dataitem}
                                      jobAppliedFor={
                                        jobs?.find(
                                          (job) =>
                                            job.job_number === dataitem.job_number
                                        )
                                          ? jobs?.find(
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
                                candidatesData.selectedCandidates.map(
                                  (dataitem) => {
                                    return (
                                      <JobCard
                                        buttonText={"View"}
                                        candidateCardView={true}
                                        candidateData={dataitem}
                                        jobAppliedFor={
                                          jobs?.find(
                                            (job) =>
                                              job.job_number === dataitem.job_number
                                          )
                                            ? jobs?.find(
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
                                filteredJobs.map((dataitem) => {
                                  return (
                                    <JobCard
                                      buttonText={"View"}
                                      candidateCardView={true}
                                      candidateData={dataitem}
                                      jobAppliedFor={
                                        jobs?.find(
                                          (job) =>
                                            job.job_number === dataitem.job_number
                                        )
                                          ? jobs?.find(
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
                                          jobs?.find(
                                            (job) =>
                                              job.job_number === dataitem.job_number
                                          )
                                            ? jobs?.find(
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
                    }
                  </>
                )
              ) : section === "task" ? (
                showCandidateTask ? (
                  <>
                    <UsersLogsScreen />
                    <h1>Button</h1>
                  </>
                ) : (
                  isGrouplead ?
                    <>
                      <SelectedCandidates
                        showTasks={true}
                        tasksCount={
                          currentSortOption ?
                            searchValue.length > 0 ?
                              sortResults.filter(
                                item =>
                                  item.data.find(
                                    user => typeof user?.applicant === 'string' && user?.applicant?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase()))
                              ).length
                              :
                              sortResults.length
                            :
                            searchValue.length >= 1
                              ? filteredUsersForLogTiles.length
                              : candidatesData.allCandidates
                                .filter(candidate => 
                                  candidate.project && 
                                  Array.isArray(candidate.project) &&
                                  candidate.project.includes(currentSelectedProjectForLead)
                                )
                                .length
                        }
                        availableSortOptions={sortOptionsForLead}
                        sortActive={currentSortOption ? true : false}
                        handleSortOptionClick={(data) => setCurrentSortOption(data)}
                      />
                      <div className="project__Select__Wrapper">
                        <select defaultValue={''} value={currentSelectedProjectForLead} onChange={({ target }) => setCurrentSelectedProjectForLead(target.value)}>
                          <option value={''} disabled>Select project</option>
                          <option
                            value={
                              currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project
                            }
                          >
                            {
                              currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project
                            }
                          </option>
                          {
                            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
                            Array.isArray(
                              currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
                            ) &&
                            React.Children.toArray(
                              currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(project => {
                                return <option value={project}>{project}</option>
                              })
                            )
                          }
                        </select>
                      </div>

                      <div className="tasks-container">
                        {section === "task" ? (
                          searchValue.length >= 1 ? (
                            React.Children.toArray(
                              filteredUsersForLogTiles.map((dataitem, index) => {
                                return (
                                  <JobCard
                                    buttonText={"View"}
                                    candidateCardView={true}
                                    candidateData={dataitem}
                                    jobAppliedFor={
                                      jobs?.find(
                                        (job) =>
                                          job.job_number === dataitem.job_number
                                      )
                                        ? jobs?.find(
                                          (job) =>
                                            job.job_number ===
                                            dataitem.job_number
                                        ).job_title
                                        : ""
                                    }
                                    handleBtnClick={handleViewTaskBtnClick}
                                    taskView={true}
                                    className={index % 2 !== 0 ? 'remove__mar' : ''}
                                    externalLinkingEnabled={true}
                                    externalLink={`/logs-approval-screen?applicant=${dataitem.applicant}~project=${currentSelectedProjectForLead}~user-id=${dataitem.user_id}`}
                                  />
                                );
                              })
                            )
                          ) : (
                            currentSortOption ? (
                              <>
                                {
                                  React.Children.toArray(
                                    sortResults
                                      ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                      .map(result => {
                                        return <>
                                          <p className='lead__sort__Title__Item'><b>{result.name}</b></p>
                                          <>
                                            {
                                              React.Children.toArray(result.data.map((dataitem, index) => {
                                                return <JobCard
                                                  buttonText={"View"}
                                                  candidateCardView={true}
                                                  candidateData={dataitem}
                                                  jobAppliedFor={
                                                    jobs?.find(
                                                      (job) =>
                                                        job.job_number === dataitem.job_number
                                                    )
                                                      ? jobs?.find(
                                                        (job) =>
                                                          job.job_number ===
                                                          dataitem.job_number
                                                      ).job_title
                                                      : ""
                                                  }
                                                  handleBtnClick={handleViewTaskBtnClick}
                                                  taskView={true}
                                                  className={index % 2 !== 0 ? 'remove__mar' : ''}
                                                  externalLinkingEnabled={true}
                                                  externalLink={`/logs-approval-screen?applicant=${dataitem.applicant}~project=${currentSelectedProjectForLead}~user-id=${dataitem.user_id}`}
                                                />
                                              }))
                                            }
                                          </>
                                          <br />
                                        </>
                                      }))
                                }
                              </>
                            )
                              :
                              React.Children.toArray(
                                  candidatesData.allCandidates
                                  .filter(candidate => 
                                    candidate.project && 
                                    Array.isArray(candidate.project) &&
                                    candidate.project.includes(currentSelectedProjectForLead)
                                  )
                                  ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                  .map((dataitem, index) => {
                                    return (
                                      <JobCard
                                        buttonText={"View"}
                                        candidateCardView={true}
                                        candidateData={dataitem}
                                        jobAppliedFor={
                                          jobs?.find(
                                            (job) =>
                                              job.job_number === dataitem.job_number
                                          )
                                            ? jobs?.find(
                                              (job) =>
                                                job.job_number ===
                                                dataitem.job_number
                                            ).job_title
                                            : ""
                                        }
                                        handleBtnClick={handleViewTaskBtnClick}
                                        taskView={true}
                                        className={index % 2 !== 0 ? 'remove__mar' : ''}
                                        externalLinkingEnabled={true}
                                        externalLink={`/logs-approval-screen?applicant=${dataitem.applicant}~project=${currentSelectedProjectForLead}~user-id=${dataitem.user_id}`}
                                      />
                                    );
                                  })
                              )
                          )
                        ) : (
                          <></>
                        )}
                        {
                          section === 'task' ?
                            <div className='JobsChanger_containter'>
                              <button
                                onClick={() =>
                                  decrementStepPagination()
                                }
                              >
                                <IoIosArrowBack />
                              </button>

                              {createArrayWithLength(
                                currentSortOption ?
                                  Math.ceil(sortResults.length / 6)
                                  :
                                  searchValue.length >= 1 ?
                                    Math.ceil(filteredUsersForLogTiles.length / 6)
                                    :
                                    Math.ceil(
                                      candidatesData.allCandidates
                                      .filter(candidate => 
                                        candidate.project && 
                                        Array.isArray(candidate.project) &&
                                        candidate.project.includes(currentSelectedProjectForLead)
                                      ).length 
                                      / 
                                      6
                                    )
                              )
                                .slice(
                                  cardPagination,
                                  cardPagination + 6
                                )
                                .map((s, index) => (
                                  <button
                                    className={s !== cardIndex ? "active" : "desactive"}
                                    onClick={() => {
                                      setCardGroupNumber(index * 6);
                                      setCardIndex(index);
                                    }}
                                    key={`${s}_button`}
                                  >
                                    {s + 1}
                                  </button>
                                ))}

                              <button
                                onClick={() =>
                                  incrementStepPagination(
                                    6,
                                    currentSortOption ?
                                      Math.ceil(sortResults.length / 6)
                                      :
                                      searchValue.length >= 1 ?
                                        Math.ceil(filteredUsersForLogTiles.length / 6)
                                        :
                                        Math.ceil(
                                          candidatesData.allCandidates
                                          .filter(candidate => 
                                            candidate.project && 
                                            Array.isArray(candidate.project) &&
                                            candidate.project.includes(currentSelectedProjectForLead)
                                          ).length 
                                          / 
                                          6
                                        )
                                  )
                                }
                              >
                                <IoIosArrowForward />
                              </button>
                            </div> : <></>
                        }
                      </div>
                    </>
                    :
                    <AddPage
                      showAddIssueModal={showAddIssueModalForGrouplead}
                      setShowAddIssueModal={setShowAddIssueModalForGrouplead}
                      showAddTaskModal={showAddTaskModalForGrouplead}
                      setShowAddTaskModal={setShowAddTaskModalForGrouplead}
                      isTeamlead={true}
                      handleViewIndividualTaskBtn={() => navigate('/user-tasks')}
                      handleViewTeamTaskBtn={() => navigate('/all-tasks')}
                      logRequestDate={logRequestDate}
                    />
                )
              ) : section === "user" ? (
                <UserScreen isGrouplead={isGrouplead} />
              ) : !isGrouplead && section === 'user-tasks' ? (
                <>
                  <br />
                  <TitleNavigationBar 
                    handleBackBtnClick={() => navigate(-1)}
                    className={'team__Lead__back__Btn__Wrap'}
                    buttonWrapClassName={'team__Lead__back__Btn'}
                  />
                  <UsersLogsScreen 
                    className={'new__Log__User__Wrapp'} 
                    isLeadUser={true}
                  />
                </>
              ) :
                !isGrouplead && section === 'all-tasks' ? (
                  <>
                    <SelectedCandidates
                      showTasks={true}
                      tasksCount={
                        currentSortOption ?
                          searchValue.length > 0 ?
                            sortResults.filter(
                              item =>
                                item.data.find(
                                  user => typeof user?.applicant === 'string' && user?.applicant?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase()))
                            ).length
                            :
                            sortResults.length
                          :
                          searchValue.length >= 1
                            ? filteredUsersForLogTiles.length
                            : candidatesData.allCandidates
                              .filter(candidate => 
                                candidate.project && 
                                Array.isArray(candidate.project) &&
                                candidate.project.includes(currentSelectedProjectForLead)
                              ).length
                      }
                      availableSortOptions={sortOptionsForLead}
                      sortActive={currentSortOption ? true : false}
                      handleSortOptionClick={(data) => setCurrentSortOption(data)}
                    />
                    <div className="project__Select__Wrapper">
                      <select defaultValue={''} value={currentSelectedProjectForLead} onChange={({ target }) => setCurrentSelectedProjectForLead(target.value)}>
                        <option value={''} disabled>Select project</option>
                        <option
                          value={
                            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project
                          }
                        >
                          {
                            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project
                          }
                        </option>
                        {
                          currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
                          Array.isArray(
                            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
                          ) &&
                          React.Children.toArray(
                            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(project => {
                              return <option value={project}>{project}</option>
                            })
                          )
                        }
                      </select>
                    </div>

                    <div className="tasks-container">
                      {
                        searchValue.length >= 1 ? (
                          <>
                            {React.Children.toArray(
                              filteredUsersForLogTiles
                                ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                .map((dataitem, index) => {
                                  return (
                                    <JobCard
                                      buttonText={"View"}
                                      candidateCardView={true}
                                      candidateData={dataitem}
                                      jobAppliedFor={
                                        jobs?.find(
                                          (job) =>
                                            job.job_number === dataitem.job_number
                                        )
                                          ? jobs?.find(
                                            (job) =>
                                              job.job_number ===
                                              dataitem.job_number
                                          ).job_title
                                          : ""
                                      }
                                      handleBtnClick={handleViewTaskBtnClick}
                                      taskView={true}
                                      className={index % 2 !== 0 ? 'remove__mar' : ''}
                                      externalLinkingEnabled={true}
                                      externalLink={`/logs-approval-screen?applicant=${dataitem.applicant}~project=${currentSelectedProjectForLead}~user-id=${dataitem.user_id}`}
                                    />
                                  );
                                })
                            )}
                            <div className='JobsChanger_containter'>
                              <button
                                onClick={() =>
                                  decrementStepPagination2()
                                }
                              >
                                <IoIosArrowBack />
                              </button>
                              {createArrayWithLength(
                                Math.ceil(filteredUsersForLogTiles.length / 6)
                              )
                                .slice(cardPagination2, cardPagination2 + 6)
                                .map((s, index) => (
                                  <button
                                    className={s !== cardIndex ? "active" : "desactive"}
                                    onClick={() => {
                                      setCardGroupNumber(index * 6);
                                      setCardIndex(index);
                                    }}
                                    key={`${s}_button`}
                                  >
                                    {s + 1}
                                  </button>
                                ))}

                              <button
                                onClick={() =>
                                  incrementStepPagination2(
                                    6,
                                    Math.ceil(filteredUsersForLogTiles.length / 6)
                                  )
                                }
                              >
                                <IoIosArrowForward />
                              </button>
                            </div>
                          </>
                        ) :
                          (
                            <>
                              {
                                currentSortOption ? <>
                                  {
                                    React.Children.toArray(
                                      sortResults
                                        ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                        .map(result => {
                                          return <>
                                            <p className='lead__sort__Title__Item'><b>{result.name}</b></p>
                                            <>
                                              {
                                                React.Children.toArray(result.data.map((dataitem, index) => {
                                                  return <JobCard
                                                    buttonText={"View"}
                                                    candidateCardView={true}
                                                    candidateData={dataitem}
                                                    jobAppliedFor={
                                                      jobs?.find(
                                                        (job) =>
                                                          job.job_number === dataitem.job_number
                                                      )
                                                        ? jobs?.find(
                                                          (job) =>
                                                            job.job_number ===
                                                            dataitem.job_number
                                                        ).job_title
                                                        : ""
                                                    }
                                                    handleBtnClick={handleViewTaskBtnClick}
                                                    taskView={true}
                                                    className={index % 2 !== 0 ? 'remove__mar' : ''}
                                                    externalLinkingEnabled={true}
                                                    externalLink={`/logs-approval-screen?applicant=${dataitem.applicant}~project=${currentSelectedProjectForLead}~user-id=${dataitem.user_id}`}
                                                  />
                                                }))
                                              }
                                            </>
                                            <br />
                                          </>
                                        }))
                                  }
                                </>
                                  :
                                  React.Children.toArray(
                                    // createArrayWithLength(Math.ceil(tasksToDisplayForLead / 6))
                                      candidatesData.allCandidates
                                      .filter(candidate => 
                                        candidate.project && 
                                        Array.isArray(candidate.project) &&
                                        candidate.project.includes(currentSelectedProjectForLead)
                                      )
                                      ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                      .map((dataitem, index) => {
                                        return (
                                          <JobCard
                                            buttonText={"View"}
                                            candidateCardView={true}
                                            candidateData={dataitem}
                                            jobAppliedFor={
                                              jobs?.find(
                                                (job) =>
                                                  job.job_number === dataitem.job_number
                                              )
                                                ? jobs?.find(
                                                  (job) =>
                                                    job.job_number ===
                                                    dataitem.job_number
                                                ).job_title
                                                : ""
                                            }
                                            handleBtnClick={handleViewTaskBtnClick}
                                            taskView={true}
                                            className={index % 2 !== 0 ? 'remove__mar' : ''}
                                            externalLinkingEnabled={true}
                                            externalLink={`/logs-approval-screen?applicant=${dataitem.applicant}~project=${currentSelectedProjectForLead}~user-id=${dataitem.user_id}`}
                                          />
                                        );

                                      })
                                  )}
                              <div className='JobsChanger_containter'>
                                <button
                                  onClick={() =>
                                    decrementStepPagination3()
                                  }
                                >
                                  <IoIosArrowBack />
                                </button>
                                {createArrayWithLength(
                                  currentSortOption ?
                                    Math.ceil(sortResults.length / 6)
                                    :
                                    Math.ceil(
                                      candidatesData.allCandidates
                                      .filter(candidate => 
                                        candidate.project && 
                                        Array.isArray(candidate.project) &&
                                        candidate.project.includes(currentSelectedProjectForLead)
                                      ).length 
                                      / 
                                      6
                                    )
                                )
                                  .slice(cardPagination3, cardPagination3 + 6)
                                  .map((s, index) => (
                                    <button
                                      className={s !== cardIndex ? "active" : "desactive"}
                                      onClick={() => {
                                        setCardGroupNumber(index * 6);
                                        setCardIndex(index);
                                      }}
                                      key={`${s}_button`}
                                    >
                                      {s + 1}
                                    </button>
                                  ))}
                                <button
                                  onClick={() =>
                                    incrementStepPagination3(
                                      6,
                                      currentSortOption ?
                                        Math.ceil(sortResults.length / 6)
                                        :
                                        Math.ceil(
                                          candidatesData.allCandidates
                                          .filter(candidate => 
                                            candidate.project && 
                                            Array.isArray(candidate.project) &&
                                            candidate.project.includes(currentSelectedProjectForLead)
                                          ).length 
                                          / 
                                          6
                                        )
                                    )
                                  }
                                >
                                  <IoIosArrowForward />
                                </button>
                              </div>

                            </>
                          )
                      }
                    </div>
                  </>
                ) : (
                  <>
                    <ErrorPage disableNav={true} />
                  </>
                )}
            </>
          )}
        </>
      </StaffJobLandingLayout >
    </>
  );
};

const sortOptionsForLead = [
  'date',
  'applicant',
]

export default Teamlead;