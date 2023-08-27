import React, { useEffect, useState } from "react";
import {
  initialCandidatesDataStateNames,
  useCandidateContext,
} from "../../contexts/CandidatesContext";
import { useNavigationContext } from "../../contexts/NavigationContext";
import ErrorPage from "../ErrorPage/ErrorPage";
import SelectedCandidates from "./components/SelectedCandidates/SelectedCandidates";
import SelectedCandidatesScreen from "./views/SelectedCandidatesScreen/SelectedCandidatesScreen";
import TaskScreen from "./views/TaskScreen/TaskScreen";
import "./style.css";
import { candidateStatuses } from "../CandidatePage/utils/candidateStatuses";
import { candidateDataReducerActions } from "../../reducers/CandidateDataReducer";
import Button from "../AdminPage/components/Button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddTaskScreen from "./views/AddTaskScreen/AddTaskScreen";
import UserScreen from "./views/UserScreen/UserScreen";
import { useLocation, useNavigate } from "react-router-dom";
import { mutableNewApplicationStateNames } from "../../contexts/NewApplicationContext";
import StaffJobLandingLayout from "../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../components/TitleNavigationBar/TitleNavigationBar";
import TogglerNavMenuBar from "../../components/TogglerNavMenuBar/TogglerNavMenuBar";
import JobCard from "../../components/JobCard/JobCard";
import { getJobs2 } from "../../services/commonServices";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useJobContext } from "../../contexts/Jobs";
import {
  getCandidateApplicationsForTeamLead,
  getCandidateTaskForTeamLead,
} from "../../services/teamleadServices";
import { useCandidateTaskContext } from "../../contexts/CandidateTasksContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IoMdRefresh } from "react-icons/io";
import ClaimVouchar from "./views/ClaimVouchar/ClaimVouchar";
import AddPage from "../GroupLeadPage/components/AddPage";

