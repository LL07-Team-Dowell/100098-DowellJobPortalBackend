import React, { useState, useEffect } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { testTasksToWorkWithForNow } from "../../../../utils/testData";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AssignedProjectDetails from "../../components/AssignedProjectDetails/AssignedProjectDetails";
import ApplicantIntro from "../../components/ApplicantIntro/ApplicantIntro";
import "./style.css";
import CandidateTaskItem from "../../components/CandidateTaskItem/CandidateTaskItem";
import { useSearchParams } from "react-router-dom";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import { differenceInCalendarDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCandidateTaskContext } from "../../../../contexts/CandidateTasksContext";
import { getCandidateTaskForTeamLead, getCandidateTasksV2 } from "../../../../services/teamleadServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Button from "../../../AdminPage/components/Button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { approveTask } from "../../../../services/teamleadServices";
import { toast } from "react-toastify";
import { is } from "date-fns/locale";
import { getCandidateTasksOfTheDayV2 } from "../../../../services/candidateServices";
import { extractNewTasksAndAddExtraDetail } from "../../util/extractNewTasks";
import { getAllCompanyUserSubProject } from "../../../../services/commonServices";
import { AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import SubprojectSelectWithSearch from "../../../../components/SubprojectSelectWithSearch/SubprojectSelectWithSearch";

const CreateTaskScreen = ({
  candidateAfterSelectionScreen,
  handleEditBtnClick,
  className,
  assignedProject,
  isGrouplead,
  isProjectLead,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicant = searchParams.get("applicant");
  const projectPassed = searchParams.get("project");
  const { userTasks, setUserTasks } = useCandidateTaskContext();
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentApplicantTasks, setCurrentApplicantTasks] = useState([]);
  const [tasksForSelectedProject, setTasksForSelectedProject] = useState([]);
  const [tasksDate, setTasksDate] = useState([]);
  const [tasksMonth, setTasksMonth] = useState(
    selectedDate.toLocaleString("en-us", { month: "long" })
  );
  const [datesToStyle, setDatesToStyle] = useState([]);
  const navigate = useNavigate();

  const [selectOption, setSelectOption] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useCurrentUserContext();
  const [tasksBeingApproved, setTasksBeingApproved] = useState([]);
  const [singleTaskLoading, setSingleTaskLoading] = useState(false);
  const [tasksForTheDay, setTasksForTheDay] = useState(null);
  const [singleTaskItem, setSingleTaskItem] = useState(null);
  const [ allTasks, setAllTasks ] = useState([]);
  const [ allSubProjects, setAllSubprojects ] = useState([]);
  const [ subprojectSelected, setSubprojectSelected ] = useState('');
  const [ showSubprojectSelection, setShowSubprojectSelection ] = useState(false);
  const [ batchApprovalLoading, setBatchApprovalLoading ] = useState(false);
  const [ showBatchApprovalModal, setShowBatchApprovalModal ] = useState(false);


  useEffect(() => {
    // if (userTasks.length > 0) return setLoading(false);
    setLoading(true);

    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "project": currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project,
    }

    Promise.all([
      getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id),
      getCandidateTasksV2(dataToPost),
      getAllCompanyUserSubProject(currentUser.portfolio_info[0].org_id, currentUser.portfolio_info[0].data_type),
    ])
      .then(async (res) => {
        const tasksToDisplay = res[0]?.data?.response?.data
        ?.filter(
          (task) =>
            task.data_type === currentUser?.portfolio_info[0]?.data_type
        )
        const previousTasksFormat = tasksToDisplay.filter(task => !task.user_id && task.task);
        const updatedTasksForMainProject = extractNewTasksAndAddExtraDetail(res[1]?.data?.task_details, res[1]?.data?.task, true);
        
        let updatedTasksForOtherProjects;

        const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects && 
        Array.isArray(
          currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
        )

        if (userHasOtherProjects) {
          updatedTasksForOtherProjects = await Promise.all(currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects.map(async(project) => {
            const dataToPost2 = {
              ...dataToPost,
              project: project
            }
  
            const res = (await getCandidateTasksV2(dataToPost2)).data;
  
            const extractedTasks = extractNewTasksAndAddExtraDetail(res?.task_details, res?.task, true);
            return extractedTasks;
          }))
        }

        const newTasksToDisplay = userHasOtherProjects ? 
          [...previousTasksFormat, ...updatedTasksForMainProject, ...updatedTasksForOtherProjects.flat()]
          :
        [...previousTasksFormat, ...updatedTasksForMainProject];
        setLoading(false);
        setAllTasks(newTasksToDisplay);
        const usersWithTasks = [
          ...new Map(
            newTasksToDisplay.map((task) => [task._id, task])
          ).values(),
        ];
        setUserTasks(
          usersWithTasks
          .sort((a, b) => new Date(b?.task_created_date) - new Date(a?.task_created_date))
        );
        setAllSubprojects(res[2]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectOption.length < 1) return;
    if (selectedProject !== "") return;
    setSelectedProject(projectPassed ? projectPassed : selectOption[0]);
  }, [selectOption]);

  useEffect(() => {
    setSingleTaskItem(null);
    setTasksForTheDay(null);
    setTasksForSelectedProject(
      currentApplicantTasks.filter(
        (d) => d.project === selectedProject && d.applicant === applicant
      )
    );
  }, [selectedProject, currentApplicantTasks, applicant]);

  //setting Task for Applicant
  useEffect(() => {
    const applicantTasks = userTasks.filter((d) => d.applicant === applicant);
    setCurrentApplicantTasks(applicantTasks);
    setSelectOption(
      currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects && 
      Array.isArray(
        currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
      ) ? 
      [
        currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project,
        ...currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
      ]
      :
      [
        currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project 
      ]
    );
  }, [userTasks, applicant]);

  useEffect(() => {
    // const newData = userTasks.filter((d) => d.project === selectedProject);
    // setTasksForSelectedProject(newData);
    const datesUserHasTask = [
      ...new Set(
        tasksForSelectedProject.map((task) => [
          new Date(task.task_created_date),
        ])
      ).values(),
    ].flat();
    console.log(datesUserHasTask);
    setDatesToStyle(datesUserHasTask);
  }, [tasksForSelectedProject]);

  useEffect(() => {
    setTasksMonth(selectedDate.toLocaleString("en-us", { month: "long" }));

    if (applicant) {
      const foundTasks = currentApplicantTasks.filter(
        (d) => new Date(d.task_created_date).toDateString() === new Date(selectedDate).toDateString()
      ).filter(d => d.project === selectedProject).map(d=> {
        const foundSingleTasks = allTasks.filter(task => task.task_id === d._id && task.single_task_created_date === d.task_created_date);
        d.tasksAdded = foundSingleTasks;
        return d;
      })
      setTasksDate(
        foundTasks
      );

      return
    }

    setTasksDate(
      tasksForSelectedProject.filter((d) => {
        const dateTime =
          d.task_created_date.split(" ")[0] +
          " " +
          d.task_created_date.split(" ")[1] +
          " " +
          d.task_created_date.split(" ")[2] +
          " " +
          d.task_created_date.split(" ")[3];
        const calendatTime =
          selectedDate.toString().split(" ")[0] +
          " " +
          selectedDate.toString().split(" ")[1] +
          " " +
          selectedDate.toString().split(" ")[2] +
          " " +
          selectedDate.toString().split(" ")[3];
        return dateTime === calendatTime;
      })
    );

  }, [selectedDate, tasksForSelectedProject, userTasks]);

  const isSameDay = (a, b) => differenceInCalendarDays(a, b) === 0;

  const tileClassName = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesToStyle.find((dDate) => isSameDay(dDate, date))) {
        return "task__Indicator";
      }
    }
  };

  const handleApproveTask = async (task) => {
    const copyOfTasksBeingApproved = tasksBeingApproved.slice();
    copyOfTasksBeingApproved.push(task);
    setTasksBeingApproved(copyOfTasksBeingApproved);

    try {
      const response = await approveTask({
        document_id: task.single_task_id,
        // task: task.task,
        lead_username: currentUser?.userinfo?.username,
      });

      const copyOfTasks = tasksForTheDay && Array.isArray(tasksForTheDay) ? 
        tasksForTheDay.slice() 
        : 
      null
      const foundIndexOfUpdatedTask = copyOfTasks?.findIndex(t => t.single_task_id === task.single_task_id);

      if (copyOfTasks && foundIndexOfUpdatedTask !== -1) {
        const taskAtIndex = copyOfTasks[foundIndexOfUpdatedTask];
        copyOfTasks[foundIndexOfUpdatedTask] = { ...taskAtIndex, approved: true };
        setTasksForTheDay(copyOfTasks);
      }

      const copyOfTasksDate = tasksDate.slice();
      const copyOfTasksDateObjIndex = copyOfTasksDate.findIndex(i => i.tasksAdded.find(t => t.single_task_id === task.single_task_id))
      if (copyOfTasksDateObjIndex !== -1) {
        const updatedTasksAddedForDate = copyOfTasksDate[copyOfTasksDateObjIndex]?.tasksAdded?.map(t => {
          if (t.single_task_id === task.single_task_id) {
            return {
              ...t,
              approved: true,
            }
          }
          return t
        });
        copyOfTasksDate[copyOfTasksDateObjIndex].tasksAdded = updatedTasksAddedForDate;
        setTasksDate(copyOfTasksDate);
      }
      

      const copyOfTasksBeingApproved = tasksBeingApproved.slice();
      copyOfTasksBeingApproved.filter(t => t.single_task_id !== task.single_task_id);
      setTasksBeingApproved(copyOfTasksBeingApproved);

      console.log(response.data);
      if (response.status === 200) {
        toast.success("Log approved");
      }
    } catch (err) {
      console.log(err.response);
      toast.error(
        err.response
          ? err.response.status === 500
            ? 'Log approval failed'
            : err.response.data.message
          : 'Log approval failed'
      );
      setTasksBeingApproved(copyOfTasksBeingApproved.filter(t => task.single_task_id !== t.single_task_id));

    }
  };

  const handleBatchApproveTasks = async (logs) => {
    const copyOfTasksBeingApproved = tasksBeingApproved.slice();
    setTasksBeingApproved([
      ...copyOfTasksBeingApproved, 
      ...logs.map(log => {
        return {
          single_task_id: log,
        }
      })
    ]);
    setBatchApprovalLoading(true);

    const logApprovalAPICalls = await Promise.all(logs.map(async (log) => {
      try {
        await approveTask({
          document_id: log,
          lead_username: currentUser?.userinfo?.username,
        });
  
        const copyOfTasks = tasksForTheDay && Array.isArray(tasksForTheDay) ? 
          tasksForTheDay.slice() 
          : 
        null
        const foundIndexOfUpdatedTask = copyOfTasks?.findIndex(t => t.single_task_id === log);
  
        if (copyOfTasks && foundIndexOfUpdatedTask !== -1) {
          const taskAtIndex = copyOfTasks[foundIndexOfUpdatedTask];
          copyOfTasks[foundIndexOfUpdatedTask] = { ...taskAtIndex, approved: true };
          setTasksForTheDay(copyOfTasks);
        }
  
        const copyOfTasksDate = tasksDate.slice();
        const copyOfTasksDateObjIndex = copyOfTasksDate.findIndex(i => i.tasksAdded.find(t => t.single_task_id === log))
        if (copyOfTasksDateObjIndex !== -1) {
          const updatedTasksAddedForDate = copyOfTasksDate[copyOfTasksDateObjIndex]?.tasksAdded?.map(t => {
            if (t.single_task_id === log) {
              return {
                ...t,
                approved: true,
              }
            }
            return t
          });
          copyOfTasksDate[copyOfTasksDateObjIndex].tasksAdded = updatedTasksAddedForDate;
          setTasksDate(copyOfTasksDate);
        }
        
  
        const copyOfTasksBeingApproved = tasksBeingApproved.slice();
        copyOfTasksBeingApproved.filter(t => t.single_task_id !== log);
        setTasksBeingApproved(copyOfTasksBeingApproved);
  
        return true
      } catch (err) {
        console.log(err.response);
        setTasksBeingApproved(copyOfTasksBeingApproved.filter(t => log !== t.single_task_id));
  
        return false
      }
    }))

    const tasksSuccessfullyApproved = logApprovalAPICalls.filter(item => item === true).length

    setShowBatchApprovalModal(false);
    setBatchApprovalLoading(false);

    toast.success(`Successfully approved ${tasksSuccessfullyApproved} work logs`);
  }

  const handleSelectDateChange = async (date) => {
    setSelectedDate(date);

    const dateSelected = new Date(date);
    const [ year, month, day ] = [ dateSelected.getFullYear(), dateSelected.getMonth() + 1, dateSelected.getDate() ];
    const dateFormattedForAPI = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "project": projectPassed,
    }

    setSingleTaskLoading(true);

    try {
      const res = (await getCandidateTasksV2(dataToPost)).data;
      const foundApplicantTaskItem = res.task_details.find(task => task.applicant === applicant && task.task_created_date === dateFormattedForAPI);
      const tasksFetched = extractNewTasksAndAddExtraDetail(res.task_details, res.task, true);

      if (foundApplicantTaskItem) {
        setSingleTaskItem(foundApplicantTaskItem);
        const foundApplicantTasks = tasksFetched.filter(task => task._id === foundApplicantTaskItem._id);
        setTasksForTheDay(foundApplicantTasks)
      }
      setSingleTaskLoading(false);
    } catch (error) {
      console.log(error);
      setSingleTaskLoading(false);
    }
  }

  return (
    <StaffJobLandingLayout 
      teamleadView={isProjectLead ? false : true} 
      isGrouplead={isProjectLead ? false : isGrouplead} 
      hideSearchBar={true}
      projectLeadView={isProjectLead}
    >
      <>
        <TitleNavigationBar
          title={`Work logs for ${applicant}`}
          className="task-bar teamleadView"
          handleBackBtnClick={() => navigate(-1)}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div
            className={`candidate-task-screen-container ${className ? className : ""
              }`}
          >
            {/* {!candidateAfterSelectionScreen && (
              <>
                <ApplicantIntro showTask={true} />
              </>
            )} */}
            <AssignedProjectDetails
              showTask={true}
              availableProjects={selectOption}
              removeDropDownIcon={false}
              handleSelectionClick={(selection) =>
                setSelectedProject(selection)
              }
              assignedProject={selectedProject}
            />

            <div className="subproject__Div__Wrapper">
              <div className="subproject__Div">
                <span style={{ fontFamily: 'Poppins', fontSize: '0.9rem' }}>Subproject</span>
                <div className="subproject__Custom__Select">
                  <div 
                    className="select_" 
                    onClick={ 
                      subprojectSelected.length < 1  ? 
                        () => setShowSubprojectSelection(!showSubprojectSelection)
                      :
                        () => {}
                    }
                  >
                    <span>{subprojectSelected.length < 1 ? 'Select subproject' : subprojectSelected}</span>
                    {
                      (showSubprojectSelection || subprojectSelected.length > 0) ? <AiOutlineClose
                        onClick={() => {
                          setSubprojectSelected('');
                          setShowSubprojectSelection(true);
                        }}
                      /> 
                      : 
                      <AiOutlineDown />
                    }
                  </div>
                  
                  { 
                    showSubprojectSelection &&
                    <SubprojectSelectWithSearch
                      className={'task__Select__Subproject'} 
                      searchWrapperClassName={'task__Search__Sub'}
                      subprojects={allSubProjects.filter(item => item.parent_project === selectedProject)}
                      selectedSubProject={subprojectSelected}
                      handleSelectItem={(subproject, project) => {
                        setSubprojectSelected(subproject);
                        setShowSubprojectSelection(false);
                      }}
                      hideSelectionsMade={true}
                    />
                  }
                </div>
              </div>
            </div>

            <div className="all__Tasks__Container">
              <Calendar
                onChange={handleSelectDateChange}
                value={selectedDate}
                tileClassName={tileClassName}
              />
              <div className="task__Details__Item">
                <h3 className="month__Title">{tasksMonth}</h3>
                {
                  singleTaskLoading ?
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: 'max-content',
                      }}
                    >
                      <LoadingSpinner
                        width={'16px'}
                        height={'16px'}
                      />
                      <p className="task__Title" style={{ margin: 0 }}>Loading work logs...</p>
                    </div>
                    :
                    tasksDate.length === 0 ? (
                      singleTaskItem ? <>
                        {
                          !singleTaskItem || !(tasksForTheDay && Array.isArray(tasksForTheDay)) ?
                          <>
                            <p className="empty__task__Content">
                              No work log found for today
                            </p>
                          </>
                          :
                          <CandidateTaskItem
                            currentTask={singleTaskItem}
                            candidatePage={candidateAfterSelectionScreen}
                            handleEditBtnClick={() => { }}
                            updateTasks={setTasksForTheDay}
                            handleApproveTask={handleApproveTask}
                            tasksBeingApproved={tasksBeingApproved}
                            newTaskItem={true}
                            tasks={
                              tasksForTheDay && Array.isArray(tasksForTheDay) ?
                                subprojectSelected.length < 1 ?
                                  tasksForTheDay :
                                  tasksForTheDay.filter(task => task.subproject === subprojectSelected)
                              : 
                              []
                            }
                            subproject={subprojectSelected}
                            batchApprovalLoading={batchApprovalLoading}
                            handleBatchApproveTasks={handleBatchApproveTasks}
                            showBatchApprovalModal={showBatchApprovalModal}
                            setShowBatchApprovalModal={setShowBatchApprovalModal}
                          />
                        }
                        
                      </>
                        :
                        <p className="empty__task__Content">
                          No work log found for today
                        </p>
                    ) : (
                      React.Children.toArray(
                        tasksDate.map((d, i) => {
                          return (
                            <CandidateTaskItem
                              currentTask={d}
                              taskNum={i + 1}
                              candidatePage={candidateAfterSelectionScreen}
                              handleEditBtnClick={() => { }}
                              updateTasks={setTasksDate}
                              handleApproveTask={handleApproveTask}
                              tasksBeingApproved={tasksBeingApproved}
                              newTaskItem={d.user_id ? true : false}
                              tasks={
                                d.tasksAdded ? 
                                  subprojectSelected.length < 1 ?
                                    d.tasksAdded 
                                  :
                                    d.tasksAdded.filter(task => task.subproject === subprojectSelected)
                                : 
                                []
                              }
                              subproject={subprojectSelected}
                              batchApprovalLoading={batchApprovalLoading}
                              handleBatchApproveTasks={handleBatchApproveTasks}
                              showBatchApprovalModal={showBatchApprovalModal}
                              setShowBatchApprovalModal={setShowBatchApprovalModal}
                            />
                          );
                        })
                      )
                    )
                }
              </div>
            </div>
            {/* <Button
              text={"Approve Task"}
              icon={<AddCircleOutlineIcon />}
              handleClick={handleApproveTask}
            /> */}
          </div>
        )}
      </>
    </StaffJobLandingLayout>
  );
};

export default CreateTaskScreen;
