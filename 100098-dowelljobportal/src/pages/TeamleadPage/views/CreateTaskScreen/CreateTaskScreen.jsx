import { useState, useEffect } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { testTasksToWorkWithForNow } from "../../../../utils/testData";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CreateTaskScreen = () => {
  const [data, setdata] = useState(testTasksToWorkWithForNow);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForSelectedProject, setTasksForSelectedProject] = useState([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const [tasksForSelectedMonth, setTasksForSelectedMonth] = useState(
    selectedDate.toLocaleString("en-us", { month: "long" })
  );
  const [newTask, setNewTask] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setTasksForSelectedProject(
      data.filter((d) => d.project === selectedProject)
    );
  }, [data, selectedProject]);

  useEffect(() => {
    const dateTime =
      selectedDate.toLocaleString("en-us", { month: "long" }) +
      " " +
      selectedDate.getDate() +
      ", " +
      selectedDate.getFullYear();
    setTasksForSelectedDate(
      data.filter((d) => d.task_created_date === dateTime)
    );
  }, [data, selectedDate]);

  //   const handleAddTaskBtnClick = () => {
  //     setdata([
  //       ...data,
  //       {
  //         task: newTask,
  //         task_created_date: new Date(),
  //         project: selectedProject,
  //       },
  //     ]);
  //     setNewTask("");
  //   };

  const handleAddTask = () => {
    const newTaskData = {
      task: newTask,
      task_created_date: new Date().toISOString(),
      project: selectedProject,
    };
    setdata([...data, newTaskData]);
    setNewTask("");
    setShowPopup(false);
  };

  const handleCancel = () => {
    setNewTask("");
    setShowPopup(false);
  };

  const onClickDate = (date) => {
    setSelectedDate(date);
    setTasksForSelectedMonth(date.toLocaleString("en-us", { month: "long" }));
    setTasksForSelectedDate([]);
  };

  return (
    <>
      <StaffJobLandingLayout teamleadView={true}>
        <div>
          <h1>Task details</h1>
          <ul>
            {tasksForSelectedProject.map((d, i) => (
              <li key={i}>{d.task}</li>
            ))}
          </ul>
        </div>
        <div>
          <h1>Teamlead Project</h1>
          <select onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {data.map((d, i) => (
              <option value={d.project} key={i}>
                {d.project}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h1>Task By Date</h1>
          <Calendar value={selectedDate} onChange={onClickDate} />
          <ul>
            <h1>{tasksForSelectedMonth}</h1>
            {tasksForSelectedDate.length > 0
              ? tasksForSelectedDate.map((d, i) => <li key={i}>{d.task}</li>)
              : `No tasks for ${tasksForSelectedMonth}`}
          </ul>
        </div>
        {/*<div>
          <h1>Add Task</h1>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTaskBtnClick}>Add Task</button>
            </div> */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <div>Create New Task</div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={handleAddTask}>Add Task</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
        <div>
          Add Task
          <button onClick={() => setShowPopup(true)}>Add Task</button>
        </div>
      </StaffJobLandingLayout>
    </>
  );
};

export default CreateTaskScreen;