const Teamlead = ({ isGrouplead }) => {
  const { currentUser } = useCurrentUserContext();
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
  const [currentTeamMember, setCurrentTeamMember] = useState({});
  const [currentUserProject, setCurrentUserProject] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const { userTasks, setUserTasks } = useCandidateTaskContext();
  console.log("userTasks", userTasks);
  // const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editTaskActive, setEditTaskActive] = useState(false);
  const [currentTaskToEdit, setCurrentTaskToEdit] = useState({});
  const location = useLocation();
  const [currentActiveItem, setCurrentActiveItem] = useState("Approval");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filteredTasks, setFilteredTasks] = useState(userTasks);

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
    } else if (section === "task") {
      setFilteredTasks(
        userTasks.filter((task) =>
          task.applicant.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        )
      );

      console.log("filteredTasks", filteredTasks);
    }
  };

  // const handleSearchTask = (value) => {
  //   console.log("value", value);
  //   setSearchValue(value);
  //   setFilteredTasks(
  //     userTasks.filter((task) =>
  //       task.applicant.toLocaleLowerCase().includes(value.toLocaleLowerCase())
  //     )
  //   );

  //   console.log("filteredTasks", filteredTasks);
  // };

  useEffect(() => {
    if (candidatesDataLoaded) return;

    const requestData = {
      company_id: currentUser?.portfolio_info[0].org_id,
    };

    setLoading(true);

    if (isGrouplead) {
      getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id)
        .then((res) => {
          setLoading(false);
          setCandidatesDataLoaded(true);

          if (userTasks.length > 0) return;

          const tasksToDisplay = res?.data?.response?.data
            ?.filter(
              (task) =>
                task.data_type === currentUser?.portfolio_info[0]?.data_type
            )
            .filter(
              (task) =>
                task.project ===
                currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project
            );

          const usersWithTasks = [
            ...new Map(
              tasksToDisplay.map((task) => [task.applicant, task])
            ).values(),
          ];
          setUserTasks(usersWithTasks.reverse());
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      return
    }


    Promise.all([
      getJobs2(requestData),
      getCandidateApplicationsForTeamLead(
        currentUser?.portfolio_info[0].org_id
      ),
      getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id),
    ])
      .then((res) => {
        console.log("res", res);
        const jobsMatchingCurrentCompany = res[0].data.response.data.filter(
          (job) =>
            job.data_type === currentUser?.portfolio_info[0].data_type &&
            job.is_active
        );
        console.log(jobsMatchingCurrentCompany);
        setJobs(jobsMatchingCurrentCompany);

        const applicationForMatching = res[1].data.response.data
          .filter(
            (application) =>
              application.data_type === currentUser?.portfolio_info[0].data_type
          )
          .reverse();
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

        setLoading(false);
        setCandidatesDataLoaded(true);

        if (userTasks.length > 0) return;

        const tasksToDisplay = res[2].data.response.data
          .filter(
            (task) =>
              task.data_type === currentUser?.portfolio_info[0].data_type
          )
          .filter(
            (task) =>
              task.project ===
              currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1].project
          );
        console.log("tasksToDisplay", tasksToDisplay);

        const usersWithTasks = [
          ...new Map(
            tasksToDisplay.map((task) => [task.applicant, task])
          ).values(),
        ];
        console.log(usersWithTasks);
        // console.log(res.data.response.data);
        setUserTasks(usersWithTasks.reverse());
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const foundCandidate = candidatesData.onboardingCandidates.find(
      (data) => data.applicant === currentTeamMember
    );

    if (!foundCandidate) return;

    const candidateProject =
      foundCandidate.others[mutableNewApplicationStateNames.assigned_project];
    setCurrentUserProject(candidateProject);
  }, [currentTeamMember]);

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
    const currentPath = location.pathname.split("/")[1];
    const currentTab = searchParams.get("tab");

    if (!currentPath && !currentTab) return setCurrentActiveItem("Approval");
    if (currentPath && currentPath === "task")
      return setCurrentActiveItem("Tasks");
  }, [location]);

  const handleEditTaskBtnClick = (currentData) => {
    setEditTaskActive(true);
    setCurrentTaskToEdit(currentData);
    setShowAddTaskModal(true);
  };

  const handleBackBtnClick = () => {
    setShowCandidate(false);
    setShowCandidateTask(false);
  };

  const handleMenuItemClick = (item) => {
    setCurrentActiveItem(item);

    if (item === "Tasks") return navigate("/task");

    const passedItemInLowercase = item.toLocaleLowerCase();
    return navigate(`/?tab=${passedItemInLowercase}`);
  };

  const handleViewTaskBtnClick = (data) => {
    navigate(`/new-task-screen?applicant=${data.applicant}`);
    // setCurrentTeamMember(data.user);
    // setShowCandidateTask(true);
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
        const applicationForMatching = res.data.response.data
          .filter(
            (application) =>
              application.data_type === currentUser?.portfolio_info[0].data_type
          )
          .reverse();
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

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleRefreshForCandidateTask = () => {
    setLoading(true);
    getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id)
      .then((res) => {
        console.log("res", res);

        const tasksToDisplay = res.data.response.data
          .filter(
            (task) =>
              task.data_type === currentUser?.portfolio_info[0].data_type
          )
          .filter(
            (task) =>
              task.project ===
              currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1].project
          );
        console.log("tasksToDisplay", tasksToDisplay);

        const usersWithTasks = [
          ...new Map(
            tasksToDisplay.map((task) => [task.applicant, task])
          ).values(),
        ];
        console.log(usersWithTasks);
        // console.log(res.data.response.data);
        setUserTasks(usersWithTasks.reverse());
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
        hideSideBar={showAddTaskModal}
        searchValue={searchValue}
        setSearchValue={handleSearch}
        searchPlaceHolder={
          section === "home"
            ? isGrouplead ?
              "task" :
              "applicant"
            : section === "task"
              ? "task"
              : rehireTabActive
                ? "rehire"
                : "applicant"
        }
        hideSearchBar={((isGrouplead && (section === "home" || section === undefined)) || section === "user") ? true : false}
        isGrouplead={isGrouplead}
      >
        <TitleNavigationBar
          title={
            section === "task"
              ?
                "Tasks"
              : section === "user"
                ? "Profile"
                : showCandidate
                  ? "Application Details"
                  :
                  isGrouplead ?
                    " "
                    : "Applications"
          }
          hideBackBtn={showCandidate || showCandidateTask ? false : true}
          handleBackBtnClick={handleBackBtnClick}
        />
        {section !== "user" && !showCandidate && !isGrouplead && (
          <>
            <TogglerNavMenuBar
              className={"teamlead"}
              menuItems={
                ["Approval", "Tasks", "Rehire"]
              }
              currentActiveItem={currentActiveItem}
              handleMenuItemClick={handleMenuItemClick}
            />

            <button
              className="refresh-container-teamlead desktop"
            >
              <div className="refresh-btn refresh-btn-teamlead" onClick={handleRefreshForCandidateApplicationsForTeamlead}
              >
                <IoMdRefresh />
                <p>Refresh</p>
              </div>
            </button>
          </>


        )}
        {/* <ClaimVouchar /> */}
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
                  taskToEdit={currentTaskToEdit}
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
                        jobs.filter(
                          (job) =>
                            job.job_number === currentCandidate.job_number
                        ).length >= 1
                          ? jobs.filter(
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
                        <AddPage />
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
                                candidatesData.selectedCandidates.map(
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
                                filteredJobs.map((dataitem) => {
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
                    }
                  </>
                )
              ) : section === "task" ? (
                showCandidateTask ? (
                  <>
                    <TaskScreen
                      currentUser={currentTeamMember}
                      handleAddTaskBtnClick={() => setShowAddTaskModal(true)}
                      handleEditBtnClick={handleEditTaskBtnClick}
                      assignedProject={currentUserProject}
                      teamleadScreen={true}
                    />
                    <h1>Button</h1>
                  </>
                ) : (
                  <>
                    <button
                      className="refresh-container"
                      onClick={handleRefreshForCandidateTask}
                    >
                      <div className="refresh-btn">
                        <IoMdRefresh />
                        <p>Refresh</p>
                      </div>
                    </button>
                    <SelectedCandidates
                      showTasks={true}
                      tasksCount={
                        searchValue.length >= 1
                          ? filteredTasks.length
                          : userTasks.length
                      }
                    />

                    <div className="tasks-container">
                      {section === "task" ? (
                        searchValue.length >= 1 ? (
                          React.Children.toArray(
                            filteredTasks.map((dataitem) => {
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
                                  handleBtnClick={handleViewTaskBtnClick}
                                  taskView={true}
                                />
                              );
                            })
                          )
                        ) : (
                          React.Children.toArray(
                            userTasks.map((dataitem) => {
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
                                  handleBtnClick={handleViewTaskBtnClick}
                                  taskView={true}
                                />
                              );
                            })
                          )
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                )
              ) : section === "user" ? (
                <UserScreen isGrouplead={isGrouplead} />
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

export default Teamlead;
