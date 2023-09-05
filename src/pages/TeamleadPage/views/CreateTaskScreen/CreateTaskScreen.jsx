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

const CreateTaskScreen = ({
  candidateAfterSelectionScreen,
  handleEditBtnClick,
  className,
  assignedProject,
  isGrouplead,
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
  const [isApproved, setIsApproved] = useState(false);
  const [updatedTasks, setUpdatedTasks] = useState([]);
  const [tasksBeingApproved, setTasksBeingApproved] = useState([]);
  const [singleTaskLoading, setSingleTaskLoading] = useState(false);
  const [tasksForTheDay, setTasksForTheDay] = useState(null);
  const [singleTaskItem, setSingleTaskItem] = useState(null);
  const [ allTasks, setAllTasks ] = useState([]);

  useEffect(() => {
    if (userTasks.length > 0) return setLoading(false);
    
    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "project": currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project,
    }

    Promise.all([
      getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id),
      getCandidateTasksV2(dataToPost),
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
        document_id: task._id,
        task: task.task,
      });

      const copyOfUpdatedTasks = updatedTasks.slice();
      copyOfUpdatedTasks.push({ ...task, approved: true, status: null });
      setUpdatedTasks(copyOfUpdatedTasks);

      const copyOfTasksBeingApproved = tasksBeingApproved.slice();
      copyOfTasksBeingApproved.filter(t => t._id !== task._id);
      setTasksBeingApproved(copyOfTasksBeingApproved);

      console.log(response.data);
      if (response.status === 200) {
        toast.success("Task approved");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response
          ? err.response.status === 500
            ? 'Task approval failed'
            : err.response.data
          : 'Task approval failed'
      );
      setTasksBeingApproved(copyOfTasksBeingApproved.filter(t => task._id !== t._id));

    }
  };

  const handleSelectDateChange = async (date) => {
    setSelectedDate(date);

    const currentDate = new Date(new Date(date).setHours(date.getHours() + 1)).toISOString().split('T')[0]
    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "task_created_date": currentDate,
    }

    setSingleTaskLoading(true);

    try {
      const res = (await getCandidateTasksV2(dataToPost)).data;
      const foundApplicantTaskItem = res.task_details.find(task => task.applicant === applicant && task.task_created_date === currentDate);

      if (foundApplicantTaskItem) {
        setSingleTaskItem(foundApplicantTaskItem);
        const foundApplicantTasks = res.task.filter(task => task.task_id === foundApplicantTaskItem._id);
        setTasksForTheDay(foundApplicantTasks)
      }
      setSingleTaskLoading(false);
    } catch (error) {
      console.log(error);
      setSingleTaskLoading(false);
    }
  }

  return (
    <StaffJobLandingLayout teamleadView={true} isGrouplead={isGrouplead} hideSearchBar={true}>
      <>
        <TitleNavigationBar
          title={`Tasks for ${applicant}`}
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
                      <p className="task__Title" style={{ margin: 0 }}>Loading tasks...</p>
                    </div>
                    :
                    tasksDate.length === 0 ? (
                      singleTaskItem ? <>
                        <CandidateTaskItem
                          currentTask={singleTaskItem}
                          candidatePage={candidateAfterSelectionScreen}
                          handleEditBtnClick={() => { }}
                          updateTasks={() =>
                            setTasksForSelectedProject(
                              userTasks.filter(
                                (d) => d.project === selectedProject
                              )
                            )
                          }
                          handleApproveTask={handleApproveTask}
                          taskIsBeingApproved={tasksBeingApproved.find(task => task._id === singleTaskItem._id)}
                          newTaskItem={true}
                          tasks={tasksForTheDay && Array.isArray(tasksForTheDay) ? tasksForTheDay : []}
                        />
                      </>
                        :
                        <p className="empty__task__Content">
                          No task found for today
                        </p>
                    ) : (
                      React.Children.toArray(
                        tasksDate.map((d, i) => {
                          return (
                            <CandidateTaskItem
                              currentTask={updatedTasks.find(task => task._id === d._id) ? updatedTasks.find(task => task._id === d._id) : d}
                              taskNum={i + 1}
                              candidatePage={candidateAfterSelectionScreen}
                              handleEditBtnClick={() => { }}
                              updateTasks={() =>
                                setTasksForSelectedProject(
                                  userTasks.filter(
                                    (d) => d.project === selectedProject
                                  )
                                )
                              }
                              handleApproveTask={handleApproveTask}
                              taskIsBeingApproved={tasksBeingApproved.find(task => task._id === d._id)}
                              newTaskItem={d.user_id ? true : false}
                              tasks={d.tasksAdded ? d.tasksAdded : []}
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
