import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiOutlineClose, AiOutlineFileDone, AiOutlinePlus } from "react-icons/ai";
import useClickOutside from "../../../../hooks/useClickOutside";
import { IoIosArrowBack } from "react-icons/io";

import "./style.css";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { addNewCandidateTaskV2, createCandidateTask, deleteSingleCandidateTaskV2, getCandidateTasksOfTheDayV2, saveCandidateTaskV2, updateNewCandidateTaskV2, updateSingleCandidateTaskV2 } from "../../../../services/candidateServices";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import taskImg from "../../../../assets/images/tasks-done.jpg";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { IoRefresh } from "react-icons/io5";

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
  const [ showSubmitTaskInfo, setShowSubmitTaskInfo ] = useState(false);
  const [ taskDetailForToday, setTaskDetailForToday ] = useState(null);
  const [ taskDetailForTodayLoaded, setTaskDetailForTodayLoaded ] = useState(false);
  const [ taskDetailForTodayLoading, setTaskDetailForTodayLoading ] = useState(true);
  const [ savingLoading, setSavingLoading ] = useState(false);
  const [ editLoading, setEditLoading ] = useState(false);
  const [ deleteLoading, setDeleteLoading ] = useState(false);
  
  //   var conditions
  const inputsAreFilled = taskStartTime && taskEndTime && taskName;
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
    setoptionValue("");
  };
  const fillAllInputs = (taskStartTime, taskEndTime, taskName, details, project) => {
    setTaskStartTime(taskStartTime);
    setTaskEndTime(taskEndTime);
    setTaskName(taskName);
    setDetails(details);
    setoptionValue(project);
  };

  const addTaskCondition = () => {
    setIsCreatingTask(true);
  };

  const editTaskCondition = () => {
    setIsCreatingTask(false);
  };

  const getInputsForEditing = (id) => {
    editTaskCondition();
    const { start_time, end_time, task, details, project } = tasks.find(
      (task) => task._id === id
    );
    fillAllInputs(start_time, end_time, task, details, project);
  };

  // const addSingleTask = (start_time, end_time, taskName, details, _id) => {
  //   setTasks([
  //     ...tasks,
  //     { _id: _id, start_time, end_time, taskName, details },
  //   ]);
  //   console.log([
  //     ...tasks,
  //     { id: new Date().getTime(), start_time, end_time, taskName, details },
  //   ]);
  // };

  const updateSingleTask = (start_time, end_time, taskName, details, project) => {
    console.log({ taskId });
    setTasks(
      tasks.map((task) => {
        if (task._id === taskId) {
          console.log(true);
          return { ...task, start_time, end_time, task: taskName, details, project };
        }
        return task;
      })
    );
  };
  const getTaskId = (id) => {
    setTaskId(id);
    editTaskCondition();
    getInputsForEditing(id);
    setEditLoading(true);
  };

  //   importand fuction
  const addNewTask = () => {
    if (optionValue.length < 1) return toast.info("Please select a project before proceding");
    if (inputsAreFilled) {
      if (duration <= 15) {
        if (!taskDetailForToday) return addTaskForToday(taskStartTime, taskEndTime, taskName, details);
        updateTasksForToday(taskStartTime, taskEndTime, taskName, details);
      } else {
        toast.info(
          "The time you finished your task must be within 15 minutes of its starting time"
        );
        console.log({ taskStartTime, taskEndTime, duration });
      }
    } else {
      toast.error("All inputs should be filled");
    }
  };

  const updateTask = async () => {
    if (inputsAreFilled) {
      if (duration < 15) {
        setLoading(true);
        setDisabled(true);
        
        try {
          const res = (await updateSingleCandidateTaskV2(
            {
              update_task: {
                "project": optionValue,
                "task": taskName,
                "task_type": "MEETING UPDATE",
                "start_time": taskStartTime,
                "end_time": taskEndTime,
              }
            },
            taskId,
          )).data;
          toast.success(res.message);
          setLoading(false);
          setDisabled(false);
          setEditLoading(false);

          updateSingleTask(taskStartTime, taskEndTime, taskName, details, optionValue);
          clearAllInputs();
          addTaskCondition();
          setTaskId("");

        } catch (error) {
          
          console.log(error);
          toast.error('An error occured while trying to edit your task');
          setLoading(false);
          setDisabled(false);
          setEditLoading(false);
        }
        
      } else {
        toast.info(
          "The time you finished your task must be within 15 minutes of its starting time"
        );
        console.log({ taskStartTime, taskEndTime, duration });
      }
    } else {
      toast.error(" all inputs should be filled");
    }
  };

  const deleteTask = async (id) => {
    const copyOfTasks = tasks.slice();
    const foundTask = copyOfTasks.find(task => task._id === id);
    const foundTaskIndex = copyOfTasks.findIndex(task => task._id === id);
    if (!foundTask) return

    setDeleteLoading(true);
    setTaskId(foundTask._id);
    const updatedStatus = !foundTask.is_active;

    try {
      const res = (await deleteSingleCandidateTaskV2(foundTask._id, foundTask.is_active && foundTask.is_active === true ? 'deactive' : 'active')).data;
      toast.success(res.message);

      copyOfTasks[foundTaskIndex].is_active = updatedStatus;
      setTasks(copyOfTasks); 
      setDeleteLoading(false);
      setTaskId("");

    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      setTaskId("");
    }

    // setTasks(tasks.filter((task) => task._id !== id));
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
    if (taskDetailForToday) {
      setTaskDetailForTodayLoading(false);
      setTaskDetailForTodayLoaded(true);
      return;
    }

    setTaskDetailForTodayLoading(true);
    setTaskDetailForTodayLoaded(false);

    const todayDate =  new Date().toISOString().split('T')[0];

    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "user_id": currentUser.userinfo.userID,
      "data_type": currentUser.portfolio_info[0].data_type,
      "task_created_date": todayDate,
    }

    getCandidateTasksOfTheDayV2(dataToPost).then(res => {
      const [ parentTaskAddedForToday, listsOfTasksForToday ] = [
        res.data.task_details.find(task =>
          task.task_created_date === todayDate &&
          task.applicant === currentUser.userinfo.username &&
          task.task_added_by === currentUser.userinfo.username &&
          task.data_type === currentUser.portfolio_info[0].data_type &&
          task.company_id === currentUser.portfolio_info[0].org_id
        )
        ,
        res.data.task
      ]

      if (parentTaskAddedForToday && listsOfTasksForToday.length > 0) {
        setTaskDetailForToday({
          parentTask: parentTaskAddedForToday,
          tasks: listsOfTasksForToday,
        })
        setTasks(listsOfTasksForToday);  
      }
      
      setTaskDetailForTodayLoaded(true);
      setTaskDetailForTodayLoading(false);

    }).catch(err => {
      console.log(err);
      setTaskDetailForTodayLoading(false);
    })

  }, [])

  useEffect(() => {
    if (taskName?.length < 1 || optionValue.length < 1)
      return setDisabled(true);
    if (taskStartTime.length < 1 || taskEndTime.length < 1)
      return setDisabled(true);

    setDisabled(false);
  }, [taskName, optionValue, taskStartTime, taskEndTime]);

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

  
  const addTaskForToday = async (startTime, endTime, task, details, updateTask=false) => {
    const todayDate =  new Date().toISOString().split('T')[0];

    const dataToPost = {
      "project": optionValue,
      "applicant": currentUser.userinfo.username,
      "task": task,
      "task_added_by": currentUser.userinfo.username,
      "data_type": currentUser.portfolio_info[0].data_type,
      "company_id": currentUser.portfolio_info[0].org_id,
      "task_created_date": todayDate,
      "task_type": updateTask ? "TASK UPDATE" : "MEETING UPDATE",
      "start_time": startTime,
      "end_time": endTime,
      "user_id": currentUser.userinfo.userID,
    }

    const dataToPost2 = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "user_id": currentUser.userinfo.userID,
      "data_type": currentUser.portfolio_info[0].data_type,
      "task_created_date": todayDate,
    }

    setLoading(true);
    setDisabled(true);

    try {
      
      let res;

      // UPDATE TASKS FOR TODAY
      if (updateTask) {
        res = (await updateNewCandidateTaskV2(dataToPost, taskDetailForToday?.parentTask?._id)).data;

        const copyOfTasksForToday = structuredClone(taskDetailForToday);
        copyOfTasksForToday.tasks.push({...res.response, _id: res.current_task_id});

        setTaskDetailForToday(copyOfTasksForToday);

        setLoading(false);
        setDisabled(false);
        
        setTasks(copyOfTasksForToday.tasks);
        clearAllInputs();
        setTaskId("");

        return
      }
      
      res = (await addNewCandidateTaskV2(dataToPost)).data;
      console.log(res);

      try {
        const taskRes = (await getCandidateTasksOfTheDayV2(dataToPost2)).data;

        const [ parentTaskAddedForToday, listsOfTasksForToday ] = [
          taskRes.task_details.find(task =>
            task.task_created_date === todayDate &&
            task.applicant === currentUser.userinfo.username &&
            task.task_added_by === currentUser.userinfo.username &&
            task.data_type === currentUser.portfolio_info[0].data_type &&
            task.company_id === currentUser.portfolio_info[0].org_id
          )
          ,
          taskRes.task
        ]

        setTaskDetailForToday({
          parentTask: parentTaskAddedForToday,
          tasks: listsOfTasksForToday,
        })

        setLoading(false);
        setDisabled(false);
        
        setTasks(listsOfTasksForToday);
        clearAllInputs();
        setTaskId("");
        
      } catch (error) {
        console.log(error);
        setLoading(false);
        setDisabled(false);
      }

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while trying to add your task. Please try again later')
      setLoading(false);
      setDisabled(false);
    }
  }

  const updateTasksForToday = () => {
    addTaskForToday(taskStartTime, taskEndTime, taskName, details, true);
  }

  const handleSaveTasksForTheDay = async () => {
    setSavingLoading(true);

    try {
      const res = (await saveCandidateTaskV2(taskDetailForToday?.parentTask?._id)).data;

      const copyOfTasksForToday = structuredClone(taskDetailForToday);
      copyOfTasksForToday.parentTask.task_saved = true;
      setTaskDetailForToday(copyOfTasksForToday);
      setSavingLoading(false);
      toast.success(res.message);
      closeTaskScreen();

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while trying to submit your tasks. Please try again later')
      setSavingLoading(false);
    }
  }
  
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
        {
          showSubmitTaskInfo ? <>
            <IoIosArrowBack
              onClick={
                () => setShowSubmitTaskInfo(false)
              }
              style={{ 
                cursor: "pointer",
                fontSize: '18px',
              }}
            />
            <h1 className="title__Item">
              {"Submit task for today"}
            </h1>
            <p>Done uploading tasks for today?</p>

            <div className="task__Today__Submit__Wrapper">
              <img src={taskImg} alt="task illustration" />
              <p>You can submit all your tasks for today now or later if you would like to continue on updating later today.<br /><br />Please read and note the following:</p>
              <ul>
                <li>If you choose <b>Submit later</b>, you can always come back anytime <b>today</b> and make changes</li>
                <li>If you choose <b>Submit now</b>, you will <b>not</b> be able to make <b>any more updates today</b></li>
                <li><b>Do not click</b> on <b>Submit now</b> if you still have other tasks to submit for today</li>
                <li>If you forget to submit your task for the day, do not worry, all your tasks are saved </li>
              </ul>
            </div>
            <div className="buttons__Wrapper">
              <button
                type={"button"}
                className="add__Task__Btn cancel__Btn"
                disabled={savingLoading}
                onClick={() =>
                  {
                    setShowSubmitTaskInfo(false);
                    closeTaskScreen();
                  }
                }
              >
                {"Submit later"}
              </button>
              <button
                type={"button"}
                className="add__Task__Btn"
                disabled={savingLoading}
                onClick={
                  () => handleSaveTasksForTheDay()
                }
              >
                {
                  savingLoading ? 
                    "Submitting"
                    :
                    "Submit now"
                }
              </button>
            </div>
          </> : 
          <>
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
                  {
                    editPage ? 
                    "Edit Task" 
                    :
                    taskDetailForTodayLoading ? "Loading" :
                    taskDetailForToday?.parentTask?.task_saved ?
                    "View Task Details"
                    : 
                    "New Task Details"
                  }
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
            {
              taskDetailForTodayLoading && <p className="task__Today__Detail__Loading">
                <span>
                  <LoadingSpinner 
                    width={'14px'}
                    height={'14px'}
                  />
                </span>
                <span>Please wait...</span>
              </p>
            }
            {showTaskForm ? (
              <>
                {
                  taskDetailForTodayLoading ? <></> :
                  !taskDetailForToday?.parentTask?.task_saved && <>
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
                  </>
                }
                {
                  taskDetailForTodayLoading ? <></> :
                  !taskDetailForToday?.parentTask?.task_saved && <div className="task__Timing__Wrapper">
                    <div>
                      <span className="selectProject">Time started</span>
                      <input
                        type={"time"}
                        placeholder={"start time of task"}
                        value={taskStartTime}
                        style={{ margin: 0, marginBottom: "0.8rem" }}
                        onChange={({ target }) => setTaskStartTime(target.value)}
                        readOnly={loading || !taskDetailForTodayLoaded ? true : false}
                      />
                    </div>
                    <div>
                      <span className="selectProject">Time finished</span>
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
                        readOnly={loading || !taskDetailForTodayLoaded || taskStartTime.length < 1 ? true : false}
                      />
                    </div>
                    <div>
                      <span className="selectProject">Task</span>
                      <input
                        type={"text"}
                        placeholder={"task"}
                        value={taskName}
                        style={{ margin: 0, marginBottom: "0.8rem" }}
                        onChange={({ target }) => setTaskName(target.value)}
                        readOnly={loading || !taskDetailForTodayLoaded ? true : false}
                      />
                    </div>
                    <div>
                      <span className="selectProject">Project</span>
                      <select
                        onChange={(e) => selctChange(e)}
                        className="addTaskDropDown new__Task"
                        style={{ 
                          margin: 0, 
                          marginBottom: "0.8rem",
                        }}
                        value={optionValue}
                      >
                        <option value={""}>Select</option>
                        {assignedProject.map((v, i) => (
                          <option key={i} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        style={{
                          backgroundColor: "#005734",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: "none",
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                        onClick={isCreatingTask ? addNewTask : updateTask}
                        disabled={disabled}
                      >
                        {loading ? (
                          <LoadingSpinner 
                            color={'#fff'}
                            width={'18px'}
                            height={'18px'}
                          />
                        ) :
                        isCreatingTask ? (
                          <AiOutlinePlus
                            style={{
                              color: "white",
                              fontWeight: "600",
                              fontSize: 20,
                            }}
                          />
                        ) : (
                          <AiFillEdit
                            style={{
                              color: "white",
                              fontWeight: "600",
                              fontSize: 20,
                            }}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                }

                {tasks.length > 0 ? (
                  <>
                    {
                      taskDetailForToday?.parentTask?.task_saved && <p className="task__Saved__Indicatore">
                        <span><AiOutlineFileDone /></span>
                        <span>Tasks have been submitted for today!</span>
                      </p>
                    }
                    <table id="customers">
                      <tr>
                        <th>S/N</th>
                        <th>Time started</th>
                        <th>Time finished</th>
                        <th>task</th>
                        <th>project</th>
                        <th>actions</th>
                      </tr>
                      <tbody>
                        {tasks.map((task, index) => (
                          <tr key={task._id}>
                            <td>{index + 1}.</td>
                            <td className={task.is_active &&  task.is_active === true ? "" : "deleted"}>{task.start_time}</td>
                            <td className={task.is_active &&  task.is_active === true ? "" : "deleted"}>{task.end_time}</td>
                            <td className={task.is_active &&  task.is_active === true ? "" : "deleted"}>{task.task}</td>
                            <td className={task.is_active &&  task.is_active === true ? "" : "deleted"}>{task.project}</td>
                            <td>
                              <div className="edit__Item__Customer">
                                {
                                  task.is_active &&  task.is_active === true && <button 
                                    onClick={(taskDetailForToday?.parentTask?.task_saved || editLoading || deleteLoading) ? () => {} : () => getTaskId(task._id)}
                                    data-tooltip-id={task._id}
                                    data-tooltip-content={'Edit task'}
                                    style={{
                                      cursor: (taskDetailForToday?.parentTask?.task_saved || editLoading || deleteLoading) ? "not-allowed" : "pointer"
                                    }}
                                  >
                                    <AiFillEdit />
                                  </button>
                                }
                                <button
                                  onClick={(taskDetailForToday?.parentTask?.task_saved || editLoading || deleteLoading) ? () => {} : () => deleteTask(task._id)}
                                  className="delete"
                                  data-tooltip-id={task._id + "1"}
                                  data-tooltip-content={task.is_active &&  task.is_active === true ? 'Delete task' : 'Retrieve task'}
                                  style={{
                                    cursor: (taskDetailForToday?.parentTask?.task_saved || editLoading || deleteLoading) ? "not-allowed" : "pointer"
                                  }}
                                >
                                  {
                                    deleteLoading && taskId === task._id ? 
                                    <LoadingSpinner 
                                      width={'0.7rem'}
                                      height={'0.7rem'}
                                    />
                                    :
                                    task.is_active &&  task.is_active === true ? 
                                      <AiOutlineClose />
                                    :
                                    <IoRefresh />
                                  }
                                </button>
                                <Tooltip id={task._id} />
                                <Tooltip id={task._id + "1"} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : null}
                
                {
                  taskDetailForTodayLoading ? <></> : 
                  <div className="buttons__Wrapper">
                    <button
                      type={"button"}
                      className="add__Task__Btn cancel__Btn"
                      disabled={editLoading || deleteLoading ? true : false}
                      onClick={() =>
                        closeTaskScreen()
                      }
                    >
                      {taskDetailForToday?.parentTask?.task_saved ? "Close" : "Cancel"}
                    </button>
                    {
                      !taskDetailForToday?.parentTask?.task_saved && <button
                        type={"button"}
                        className="add__Task__Btn"
                        disabled={tasks.length < 1 || editLoading || deleteLoading ? true : false}
                        onClick={
                          editPage
                            ? () => handleUpdateTaskBtnClick()
                            : () => setShowSubmitTaskInfo(true)
                        }
                      >
                        {editPage
                          ? "Update Task"
                          : "Next"}
                      </button>
                    }
                  </div>
                }
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
          </>
        }
        </div>
      </div>
    </>
  );
};

export default AddTaskScreen;
const Table = ({ tasks, deleteTask, getTaskId }) => {
  return null;
};



// const handleNewTaskBtnClick = async () => {
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
// };


// const CreateNewTaskFunction = () => {
//   const [endTimeInDateFormat, startTimeInDateFormat, today] = [
//     new Date(`${new Date().toDateString()} ${taskEndTime}`),
//     new Date(`${new Date().toDateString()} ${taskStartTime}`),
//     new Date(),
//   ];
//   // if (startTimeInDateFormat.getTime() < today.getTime()) return toast.info('The time you are starting this task has to be later than the current time for today');
//   if (endTimeInDateFormat.getTime() < startTimeInDateFormat.getTime())
//     return toast.info(
//       "The time you finished your task has to be later than the time you started it"
//     );

//   const minutesDiffInStartAndEndTime = getDifferenceInMinutes(
//     endTimeInDateFormat,
//     startTimeInDateFormat
//   );
//   if (minutesDiffInStartAndEndTime > 15)
//     return toast.info(
//       "The time you finished your task must be within 15 minutes of its starting time"
//     );

//   setDisabled(true);
//   setLoading(true);

//   const dataToPost = {
//     project: optionValue,
//     applicant: currentUser.userinfo.username,
//     task: newTaskDetails.description,
//     task_added_by: currentUser.userinfo.username,
//     data_type: currentUser.portfolio_info[0].data_type,
//     company_id: currentUser.portfolio_info[0].org_id,
//     task_created_date: formattedDate,
//     task_type: "Custom",
//     start_time: convertDateFormat(startTimeInDateFormat),
//     end_time: convertDateFormat(endTimeInDateFormat),
//   };
//   createCandidateTask(dataToPost)
//     .then((resp) => {
//       console.log(resp);
//       updateTasks((prevTasks) => {
//         return [
//           ...prevTasks,
//           { ...dataToPost, status: newTaskDetails.status },
//         ];
//       });
//       setNewTaskDetails({ ...newTaskDetails, description: "" });
//       setoptionValue("");
//       toast.success("New task successfully added");
//       setDisabled(false);
//       setLoading(false);
//       closeTaskScreen();
//     })
//     .catch((err) => {
//       console.log(err);
//       setDisabled(false);
//       setLoading(false);
//       toast.error("An error occurred while trying to add your task");
//     });
// };
