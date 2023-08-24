import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import useClickOutside from "../../../../hooks/useClickOutside";
import { IoIosArrowBack } from "react-icons/io";

import "./style.css";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createCandidateTask } from "../../../../services/candidateServices";
import { toast } from "react-toastify";

const AddTaskScreen = ({
  teamMembers,
  closeTaskScreen,
  updateTasks,
  afterSelectionScreen,
  editPage,
  setEditPage,
  taskToEdit,
  hrPageActive,
  assignedProject,
}) => {
  const ref = useRef(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({
    username: "",
    title: "",
    description: "",
    status: "Incomplete",
  });
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();
  const [time, settime] = useState(new Date().toString());
  const TimeValue = `${time.split(" ")[0]} ${time.split(" ")[1]} ${
    time.split(" ")[2]
  } ${time.split(" ")[3]}`;
  const [optionValue, setoptionValue] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [details, setDetails] = useState("");
  const [tasks, setTasks] = useState([]);
  console.log({ tasks });
  const [taskId, setTaskId] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(true);
  //   var conditions
  const inputsAreFilled = taskStartTime && taskEndTime && taskName && details;
  const duration = getDifferenceInMinutes(
    new Date(`${new Date().toDateString()} ${taskStartTime}`),
    new Date(`${new Date().toDateString()} ${taskEndTime}`)
  );
  //   lest important functions
  const clearAllInputs = () => {
    setTaskStartTime("");
    setTaskEndTime("");
    setTaskName("");
    setDetails("");
  };
  const fillAllInputs = (taskStartTime, taskEndTime, taskName, details) => {
    setTaskStartTime(taskStartTime);
    setTaskEndTime(taskEndTime);
    setTaskName(taskName);
    setDetails(details);
  };

  const addTaskCondition = () => {
    setIsCreatingTask(true);
  };

  const editTaskCondition = () => {
    setIsCreatingTask(false);
  };

  const getInputsForEditing = (id) => {
    editTaskCondition();
    const { start_time, end_time, taskName, details } = tasks.find(
      (task) => task.id == id
    );
    fillAllInputs(start_time, end_time, taskName, details);
  };
  const addSingleTask = (start_time, end_time, taskName, details) => {
    setTasks([
      ...tasks,
      { id: new Date().getTime(), start_time, end_time, taskName, details },
    ]);
    console.log([
      ...tasks,
      { id: new Date().getTime(), start_time, end_time, taskName, details },
    ]);
  };

  const updateSingleTask = (start_time, end_time, taskName, details) => {
    console.log({ taskId });
    setTasks(
      tasks.map((task) => {
        if (task.id == taskId) {
          console.log(true);
          return { ...task, start_time, end_time, taskName, details };
        }
        return task;
      })
    );
  };
  const getTaskId = (id) => {
    setTaskId(id);
    editTaskCondition();
    getInputsForEditing(id);
  };

  //   importand fuction
  const addNewTask = () => {
    if (inputsAreFilled) {
      if (duration < 15) {
        addSingleTask(taskStartTime, taskEndTime, taskName, details);

        clearAllInputs();
        setTaskId("");
      } else {
        toast.info(
          "The time you finished your task must be within 15 minutes of its starting time"
        );
        console.log({ taskStartTime, taskEndTime, duration });
      }
    } else {
      toast.error("Not all inputs should be filled");
    }
  };

  const updateTask = () => {
    if (inputsAreFilled) {
      if (duration < 15) {
        updateSingleTask(taskStartTime, taskEndTime, taskName, details);
        clearAllInputs();
        addTaskCondition();
        setTaskId("");
      } else {
        toast.info(
          "The time you finished your task must be within 15 minutes of its starting time"
        );
        console.log({ taskStartTime, taskEndTime, duration });
      }
    } else {
      toast.error("Not all inputs should be filled");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Define the missing variables and functions here

  const selctChange = (e) => {
    setoptionValue(e.target.value);
  };
  function convertDateFormat(date) {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    console.log(formattedDate);
    return formattedDate;
  }

  function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  }

  const formattedDate = convertDateFormat(time);
  console.log(formattedDate);

  // console.log(time);
  // useClickOutside(ref, () => { closeTaskScreen(); !afterSelectionScreen && setEditPage(false) });

  // useEffect (() => {

  //     if (newTaskDetails.username.length < 1) return setShowTaskForm(false);

  //     if ((newTaskDetails.title.length < 1) || (newTaskDetails.description.length < 1)) return setDisabled(true)

  //     setDisabled(false)

  // }, [newTaskDetails])
  useEffect(() => {
    if (newTaskDetails.description.length < 1 || optionValue.length < 1)
      return setDisabled(true);
    if (taskStartTime.length < 1 || taskEndTime.length < 1)
      return setDisabled(true);

    setDisabled(false);
  }, [newTaskDetails.description, optionValue, taskStartTime, taskEndTime]);

  const CreateNewTaskFunction = () => {
    const [endTimeInDateFormat, startTimeInDateFormat, today] = [
      new Date(`${new Date().toDateString()} ${taskEndTime}`),
      new Date(`${new Date().toDateString()} ${taskStartTime}`),
      new Date(),
    ];
    // if (startTimeInDateFormat.getTime() < today.getTime()) return toast.info('The time you are starting this task has to be later than the current time for today');
    if (endTimeInDateFormat.getTime() < startTimeInDateFormat.getTime())
      return toast.info(
        "The time you finished your task has to be later than the time you started it"
      );

    const minutesDiffInStartAndEndTime = getDifferenceInMinutes(
      endTimeInDateFormat,
      startTimeInDateFormat
    );
    if (minutesDiffInStartAndEndTime > 15)
      return toast.info(
        "The time you finished your task must be within 15 minutes of its starting time"
      );

    setDisabled(true);
    setLoading(true);

    const dataToPost = {
      project: optionValue,
      applicant: currentUser.userinfo.username,
      task: newTaskDetails.description,
      task_added_by: currentUser.userinfo.username,
      data_type: currentUser.portfolio_info[0].data_type,
      company_id: currentUser.portfolio_info[0].org_id,
      task_created_date: formattedDate,
      task_type: "Custom",
      start_time: convertDateFormat(startTimeInDateFormat),
      end_time: convertDateFormat(endTimeInDateFormat),
    };
    createCandidateTask(dataToPost)
      .then((resp) => {
        console.log(resp);
        updateTasks((prevTasks) => {
          return [
            ...prevTasks,
            { ...dataToPost, status: newTaskDetails.status },
          ];
        });
        setNewTaskDetails({ ...newTaskDetails, description: "" });
        setoptionValue("");
        toast.success("New task successfully added");
        setDisabled(false);
        setLoading(false);
        closeTaskScreen();
      })
      .catch((err) => {
        console.log(err);
        setDisabled(false);
        setLoading(false);
        toast.error("An error occurred while trying to add your task");
      });
  };
  useEffect(() => {
    if (afterSelectionScreen) {
      setNewTaskDetails((prevValue) => {
        return { ...prevValue, username: currentUser.userinfo.username };
      });
      setShowTaskForm(true);
    }
  }, [afterSelectionScreen]);

  useEffect(() => {
    if (editPage) {
      setNewTaskDetails({
        username: taskToEdit.user,
        title: taskToEdit.title,
        description: taskToEdit.description,
      });
      setShowTaskForm(true);
    }
  }, [editPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTaskDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleMemberItemClick = (member) => {
    setNewTaskDetails((prevValue) => {
      return { ...prevValue, username: member };
    });
    setShowTaskForm(true);
  };

  const handleNewTaskBtnClick = async () => {
    // setDisabled(true);
    // const dataToSend = { ...newTaskDetails };
    // dataToSend.user = newTaskDetails.username;
    // delete dataToSend["username"];
    // try{
    //     const response = await addNewTask(dataToSend);
    //     if (!afterSelectionScreen) updateTasks(prevTasks => { return [ ...prevTasks.filter(task => task.user !== dataToSend.user) ] });
    //     updateTasks(prevTasks => { return [ response.data, ...prevTasks ] } );
    //     closeTaskScreen();
    //     (afterSelectionScreen || hrPageActive) ? navigate("/tasks") : navigate("/task");
    // } catch (err) {
    //     console.log(err);
    //     setDisabled(false);
    // }
  };

  const handleUpdateTaskBtnClick = async () => {
    // setDisabled(true);
    // const dataToSend = { ...newTaskDetails };
    // dataToSend.user = newTaskDetails.username;
    // delete dataToSend["username"];
    // try{
    //     await updateSingleTask(taskToEdit.id + "/", dataToSend)
    //     taskToEdit.title = dataToSend.title;
    //     taskToEdit.description = dataToSend.description;
    //     updateTasks(prevTasks => prevTasks.map(task => {
    //         if (task.id === taskToEdit.id) {
    //             return { ...task, title: dataToSend.title, description: dataToSend.description }
    //         }
    //         return task;
    //     }) );
    //     closeTaskScreen();
    //     navigate("/task");
    // } catch (err) {
    //     console.log(err);
    //     setDisabled(false);
    // }
  };

  return (
    <>
      <div className="add__New__Task__Overlay">
        <div className="add__New__Task__Container" ref={ref}>
          <h1 className="title__Item">
            {showTaskForm ? (
              <>
                {!afterSelectionScreen && (
                  <IoIosArrowBack
                    onClick={
                      editPage
                        ? () => {
                            closeTaskScreen();
                            setEditPage(false);
                          }
                        : () => setShowTaskForm(false)
                    }
                    style={{ cursor: "pointer" }}
                  />
                )}
                {editPage ? "Edit Task" : "New Task Details"}
              </>
            ) : (
              <>Add new task</>
            )}

            <AiOutlineClose
              onClick={() => {
                closeTaskScreen();
                !afterSelectionScreen && setEditPage(false);
              }}
              style={{ cursor: "pointer" }}
              fontSize={"1.2rem"}
            />
          </h1>
          {showTaskForm ? (
            <>
              <span className="selectProject">Username</span>
              <input
                type={"text"}
                placeholder={"Task Assignee"}
                value={newTaskDetails.username}
                style={{ margin: 0, marginBottom: "0.8rem" }}
                readOnly={true}
              />
              <span className="selectProject">Date of Submission</span>
              <input
                type={"text"}
                placeholder={"today time"}
                value={TimeValue}
                style={{ margin: 0, marginBottom: "0.8rem" }}
                readOnly={true}
              />
              <span className="selectProject">Select Project</span>
              <br />
              <select
                onChange={(e) => selctChange(e)}
                className="addTaskDropDown"
                style={{ margin: 0, marginBottom: "0.8rem" }}
              >
                <option value={""}>Select</option>
                {assignedProject.map((v, i) => (
                  <option key={i} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {tasks.length > 0 ? (
                <table id="customers">
                  <tr>
                    <th>Time started</th>
                    <th>Time finished</th>
                    <th>task</th>
                    <th>details</th>
                  </tr>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.start_time}</td>
                        <td>{task.end_time}</td>
                        <td>{task.taskName}</td>
                        <td>{task.details}</td>
                        <button onClick={() => getTaskId(task.id)}>edit</button>
                        <button onClick={() => deleteTask(task.id)}>
                          delete
                        </button>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              <div className="task__Timing__Wrapper">
                <div>
                  <span className="selectProject">Time started task</span>
                  <input
                    type={"time"}
                    placeholder={"start time of task"}
                    value={taskStartTime}
                    style={{ margin: 0, marginBottom: "0.8rem" }}
                    onChange={({ target }) => setTaskStartTime(target.value)}
                  />
                </div>
                <div>
                  <span className="selectProject">Time finished task</span>
                  <input
                    type={"time"}
                    placeholder={"end time of task"}
                    value={taskEndTime}
                    style={{ margin: 0, marginBottom: "0.8rem" }}
                    onChange={({ target }) => setTaskEndTime(target.value)}
                    max={`${
                      Number(
                        new Date(
                          new Date(
                            `${new Date().toDateString()} ${taskStartTime}`
                          ).getTime() +
                            15 * 60000
                        ).getHours()
                      ) < 10
                        ? "0" +
                          new Date(
                            new Date(
                              `${new Date().toDateString()} ${taskStartTime}`
                            ).getTime() +
                              15 * 60000
                          ).getHours()
                        : new Date(
                            new Date(
                              `${new Date().toDateString()} ${taskStartTime}`
                            ).getTime() +
                              15 * 60000
                          ).getHours()
                    }:${new Date(
                      new Date(
                        `${new Date().toDateString()} ${taskStartTime}`
                      ).getTime() +
                        15 * 60000
                    ).getMinutes()}`}
                    readOnly={taskStartTime.length < 1 ? true : false}
                  />
                </div>
                <div>
                  <span className="selectProject"> task</span>
                  <input
                    type={"text"}
                    placeholder={"task"}
                    value={taskName}
                    style={{ margin: 0, marginBottom: "0.8rem" }}
                    onChange={({ target }) => setTaskName(target.value)}
                  />
                </div>
                <div>
                  <span className="selectProject">details</span>
                  <input
                    type={"text"}
                    placeholder={"details"}
                    value={details}
                    style={{ margin: 0, marginBottom: "0.8rem" }}
                    onChange={({ target }) => setDetails(target.value)}
                  />
                </div>
                <div>
                  <button
                    style={{ backgroundColor: "##005734" }}
                    onClick={isCreatingTask ? addNewTask : updateTask}
                  >
                    {isCreatingTask ? <AiOutlinePlus /> : <AiFillEdit />}
                  </button>
                </div>
              </div>

              <span className="selectProject">Enter Task Details</span>
              <textarea
                placeholder="Enter Task"
                name="description"
                value={newTaskDetails.description}
                style={{ margin: 0 }}
                onChange={handleChange}
                rows={5}
              ></textarea>
              <button
                type={"button"}
                className="add__Task__Btn"
                disabled={disabled}
                onClick={() =>
                  editPage
                    ? handleUpdateTaskBtnClick()
                    : CreateNewTaskFunction()
                }
              >
                {loading
                  ? "Please wait..."
                  : editPage
                  ? "Update Task"
                  : "Add Task"}
              </button>
            </>
          ) : (
            <>
              {teamMembers.length < 1 ? (
                <>
                  <h4>Your team members will appear here</h4>
                </>
              ) : (
                <>
                  <h4>Your team members ({teamMembers.length})</h4>
                  <div className="team__Members__Container">
                    {React.Children.toArray(
                      teamMembers.map((member) => {
                        return (
                          <p
                            className="team__Member__Item"
                            onClick={() =>
                              handleMemberItemClick(member.applicant)
                            }
                          >
                            {member.applicant}
                          </p>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddTaskScreen;
const Table = ({ tasks, deleteTask, getTaskId }) => {
  return null;
};
