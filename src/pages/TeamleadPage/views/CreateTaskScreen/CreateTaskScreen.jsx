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

const CreateTaskScreen = ({
  candidateAfterSelectionScreen,
  handleEditBtnClick,
  className,
  assignedProject,
  isGrouplead,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicant = searchParams.get("applicant");
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
  const [ updatedTasks, setUpdatedTasks ] = useState([]);
  const [ tasksBeingApproved, setTasksBeingApproved ] = useState([]);
  const [singleTaskLoading, setSingleTaskLoading] = useState(false);
  const [ tasksForTheDay, setTasksForTheDay ] = useState(null);

  useEffect(() => {
    if (userTasks.length > 0) return setLoading(false);
    getCandidateTaskForTeamLead(currentUser?.portfolio_info[0].org_id)
      .then((res) => {
        setLoading(false);
        setUserTasks(
          res.data.response.data
            .filter(
              (currenttask) =>
                currenttask.data_type ===
                currentUser?.portfolio_info[0].data_type
            )
            .filter(
              (task) =>
                task.project ===
                currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1].project
            )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectOption.length < 1) return;
    if (selectedProject !== "") return;
    setSelectedProject(selectOption[0]);
  }, [selectOption]);

  useEffect(() => {
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
    setSelectOption(Array.from(new Set(applicantTasks.map((d) => d.project))));
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

      setTasksDate(
        currentApplicantTasks.filter(
          (d) => new Date(d.task_created_date).toDateString() === new Date(selectedDate).toDateString()
        )
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
      copyOfUpdatedTasks.push({...task, approved: true, status: null});
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

    try {
      const res = (await getCandidateTasksV2(dataToPost)).data;

      console.log(res.task);
      if (res.task.length > 0) {
        setTasksForTheDay(res.task)
      }
      setSingleTaskLoading(false);
    } catch (error) {
      console.log(error);
      setSingleTaskLoading(false);
    }
  }

  return (
    <StaffJobLandingLayout teamleadView={true} isGrouplead={isGrouplead}>
      <>
        <TitleNavigationBar
          title="Tasks"
          className="task-bar"
          handleBackBtnClick={() => navigate(-1)}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div
            className={`candidate-task-screen-container ${
              className ? className : ""
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
              assignedProject={selectOption[0] ? selectOption[0] : ""}
            />
            <div className="all__Tasks__Container">
              <Calendar
                onChange={handleSelectDateChange}
                value={selectedDate}
                tileClassName={tileClassName}
              />
              <div className="task__Details__Item">
                <h3 className="month__Title">{tasksMonth}</h3>
                {tasksDate.length === 0 ? (
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
                          handleEditBtnClick={() => {}}
                          updateTasks={() =>
                            setTasksForSelectedProject(
                              userTasks.filter(
                                (d) => d.project === selectedProject
                              )
                            )
                          }
                          handleApproveTask={handleApproveTask}
                          taskIsBeingApproved={tasksBeingApproved.find(task => task._id === d._id)}
                          singleTaskLoading={singleTaskLoading}
                          tasksForTheDay={tasksForTheDay}
                        />
                      );
                    })
                  )
                )}
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
