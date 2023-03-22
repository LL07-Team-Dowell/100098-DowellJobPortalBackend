import { useState, useEffect } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { testTasksToWorkWithForNow } from "../../../../utils/testData";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { differenceInCalendarDays } from "date-fns";

const CreateTaskScreen = () => {
  const [data, setdata] = useState(testTasksToWorkWithForNow);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForSelectedProject, setTasksForSelectedProject] = useState([]); //settask 2
  const [tasksDate, setTasksDate] = useState([]); // settask 1
  const [tasksMonth, setTasksMonth] = useState(
    selectedDate.toLocaleString("en-us", { month: "long" })
  );
  //   const [newTask, setNewTask] = useState("");
  //   const [showPopup, setShowPopup] = useState(false);

  //check if applicant is already in the database and setTaskDate to that applicant

  useEffect(() => {
    setTasksForSelectedProject(
      data.filter((d) => d.project === selectedProject)
    );
  }, [selectedProject]);

  useEffect(() => {
    setTasksDate(
      data.filter((d) => {
        const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
        const calendatTime = selectedDate.toString().split(" ")[0] + " " + selectedDate.toString().split(" ")[1] + " " + selectedDate.toString().split(" ")[2] + " " +selectedDate.toString().split(" ")[3]
        return dateTime === calendatTime;
      })
    );

    setTasksMonth(selectedDate.toLocaleString("en-us", { month: "long" }));
  }, [selectedDate]);

  return (
    <StaffJobLandingLayout teamleadView={true}>
      <div>
        <h1>Task details</h1>
        <select onChange={(e) => setSelectedProject(e.target.value)}>
          {data.map((d, i) => (
            <option value={d.project} key={i}>
              {d.project}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
        <div>
          <h1>{tasksMonth}</h1>
          {tasksDate.length > 0
            ? tasksDate.map((d, i) => <li key={i}>{d.task}</li>)
            : "No Tasks Found For Today"}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default CreateTaskScreen;
