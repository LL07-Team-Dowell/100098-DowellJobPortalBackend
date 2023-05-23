import React, { useEffect, useState } from 'react';
import './Hr_JobScreen.css';
import { useNavigationContext } from '../../../../contexts/NavigationContext';
import ShortlistedScreen from '../ShortlistedScreen/ShortlistedScreen';
import HrTrainingScreen from '../HrTrainingScreen/HrTrainingScreen';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectedCandidates from '../../../TeamleadPage/components/SelectedCandidates/SelectedCandidates';
import SelectedCandidatesScreen from '../../../TeamleadPage/views/SelectedCandidatesScreen/SelectedCandidatesScreen';
import ErrorPage from '../../../ErrorPage/ErrorPage';
import { mutableNewApplicationStateNames } from '../../../../contexts/NewApplicationContext';
import { candidateStatuses } from '../../../CandidatePage/utils/candidateStatuses';
import { useHrCandidateContext } from '../../../../contexts/HrCandidateContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import UserScreen from '../UserScreen/UserScreen';
import Button from '../../../AdminPage/components/Button/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskScreen from '../../../TeamleadPage/views/AddTaskScreen/AddTaskScreen';
import TaskScreen from '../../../TeamleadPage/views/TaskScreen/TaskScreen';
import AttendanceScreen from '../AttendanceScreen/AttendanceScreen';
import TitleNavigationBar from '../../../../components/TitleNavigationBar/TitleNavigationBar';
import TogglerNavMenuBar from '../../../../components/TogglerNavMenuBar/TogglerNavMenuBar';
import JobCard from '../../../../components/JobCard/JobCard';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { fetchCandidateTasks, getCandidateApplications, getJobs, getJobs2, getProjects } from '../../../../services/commonServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { getCandidateApplicationsForHr, getCandidateTask, getSettingUserProject } from '../../../../services/hrServices';
import { useHrJobScreenAllTasksContext } from '../../../../contexts/HrJobScreenAllTasks';
import HrTrainingQuestions from '../HrTrainingScreen/HrTrainingQuestion';
import { trainingCards } from '../HrTrainingScreen/hrTrainingCards';
import { getTrainingManagementQuestions } from '../../../../services/hrTrainingServices';
import { set } from 'date-fns';

function fuzzySearch(query, text) {
  const searchRegex = new RegExp(query.split('').join('.*'), 'i');
  return searchRegex.test(text);
}

