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
import { getAllCompanyUserSubProject, getJobs2 } from "../../services/commonServices";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useJobContext } from "../../contexts/Jobs";
import {
  getCandidateApplicationsForTeamLead,
  getCandidateTaskForTeamLead,
  getCandidateTasksV2,
} from "../../services/teamleadServices";
import { useCandidateTaskContext } from "../../contexts/CandidateTasksContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from "react-icons/io";
import { ApproveVouchar, ClaimVouchar } from "./views/ClaimVouchar/ClaimVouchar";
import AddPage from "../GroupLeadPage/components/AddPage";
import { getAllOnBoardedCandidate, getCandidateTasksOfTheDayV2 } from "../../services/candidateServices";
import { extractNewTasksAndAddExtraDetail } from "./util/extractNewTasks";
import { createArrayWithLength } from "../AdminPage/views/Landingpage/LandingPage";

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
  const [showAddTaskModalForGrouplead, setShowAddTaskModalForGrouplead] = useState(false);
  const [showAddIssueModalForGrouplead, setShowAddIssueModalForGrouplead] = useState(false);
  const [currentSelectedProjectForLead, setCurrentSelectedProjectForLead] = useState('');
  const [tasksToDisplayForLead, setTasksToDisplayForLead] = useState([]);
  const [allSubProjects, setAllSubprojects] = useState([]);
  const [showTaskLandingPage, setShowTaskLandingPage] = useState(true);
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
  const initializePagination = () => {
    setCardPagination(0);
  };
  const initializePagination2 = () => {
    setCardPagination2(0);
  };
  const initializePagination3 = () => {
    setCardPagination2(0);
  };

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
      setFilteredTasks(
        tasksToDisplayForLead.filter((task) =>
          (typeof task.applicant === 'string' && task.applicant && task.applicant.toLocaleLowerCase().includes(value.toLocaleLowerCase())) ||
          (typeof task.applicantName === 'string' && task.applicantName && task.applicantName.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
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

    const initialProjectSelected = currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project;

    const requestDataToPost2 = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "project": initialProjectSelected,
    }

    setCurrentSelectedProjectForLead(initialProjectSelected);

    setLoading(true);

    if (isGrouplead) {
      Promise.all([
        getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id),
        getCandidateTasksV2(requestDataToPost2),
        getAllCompanyUserSubProject(currentUser.portfolio_info[0].org_id, currentUser.portfolio_info[0].data_type),
        getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id),
      ])
        .then(async (res) => {

          if (userTasks.length > 0) {
            setLoading(false);
            setCandidatesDataLoaded(true);
            return;
          }

          const onboardingCandidates = res[3]?.data?.response?.data
            .filter(
              (application) =>
                application.data_type === currentUser?.portfolio_info[0].data_type
            );

          dispatchToCandidatesData({
            type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
            payload: {
              stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
              value: onboardingCandidates,
            },
          });

          const tasksToDisplay = res[0]?.data?.response?.data
            ?.filter(
              (task) =>
                task.data_type === currentUser?.portfolio_info[0]?.data_type
            )
          const previousTasksFormat = tasksToDisplay.filter(task => !task.user_id && task.task);
          const updatedTasksForMainProject = extractNewTasksAndAddExtraDetail(res[1]?.data?.task_details, res[1]?.data?.task, false, onboardingCandidates);

          let updatedTasksForOtherProjects;

          const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
            Array.isArray(
              currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
            )

          if (userHasOtherProjects) {
            updatedTasksForOtherProjects = await Promise.all(currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(async (project) => {
              const dataToPost = {
                ...requestDataToPost2,
                project: project
              }

              const res = (await getCandidateTasksV2(dataToPost)).data;

              const extractedTasks = extractNewTasksAndAddExtraDetail(res?.task_details, res?.task, false, onboardingCandidates);
              return extractedTasks;
            }))
          }

          const newTasksToDisplay = userHasOtherProjects ?
            [...previousTasksFormat, ...updatedTasksForMainProject, ...updatedTasksForOtherProjects.flat()]
            :
            [...previousTasksFormat, ...updatedTasksForMainProject];

          const usersWithTasks = [
            ...new Map(
              newTasksToDisplay.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
            ).values(),
          ];
          setUserTasks(usersWithTasks.sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date)));
          setTasksToDisplayForLead(
            usersWithTasks.filter(
              (task) =>
                task.project ===
                initialProjectSelected
            )
          )
          setLoading(false);
          setCandidatesDataLoaded(true);
          setAllSubprojects(res[2].reverse());
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
      getCandidateTasksV2(requestDataToPost2),
      getAllCompanyUserSubProject(currentUser.portfolio_info[0].org_id, currentUser.portfolio_info[0].data_type),
    ])
      .then(async (res) => {
        console.log("res", res);
        const jobsMatchingCurrentCompany = res[0].data.response.data.filter(
          (job) =>
            job.data_type === currentUser?.portfolio_info[0].data_type &&
            job.is_active
        )
        .filter(job => !job.is_internal);
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

        setCandidatesDataLoaded(true);

        if (userTasks.length > 0) {
          setLoading(false);
          return;
        }

        const tasksToDisplay = res[2].data.response.data
          .filter(
            (task) =>
              task.data_type === currentUser?.portfolio_info[0].data_type
          )
        console.log("tasksToDisplay", tasksToDisplay);

        const previousTasksFormat = tasksToDisplay.filter(task => !task.user_id && task.task);
        const updatedTasksForMainProject = extractNewTasksAndAddExtraDetail(res[3]?.data?.task_details, res[3]?.data?.task, false, onboardingCandidates);

        let updatedTasksForOtherProjects;

        const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
          Array.isArray(
            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
          )

        if (userHasOtherProjects) {
          updatedTasksForOtherProjects = await Promise.all(currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(async (project) => {
            const dataToPost = {
              ...requestDataToPost2,
              project: project
            }

            const res = (await getCandidateTasksV2(dataToPost)).data;

            const extractedTasks = extractNewTasksAndAddExtraDetail(res?.task_details, res?.task, false, onboardingCandidates);
            return extractedTasks;
          }))
        }

        console.log('previous tasks: ', previousTasksFormat);
        console.log('updated new tasks 1: ', updatedTasksForMainProject);
        userHasOtherProjects && console.log('updated new tasks 2: ', updatedTasksForOtherProjects.flat());

        const newTasksToDisplay = userHasOtherProjects ?
          [...previousTasksFormat, ...updatedTasksForMainProject, ...updatedTasksForOtherProjects.flat()]
          :
          [...previousTasksFormat, ...updatedTasksForMainProject];

        const usersWithTasks = [
          ...new Map(
            newTasksToDisplay.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
          ).values(),
        ];
        console.log(usersWithTasks);
        // console.log(res.data.response.data);
        setUserTasks(usersWithTasks.sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date)));
        setTasksToDisplayForLead(
          usersWithTasks.filter(
            (task) =>
              task.project ===
              initialProjectSelected
          )
        )
        setLoading(false);
        setAllSubprojects(res[4].reverse());
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
    if (section === 'task' && !isGrouplead && !showTaskLandingPage) {
      if (loading || tasksToDisplayForLead?.length > 0) return

      const initialProjectSelected = currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project;

      const dataToPost = {
        "company_id": currentUser.portfolio_info[0].org_id,
        "data_type": currentUser.portfolio_info[0].data_type,
        "project": initialProjectSelected,
      }

      setLoading(true);

      Promise.all([
        getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id),
        getCandidateTasksV2(dataToPost),
        getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id),
      ])
        .then(async (res) => {
          console.log("res", res);

          const onboardingCandidates = res[2]?.data?.response?.data
            ?.filter(
              (application) =>
                application.data_type === currentUser?.portfolio_info[0].data_type
            );

          const tasksToDisplay = res[0]?.data?.response?.data
            ?.filter(
              (task) =>
                task.data_type === currentUser?.portfolio_info[0].data_type
            )
          console.log("tasksToDisplay", tasksToDisplay);

          const previousTasksFormat = tasksToDisplay.filter(task => !task.user_id && task.task);
          const updatedTasksForMainProject = extractNewTasksAndAddExtraDetail(res[1]?.data?.task_details, res[1]?.data?.task, false, onboardingCandidates);

          let updatedTasksForOtherProjects;

          const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
            Array.isArray(
              currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
            )

          if (userHasOtherProjects) {
            updatedTasksForOtherProjects = await Promise.all(currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(async (project) => {
              const dataToPost2 = {
                ...dataToPost,
                project: project
              }

              const res = (await getCandidateTasksV2(dataToPost2)).data;

              const extractedTasks = extractNewTasksAndAddExtraDetail(res?.task_details, res?.task, false, onboardingCandidates);
              return extractedTasks;
            }))
          }

          const newTasksToDisplay = userHasOtherProjects ?
            [...previousTasksFormat, ...updatedTasksForMainProject, ...updatedTasksForOtherProjects.flat()]
            :
            [...previousTasksFormat, ...updatedTasksForMainProject];
          console.log(newTasksToDisplay);
          const usersWithTasks = [
            ...new Map(
              newTasksToDisplay.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
            ).values(),
          ];
          console.log(usersWithTasks);
          // console.log(res.data.response.data);
          setUserTasks(usersWithTasks.sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date)));
          setTasksToDisplayForLead(
            usersWithTasks.filter(
              (task) =>
                task.project ===
                currentSelectedProjectForLead
            )
          )
          setLoading(false);
          setCurrentSelectedProjectForLead(initialProjectSelected);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [section, showTaskLandingPage])

  useEffect(() => {
    setTasksToDisplayForLead(
      userTasks.filter(
        (task) =>
          task.project ===
          currentSelectedProjectForLead
      )
    )
  }, [userTasks, currentSelectedProjectForLead])

  useEffect(() => {

    if (!currentSortOption) return;

    const categories = {};
    const newArray = [];

    const getCategoryArray = (propertyName, date) => {

      tasksToDisplayForLead.forEach(task => {
        if (date) {

          if (categories.hasOwnProperty(new Date(task[`${propertyName}`]).toDateString())) return

          categories[`${new Date(task[propertyName]).toDateString()}`] = new Date(task[`${propertyName}`]).toDateString();
          return

        }

        if (!categories.hasOwnProperty(task[`${propertyName}`])) {
          categories[`${task[propertyName]}`] = task[`${propertyName}`]
        }
      })

      let categoryObj = {};

      Object.keys(categories || {}).forEach(key => {

        if (key === "undefined") return;

        if (date) {
          const matchingTasks = tasksToDisplayForLead.filter(task => new Date(task[`${propertyName}`]).toDateString() === key);
          categoryObj.name = key;
          categoryObj.data = matchingTasks;
          newArray.push(categoryObj);
          categoryObj = {};
          return
        }

        const matchingTasks = tasksToDisplayForLead.filter(task => task[`${propertyName}`] === key);
        categoryObj.name = key;
        categoryObj.data = matchingTasks;
        newArray.push(categoryObj);
        categoryObj = {};
      })

      return newArray;
    }

    switch (currentSortOption) {
      case "applicant":
        const applicantCategoryData = getCategoryArray('applicantName');
        setSortResults(applicantCategoryData);
        break;
      case "date":
        const dateCategoryData = getCategoryArray("task_created_date", true);
        setSortResults(dateCategoryData.sort((a, b) => new Date(b.name) - new Date(a.name)));
        break;
      default:
        setSortResults([]);
        break;
    }

  }, [currentSortOption])

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

    if (item === "Work logs") return navigate("/task");

    const passedItemInLowercase = item.toLocaleLowerCase();
    return navigate(`/?tab=${passedItemInLowercase}`);
  };

  const handleViewTaskBtnClick = (data) => {
    navigate(`/new-task-screen?applicant=${data.applicant}&project=${data.project}&name=${data.applicantName}`);
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
    if (loading) return

    const initialProjectSelected = currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project;

    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "project": initialProjectSelected,
    }

    setLoading(true);
    setCurrentSortOption(null);
    setSortResults([]);

    Promise.all([
      getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id),
      getCandidateTasksV2(dataToPost),
    ])
      .then(async (res) => {
        console.log("res", res);

        const tasksToDisplay = res[0]?.data?.response?.data
          ?.filter(
            (task) =>
              task.data_type === currentUser?.portfolio_info[0].data_type
          )
        console.log("tasksToDisplay", tasksToDisplay);

        const previousTasksFormat = tasksToDisplay.filter(task => !task.user_id && task.task);
        const updatedTasksForMainProject = extractNewTasksAndAddExtraDetail(res[1]?.data?.task_details, res[1]?.data?.task, false, candidatesData.onboardingCandidates);

        let updatedTasksForOtherProjects;

        const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
          Array.isArray(
            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
          )

        if (userHasOtherProjects) {
          updatedTasksForOtherProjects = await Promise.all(currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(async (project) => {
            const dataToPost2 = {
              ...dataToPost,
              project: project
            }

            const res = (await getCandidateTasksV2(dataToPost2)).data;

            const extractedTasks = extractNewTasksAndAddExtraDetail(res?.task_details, res?.task, false, candidatesData.onboardingCandidates);
            return extractedTasks;
          }))
        }

        const newTasksToDisplay = userHasOtherProjects ?
          [...previousTasksFormat, ...updatedTasksForMainProject, ...updatedTasksForOtherProjects.flat()]
          :
          [...previousTasksFormat, ...updatedTasksForMainProject];
        console.log(newTasksToDisplay);
        const usersWithTasks = [
          ...new Map(
            newTasksToDisplay.filter(task => task.task_added_by !== currentUser?.userinfo?.username).map((task) => [task._id, task])
          ).values(),
        ];
        console.log(usersWithTasks);
        // console.log(res.data.response.data);
        setUserTasks(usersWithTasks.sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date)));
        setTasksToDisplayForLead(
          usersWithTasks.filter(
            (task) =>
              task.project ===
              currentSelectedProjectForLead
          )
        )
        setLoading(false);
        setCurrentSelectedProjectForLead(initialProjectSelected);
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
            }
          </>
        }
        {section !== "user" && !showCandidate && !isGrouplead && (
          section === 'user-tasks' ? <></> :
            section === 'all-tasks' ? <>
              <button
                className="refresh-container-teamlead desktop"
              >
                <div className="refresh-btn refresh-btn-teamlead" onClick={loading ? () => {} : () => handleRefreshForCandidateTask()}
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
                      <div className="refresh-btn refresh-btn-teamlead" onClick={loading ? () => {} : section === "all-tasks" ? () => handleRefreshForCandidateTask() : () => handleRefreshForCandidateApplicationsForTeamlead()}
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
            <div className="refresh-btn refresh-btn-teamlead" onClick={() => handleRefreshForCandidateTask()}
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
                      job={
                        jobs.find(
                          (job) => job.job_number === currentCandidate.job_number
                        ) ?
                          jobs.find(
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
                          subprojects={allSubProjects}
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
                                    task => typeof task?.applicantName === 'string' && task?.applicantName?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase()))
                              ).length
                              :
                              sortResults.length
                            :
                            searchValue.length >= 1
                              ? filteredTasks.length
                              : tasksToDisplayForLead.length
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
                              filteredTasks.map((dataitem, index) => {
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
                                    className={index % 2 !== 0 ? 'remove__mar' : ''}
                                    externalLinkingEnabled={true}
                                    externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
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
                                                  className={index % 2 !== 0 ? 'remove__mar' : ''}
                                                  externalLinkingEnabled={true}
                                                  externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
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
                                tasksToDisplayForLead
                                  ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                  .map((dataitem, index) => {
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
                                        className={index % 2 !== 0 ? 'remove__mar' : ''}
                                        externalLinkingEnabled={true}
                                        externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
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
                                    Math.ceil(filteredTasks.length / 6)
                                    :
                                    Math.ceil(tasksToDisplayForLead.length / 6)
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
                                        Math.ceil(filteredTasks.length / 6)
                                        :
                                        Math.ceil(tasksToDisplayForLead.length / 6)
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
                      subprojects={allSubProjects}
                      isTeamlead={true}
                      handleViewIndividualTaskBtn={() => navigate('/user-tasks')}
                      handleViewTeamTaskBtn={() => navigate('/all-tasks')}
                      logRequestDate={logRequestDate}
                    />
                )
              ) : section === "user" ? (
                <UserScreen isGrouplead={isGrouplead} />
              ) : !isGrouplead && section === 'user-tasks' ? (
                <TaskScreen
                  candidateAfterSelectionScreen={true}
                  assignedProject={
                    currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
                      Array.isArray(
                        currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
                      ) ?
                      [
                        currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project,
                        ...currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
                      ]
                      :
                      [
                        currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project
                      ]
                  }
                  showBackBtn={true}
                  loadProjects={true}
                  isTeamlead={true}
                />
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
                                  task => typeof task?.applicantName === 'string' && task?.applicantName?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase()))
                            ).length
                            :
                            sortResults.length
                          :
                          searchValue.length >= 1
                            ? filteredTasks.length
                            : tasksToDisplayForLead.length
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
                              filteredTasks
                                ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                .map((dataitem, index) => {
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
                                      className={index % 2 !== 0 ? 'remove__mar' : ''}
                                      externalLinkingEnabled={true}
                                      externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
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
                                Math.ceil(filteredTasks.length / 6)
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
                                    Math.ceil(filteredTasks.length / 6)
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
                                                    className={index % 2 !== 0 ? 'remove__mar' : ''}
                                                    externalLinkingEnabled={true}
                                                    externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
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
                                    tasksToDisplayForLead
                                      ?.slice(cardGroupNumber, cardGroupNumber + 6)
                                      .map((dataitem, index) => {
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
                                            className={index % 2 !== 0 ? 'remove__mar' : ''}
                                            externalLinkingEnabled={true}
                                            externalLink={`/new-task-screen?applicant=${dataitem.applicant}~project=${dataitem.project}~name=${dataitem.applicantName}`}
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
                                    Math.ceil(tasksToDisplayForLead.length / 6)
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
                                        Math.ceil(tasksToDisplayForLead.length / 6)
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