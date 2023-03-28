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

const CreateTaskScreen = ({
  candidateAfterSelectionScreen,
  handleEditBtnClick,
  className,
  assignedProject,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicant = searchParams.get("applicant");
  const [data, setdata] = useState(testTasksToWorkWithForNow);
  console.log(data);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForSelectedProject, setTasksForSelectedProject] = useState([]);
  const [tasksDate, setTasksDate] = useState([]);
  const [tasksMonth, setTasksMonth] = useState(
    selectedDate.toLocaleString("en-us", { month: "long" })
  );
  const [datesToStyle, setDatesToStyle] = useState([]);
  const [noApplicant, setNoApplicant] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTasksForSelectedProject(
      data.filter(
        (d) => d.project === selectedProject && d.applicant === applicant
      )
    );
  }, [selectedProject]);

  useEffect(() => {
    setdata(testTasksToWorkWithForNow.filter((d) => d.applicant === applicant));
  }, [applicant]);

  useEffect(() => {
    const newData = data.filter((d) => d.project === selectedProject);
    setTasksForSelectedProject(newData);
    const datesUserHasTask = [
      ...new Set(
        data.map((task) => [new Date(task.task_created_date)])
      ).values(),
    ].flat();
    console.log(datesUserHasTask);
    setDatesToStyle(datesUserHasTask);
  }, [data]);

  useEffect(() => {
    setTasksDate(
      data.filter((d) => {
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

    setTasksMonth(selectedDate.toLocaleString("en-us", { month: "long" }));
  }, [selectedDate]);

  const selectOption = Array.from(new Set(data.map((d) => d.project)));
  useEffect(() => {
    if (data.length < 1) {
      setNoApplicant(true);
    } else {
      setNoApplicant(false);
    }
  }, [data]);

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

  return (
    <StaffJobLandingLayout teamleadView={true}>
      {noApplicant ? (
        <>No Applicant</>
      ) : (
        <>
          <TitleNavigationBar
            title="Tasks"
            className="task-bar"
            handleBackBtnClick={() => navigate(-1)}
          />
          <div
            className={`candidate-task-screen-container ${
              className ? className : ""
            }`}
          >
            {!candidateAfterSelectionScreen && (
              <>
                <ApplicantIntro showTask={true} />
              </>
            )}
            <AssignedProjectDetails
              showTask={true}
              availableProjects={selectOption}
              removeDropDownIcon={false}
              handleSelectionClick={(e) => setSelectedProject(e.target.value)}
              assignedProject={selectOption[0] ? selectOption[0] : ""}
            />
            <div className="all__Tasks__Container">
              <Calendar
                onChange={setSelectedDate}
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
                          currentTask={d}
                          taskNum={i + 1}
                          candidatePage={candidateAfterSelectionScreen}
                          handleEditBtnClick={() => handleEditBtnClick(d)}
                          updateTasks={() =>
                            setTasksForSelectedProject(
                              data.filter((d) => d.project === selectedProject)
                            )
                          }
                        />
                      );
                    })
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </StaffJobLandingLayout>
  );
};

export default CreateTaskScreen;

{
  /* <div className="add-task-btn" onClick={handleAddTaskBtnClick}>
          <span>Add</span>
          <AddCircleOutlineIcon />
              </div> 
            
            new-task-screen/?applicant={applicant_name}
            */
}