function HrJobScreen() {
  const { currentUser } = useCurrentUserContext();
  const { setQuestions } = useHrJobScreenAllTasksContext();
  const { section, sub_section, path } = useNavigationContext();
  const [jobs, setJobs] = useState([]);
  const [ appliedJobs, setAppliedJobs ] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [jobSearchInput, setJobSearchInput] = useState("");
  const [ searchActive, setSearchActive ] = useState(false);
  const [ matchedJobs, setMatchedJobs ] = useState([]);
  const { candidateData, setCandidateData } = useHrCandidateContext();
  const [ isLoading, setLoading ] = useState(true);
  const [ currentProjects, setCurrentProjects ] = useState([]);
  const { allTasks, setAllTasks } = useHrJobScreenAllTasksContext();
  const [ showAddTaskModal, setShowAddTaskModal ] = useState(false);
  const [ hiredCandidates, setHiredCandidates ] = useState([]);
  const [ showCurrentCandidateTask, setShowCurrentCandidateTask ] = useState(false);
  const [ currentTeamMember, setCurrentTeamMember ] = useState({});
  const [ editTaskActive, setEditTaskActive ] = useState(false);
  const [ currentTaskToEdit, setCurrentTaskToEdit ] = useState({});
  const [ currentCandidateProject, setCurrentCandidateProject ] = useState(null);
  const [ currentSortOption, setCurrentSortOption ] = useState(null);
  const [ sortResults, setSortResults ] = useState([]);
  const [ showCurrentCandidateAttendance, setShowCurrentCandidateAttendance ] = useState(false);
  const [ guestApplications, setGuestApplications ] = useState([]);
  const [ currentActiveItem, setCurrentActiveItem ] = useState("Received");
  const [ trackingProgress, setTrackingProgress ] = useState(false);
  
  const handleEditTaskBtnClick = (currentData) => {
    setEditTaskActive(true);
    setCurrentTaskToEdit(currentData);
    setShowAddTaskModal(true);
  }

  const goToJobDetails = (jobData, candidateData) => navigate("/home/job", { state: { job: jobData, appliedCandidates: candidateData } });

  const goToGuestJobDetails = (jobData, candidateData) => navigate("/guest-applications/job", { state: { job: jobData, appliedCandidates: candidateData } });

  const goToJobApplicationDetails = (candidateData) => {
    if (section === "guest-applications") return navigate(`/guest-applications/job/${candidateData[mutableNewApplicationStateNames.applicant]}`, { state: { candidate: candidateData } })
  
    navigate(`/home/job/${candidateData[mutableNewApplicationStateNames.applicant]}`, { state: { candidate: candidateData } })
  };

  useEffect(() => {

    if ( (sub_section !== undefined) && (section !== "hr-training") && (!location.state) ) return navigate("/home");

    if ( (path !== undefined) && (!location.state)) return navigate("/home");

  }, [sub_section, path])

  useEffect(() => {

    Promise.all([
      getCandidateApplicationsForHr({company_id: currentUser.portfolio_info[0].org_id}),
      getJobs2({company_id: currentUser.portfolio_info[0].org_id}),
      getSettingUserProject(),
      getCandidateTask(currentUser.portfolio_info[0].org_id),
      getTrainingManagementQuestions(currentUser.portfolio_info[0].org_id),
    ])
    .then((res) => {
      const filteredData = res[0].data.response.data.filter(application => application.data_type === currentUser.portfolio_info[0].data_type);
      setAppliedJobs(filteredData.filter(application => application.status === candidateStatuses.PENDING_SELECTION));
      setGuestApplications(filteredData.filter(application => application.status === candidateStatuses.GUEST_PENDING_SELECTION));
      setCandidateData(filteredData.filter(application => application.status === candidateStatuses.SHORTLISTED));
      setHiredCandidates(filteredData.filter(application => application.status === candidateStatuses.ONBOARDING));

      setJobs(res[1].data.response.data.reverse().filter(application => application.data_type === currentUser.portfolio_info[0].data_type));
      
      const list = res[2].data.filter(j => currentUser.portfolio_info[0].data_type === j.data_type);
      const newList = list.reverse().find(p => p.company_id === currentUser.portfolio_info[0].org_id);
      // console.log(newList);
      setCurrentProjects(newList.project_list);

      const usersWithTasks = [...new Map(res[3].data.response.data.filter(j => currentUser.portfolio_info[0].data_type === j.data_type).map(task => [task.applicant, task])).values()];
      setAllTasks(usersWithTasks.reverse());

      setQuestions(res[4].data.response.data.filter(question => question.data_type === currentUser.portfolio_info[0].data_type));
      setLoading(false);
      
    })
    .catch(err => {
      console.log(err)
      setLoading(false);
    })
    
  }, [])

  useEffect(() => {
    
    if (jobSearchInput.length < 1) return setSearchActive(false);
    console.log("zebiiiiiiiiiiiiiiiiiiiiiiiii")
    setSearchActive(true);
    setMatchedJobs(jobs.filter(job => job.skills.toLocaleLowerCase().includes(jobSearchInput.toLocaleLowerCase()) || job.job_title.toLocaleLowerCase().includes(jobSearchInput.toLocaleLowerCase())));
    // setMatchedJobs(jobs.filter(job => fuzzySearch(jobSearchInput.toLowerCase(), job.skills.toLowerCase()) || fuzzySearch(jobSearchInput.toLowerCase(), job.job_title.toLowerCase())
    // ))

  }, [jobSearchInput])

  useEffect(() => {
        
    const foundCandidate = hiredCandidates.find(data => data.applicant === currentTeamMember);
    
    if (!foundCandidate) return;

    const candidateProject = foundCandidate.others[mutableNewApplicationStateNames.assigned_project];
    setCurrentCandidateProject(candidateProject);
    
  }, [currentTeamMember])

  useEffect(() => {

    setShowCurrentCandidateTask(false);
    const currentPath = location.pathname.split("/")[1];
    
    if (!currentPath) return setCurrentActiveItem("Received");
    if (currentPath === "guest-applications") return setCurrentActiveItem("Guests");
    if (currentPath === "shortlisted") return setCurrentActiveItem("Shortlisted");
    if (currentPath === "hr-training") return setCurrentActiveItem("Hr Training");
    if (currentPath === "" || currentPath === "home") return setCurrentActiveItem("Received");

  }, [location])

  useEffect(() => {

    if (!currentSortOption) return;

    const categories = {};
    const newArray = [];
    const tasksWithProjectAdded = allTasks.map(task => ( {...task, project: hiredCandidates.find(data => data.username === task.applicant) && hiredCandidates.find(data => data.username === task.applicant).project }));
    const getCategoryArray = (propertyName, date) => {

      tasksWithProjectAdded.forEach(task => {
        if (date) {

          if (categories.hasOwnProperty(new Date(task[`${propertyName}`]).toDateString())) return

          categories[`${new Date(task[propertyName]).toDateString()}`] = new Date(task[`${propertyName}`]).toDateString();
          return

        }

        if (!categories.hasOwnProperty(task[`${propertyName}`])){
          categories[`${task[propertyName]}`] = task[`${propertyName}`]
        }
      })

      let categoryObj = {};

      Object.keys(categories || {}).forEach(key => {

        if (key === "undefined") return;
        
        if (date) {
          const matchingTasks = tasksWithProjectAdded.filter(task => new Date(task[`${propertyName}`]).toDateString() === key);
          categoryObj.name = key;
          categoryObj.data = matchingTasks;
          newArray.push(categoryObj);
          categoryObj = {};    
          return
        }
        
        const matchingTasks = tasksWithProjectAdded.filter(task => task[`${propertyName}`] === key);
        categoryObj.name = key;
        categoryObj.data = matchingTasks;
        newArray.push(categoryObj);
        categoryObj = {};
      })

      return newArray;
    }

    switch (currentSortOption) {
      case "project":
        const projectCategoryData = getCategoryArray('project');
        setSortResults(projectCategoryData);
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

  const handleMenuItemClick = (item) => {
    if (item === "Guests") return navigate("/guest-applications");
    if (item === "Shortlisted") return navigate("/shortlisted");
    if (item === "Hr Training") return navigate("/hr-training");
    
    navigate("/");
  }

  const handleTaskItemClick = (data) => {
    // setCurrentTeamMember(data.user);
    // setShowCurrentCandidateTask(true);
    navigate(`/new-task-screen/?applicant=${data.applicant}`)
  }

  const handleAttendanceItemClick = (data) => {
    // setCurrentTeamMember(data.user);
    // setShowCurrentCandidateAttendance(true);
    navigate(`/new-task-screen/?applicant=${data.applicant}&attendance=true`)
  }

  const hideTaskAndAttendaceView = () => {
    setShowCurrentCandidateAttendance(false);
    setShowCurrentCandidateTask(false);
  }

  return (
    <StaffJobLandingLayout 
      hrView={true} 
      runExtraFunctionOnNavItemClick={hideTaskAndAttendaceView} 
      hideSideBar={showAddTaskModal} 
      searchValue={jobSearchInput} 
      setSearchValue={setJobSearchInput}
      showLoadingOverlay={trackingProgress}
      modelDurationInSec={5.69} 
      searchPlaceHolder={section === "home" ?"received" : section === "guest-applications" ? "guests" : section === "shortlisted" ? "shortlisted" : section === "hr-training" ? "hr-training" : "received"}
    >
    <div className="hr__Page__Container">
    <TitleNavigationBar 
      className={
        path === undefined ? "" : "view__Application__Navbar"
      } 
      title={
        path === undefined ? 
          section === "user" ? "Profile" 
          : 
          section === "tasks" ? "Tasks" 
          : 
          sub_section !== undefined && section === "hr-training" ? 
            sub_section ? sub_section : `${trainingCards.module}` 
          : section === "attendance" ? "Attendance" 
          : "Applications" : 
          "Application Details" 
      } 
      hideBackBtn={
        path === undefined && sub_section === undefined ? true : false
      } 
      handleBackBtnClick={() => navigate(-1)} 
    />
    { 
      section !== "user" && section !== "attendance" && section !== "tasks" && path === undefined && sub_section === undefined && 
      <TogglerNavMenuBar 
        menuItems={["Received", "Guests", "Shortlisted" , "Hr Training"]} 
        // menuItems={["Received", "Shortlisted" , "Hr Training"]} 
        currentActiveItem={currentActiveItem} 
        handleMenuItemClick={handleMenuItemClick} 
      /> 
    }
    {
      sub_section === undefined && section === "home" || section === undefined ? <>
        <div className='hr__wrapper'>

          {
            isLoading ? <LoadingSpinner /> :

            <div className='job__wrapper'>
              {
                searchActive ? matchedJobs.length === 0 ? <>No jobs found matching your query</> :
                
                React.Children.toArray(matchedJobs.map(job => {
                  return <>
                    <JobCard 
                      job={job}
                      subtitle={job.job_category}
                      buttonText={"View"}
                      viewJobApplicationDetails={true}
                      applicationsCount={appliedJobs.filter(application => application.job_number === job.job_number).length}
                      handleBtnClick={() => goToJobDetails(job, appliedJobs.filter(application => application.job_number === job.job_number))}
                    />
                  </>
                })) :

                React.Children.toArray(jobs.map(job => {
                  return <>
                    <JobCard 
                      job={job}
                      subtitle={job.job_category}
                      buttonText={"View"}
                      viewJobApplicationDetails={true}
                      applicationsCount={appliedJobs.filter(application => application.job_number === job.job_number).length}
                      handleBtnClick={() => goToJobDetails(job, appliedJobs.filter(application => application.job_number === job.job_number))}
                    />
                  </>
                }))
              }
            </div>

          }
          
        </div>
      </> :
      
      <>
        
        { 

          sub_section === undefined && section === "shortlisted" ? <>
            <ShortlistedScreen shortlistedCandidates={candidateData} jobData={jobs} />
          </> :

          isLoading ? <LoadingSpinner /> :

          sub_section === undefined && section === "hr-training" ? <>
            <HrTrainingScreen trainingCards={trainingCards} setShowOverlay={setTrackingProgress} setQuestions={setQuestions}/>
          </> :

          sub_section !== undefined && section === "hr-training" ? <>
            <HrTrainingQuestions />
          </> :

          sub_section === undefined && section === "guest-applications" ?

          <>
            {
              isLoading ? <LoadingSpinner /> :

              <div className='hr__wrapper'>

                <div className='job__wrapper'>
                  {
                    searchActive ? matchedJobs.length === 0 ? <>No jobs found matching your query</> :
                    
                    React.Children.toArray(matchedJobs.map(job => {
                      return <>
                        <JobCard 
                          job={job}
                          subtitle={job.job_category}
                          buttonText={"View"}
                          viewJobApplicationDetails={true}
                          applicationsCount={guestApplications.filter(application => application.job_number === job.job_number).length}
                          handleBtnClick={() => goToGuestJobDetails(job, guestApplications.filter(application => application.job_number === job.job_number))}
                        />
                      </>
                    })) :

                    React.Children.toArray(jobs.map(job => {
                      return <>
                        <JobCard 
                          job={job}
                          subtitle={job.job_category}
                          buttonText={"View"}
                          viewJobApplicationDetails={true}
                          applicationsCount={guestApplications.filter(application => application.job_number === job.job_number).length}
                          handleBtnClick={() => goToGuestJobDetails(job, guestApplications.filter(application => application.job_number === job.job_number))}
                        />
                      </>
                    }))
                  }
                </div>
                
              </div>
            }
          </>:

          sub_section === undefined && section === "attendance" ? 

          isLoading ? <LoadingSpinner /> :

          showCurrentCandidateAttendance ? <AttendanceScreen className="hr__Page" currentUser={currentTeamMember} assignedProject={currentCandidateProject} /> :
          
          <>

            <SelectedCandidates 
              showTasks={true} 
              sortActive={currentSortOption ? true : false}
              tasksCount={currentSortOption ? sortResults.length : allTasks.length}
              className={"hr__Page"}
              title={"Attendance"}
              hrAttendancePageActive={true}
              handleSortOptionClick={(data) => setCurrentSortOption(data)}
            />

            {
              currentSortOption ?

              <>
                {
                  sortResults.length === 0 ? <p className='sort__Title__Item'> No tasks found matching '{currentSortOption}' sort selection </p>  :
                  
                  <>
                    {
                      React.Children.toArray(sortResults.map(result => {
                        return <>
                          <p className='sort__Title__Item'><b>{result.name}</b></p>
                          <>
                            <div className="tasks-container hr__Page sort__Active">
                              {
                                React.Children.toArray(result.data.map(dataitem => {
                                  return <JobCard
                                    buttonText={"View"}
                                    candidateCardView={true}
                                    candidateData={dataitem}
                                    taskView={true}
                                    handleBtnClick={handleAttendanceItemClick}
                                  />
                                }))
                              }
                            </div>
                          </>
                        </>
                      }))
                    }
                    <div className='sort__Margin__Bottom'></div>
                  </>
                }
              </> :

              <>
                <div className="tasks-container hr__Page">
                  {
                    React.Children.toArray(allTasks.map(dataitem => {
                      return <JobCard
                        buttonText={"View"}
                        candidateCardView={true}
                        candidateData={dataitem}
                        taskView={true}
                        handleBtnClick={handleAttendanceItemClick}
                      />
                    }))
                  }
                </div>
              </>
            }
          </>
          :

          sub_section === undefined && section === "tasks" ? 

          isLoading ? <LoadingSpinner /> :

          <>
            {
              showAddTaskModal && <>
                <AddTaskScreen closeTaskScreen={() => setShowAddTaskModal(false)} teamMembers={hiredCandidates} updateTasks={setAllTasks} editPage={editTaskActive} setEditPage={setEditTaskActive} taskToEdit={currentTaskToEdit} hrPageActive={true} />
              </>
            }

            {
              showCurrentCandidateTask ? <TaskScreen className="hr__Page" currentUser={currentTeamMember} handleAddTaskBtnClick={() => setShowAddTaskModal(true)} handleEditBtnClick={handleEditTaskBtnClick} assignedProject={currentCandidateProject} /> :
          
              <>

                <SelectedCandidates 
                  showTasks={true} 
                  sortActive={currentSortOption ? true : false}
                  tasksCount={currentSortOption ? sortResults.length : allTasks.length}
                  className={"hr__Page"}
                  handleSortOptionClick={(data) => setCurrentSortOption(data)}
                />

                {
                  currentSortOption ?

                  <>
                    {
                      sortResults.length === 0 ? <p className='sort__Title__Item'> No tasks found matching '{currentSortOption}' sort selection </p>  :
                      
                      <>
                        {
                          React.Children.toArray(sortResults.map(result => {
                            return <>
                              <p className='sort__Title__Item'><b>{result.name}</b></p>
                              <>
                                <div className="tasks-container hr__Page sort__Active">
                                  {
                                    React.Children.toArray(result.data.map(dataitem => {
                                      return <JobCard
                                        buttonText={"View"}
                                        candidateCardView={true}
                                        candidateData={dataitem}
                                        taskView={true}
                                        handleBtnClick={handleTaskItemClick}
                                      />
                                    }))
                                  }
                                  
                                  {/* <Button text={"Add Task"} icon={<AddCircleOutlineIcon />} handleClick={() => setShowAddTaskModal(true)} /> */}
                                </div>
                              </>
                            </>
                          }))
                        }
                        <div className='sort__Margin__Bottom'></div>
                      </>
                    }
                  </> :

                  <>
                    <div className="tasks-container hr__Page">
                      {
                        React.Children.toArray(allTasks.map(dataitem => {
                          return <JobCard
                            buttonText={"View"}
                            candidateCardView={true}
                            candidateData={dataitem}
                            taskView={true}
                            handleBtnClick={handleTaskItemClick}
                          />
                        }))
                      }
                      {/* <Button text={"Add Task"} icon={<AddCircleOutlineIcon />} handleClick={() => setShowAddTaskModal(true)} /> */}
                    </div>
                  </>
                }
              </>
            }
          </>
          // id
          :

          sub_section === undefined && section === "user" ? <UserScreen currentUser={currentUser} /> :

          sub_section === undefined &&
          <><ErrorPage disableNav={true} /></>

        }
      
      </>
    }

    {
      path === undefined && sub_section === "job" ? 
      
      <>
      
        <div className='hr__wrapper'>
          <SelectedCandidates title={location.state.job.job_title} candidatesCount={location.state.appliedCandidates.length} hrPageActive={true} />

          {
            <div className='hr__Job__Tile__Container'>
              {
                React.Children.toArray(location.state.appliedCandidates.map(candidate => {
                  return <JobCard
                    buttonText={"View"}
                    candidateCardView={true}
                    candidateData={candidate}
                    handleBtnClick={goToJobApplicationDetails}
                    jobAppliedFor={jobs.find(job => job.job_number === candidate.job_number) ? jobs.find(job => job.job_number === candidate.job_number).job_title : ""}
                  />
                }))
              }
            </div>
          }
        </div>
        {/* id */}
      </> : 
      
      path !== undefined && sub_section === "job" ? <>
        {
          <div className='hr__Job__Tile__Container'>
            <>
              <SelectedCandidatesScreen
                hrPageActive={true}
                guestApplication={location.state.candidate.status === candidateStatuses.GUEST_PENDING_SELECTION ? true : false}
                selectedCandidateData={location.state.candidate}
                updateCandidateData={setCandidateData}
                updateAppliedData={section === "guest-applications" ? setGuestApplications : setAppliedJobs}
                jobTitle={jobs.find(job => job.job_number === location.state.candidate.job_number)?.job_title}
              />
            </>
          </div>
        }
      </> :

      path !== undefined && sub_section === "after_initial_meet" ? <>
        {
          <div className='hr__Job__Tile__Container'>
            <>
              <SelectedCandidatesScreen
                hrPageActive={true}
                initialMeet={true}
                selectedCandidateData={location.state.candidate}
                updateCandidateData={setCandidateData}
                availableProjects={currentProjects}
              />
            </>
          </div>
        }
      </> :

      <></>
    }

    </div>
    </StaffJobLandingLayout>
  )
}

export default HrJobScreen