import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiOutlineClose, AiOutlineFileDone, AiOutlinePlus } from "react-icons/ai";
import useClickOutside from "../../../../hooks/useClickOutside";
import { IoIosArrowBack } from "react-icons/io";
import { HiLightBulb } from "react-icons/hi";
import { GoTasklist } from "react-icons/go";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { addNewCandidateTaskV2, createCandidateTask, deleteSingleCandidateTaskV2, getCandidateTasksOfTheDayV2, saveCandidateTaskV2, updateNewCandidateTaskV2, updateSingleCandidateTaskV2 } from "../../../../services/candidateServices";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import taskImg from "../../../../assets/images/tasks-done.jpg";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { IoRefresh } from "react-icons/io5";
import SubprojectSelectWithSearch from "../../../../components/SubprojectSelectWithSearch/SubprojectSelectWithSearch";
import useListenToKeyStrokeInElement from "../../../../hooks/useListenToKeyStrokeInElement";
import { formatSubprojectStringItemToHTML } from "../../util/formatSubprojectStringItemToHTML";
import ContentEditable from "react-contenteditable";
import { formatDateForAPI } from "../../../../helpers/helpers";
import { getCurrentTimeFromDowell } from "../../../../services/dowellTimeServices";
import { rolesNamesDict } from "../../../AdminPage/views/Settings/AdminSettings";
import Overlay from "../../../../components/Overlay";

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
  subprojects,
  logRequestDate,
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
  // const [time, settime] = useState(new Date().toString());
  // const [ TimeValue, setTimeValue ] = useState(new Date());
  // const TimeValue = `${time.split(" ")[0]} ${time.split(" ")[1]} ${time.split(" ")[2]
  //   } ${time.split(" ")[3]}`;
  const time = new Date().toString();
  const [TimeValue, setTimeValue] = useState(`${time.split(" ")[0]} ${time.split(" ")[1]} ${time.split(" ")[2]} ${time.split(" ")[3]}`);
  const [optionValue, setoptionValue] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [notesOverlayVisibility, setNotesOverlayVisibility] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [details, setDetails] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  // console.log({ tasks });
  const [taskId, setTaskId] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(true);
  const [showSubmitTaskInfo, setShowSubmitTaskInfo] = useState(false);
  const [taskDetailForToday, setTaskDetailForToday] = useState(null);
  const [taskDetailForTodayLoaded, setTaskDetailForTodayLoaded] = useState(false);
  const [taskDetailForTodayLoading, setTaskDetailForTodayLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [taskType, setTaskType] = useState("");
  const [subprojectSelected, setSubprojectSelected] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(
    localStorage.getItem('log_info_shown') ? false
      :
      true
  );
  const textareaRef = useRef();
  const subprojectRef = useRef();
  const [showSubprojectSelections, setShowSubprojectSelections] = useState(false);
  const [formattedTaskName, setFormattedTaskName] = useState('');
  const [allowedTimeInterval, setAllowedTimeInterval] = useState(15);


  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
  };

  //   var conditions
  const inputsAreFilled = taskStartTime && taskEndTime && taskName && taskType;
  const duration = getDifferenceInMinutes(
    new Date(`${new Date().toDateString()} ${taskStartTime}`),
    new Date(`${new Date().toDateString()} ${taskEndTime}`)
  );
  //   lest important functions
  const clearAllInputs = () => {
    // setTaskStartTime("");
    setTaskEndTime("");
    // setTaskName("");
    // setDetails("");
    setoptionValue("");
    // setTaskType("");
    setSubprojectSelected(null);
  };
  const fillAllInputs = (taskStartTime, taskEndTime, taskName, details, project, taskType, subproject) => {
    setTaskStartTime(taskStartTime);
    setTaskEndTime(taskEndTime);
    setTaskName(taskName);
    setDetails(details);
    setoptionValue(project);
    setTaskType(taskType);
    setSubprojectSelected(subproject);
  };

  const addTaskCondition = () => {
    setIsCreatingTask(true);
  };

  const editTaskCondition = () => {
    setIsCreatingTask(false);
  };

  const getInputsForEditing = (id) => {
    editTaskCondition();
    const { start_time, end_time, task, details, project, task_type, subproject } = tasks.find(
      (task) => task._id === id
    );
    fillAllInputs(start_time, end_time, task, details, project, task_type, subproject);
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

  const updateSingleTask = (start_time, end_time, taskName, details, project, taskType, subproject) => {
    console.log({ taskId });
    setTasks(
      tasks.map((task) => {
        if (task._id === taskId) {
          console.log(true);
          return { ...task, start_time, end_time, task: taskName, details, project, task_type: taskType, subproject };
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
  const compareStrings = (str1, str2) => {
    const formattedStr1 = str1.replace(/[. ]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedStr2 = str2.replace(/[. ]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return formattedStr1 === formattedStr2;
  };
  function removeSpaces(inputString) {
    // Use a regular expression to replace all spaces with an empty string
    return inputString.replace(/\s/g, '');
  }
  // complete
  function isStringValid(inputString) {
    if (inputString === undefined) return ''
    const trimmedString = inputString.trim();
    const words = trimmedString.split(/\s+/);
    return trimmedString.length >= 25 && words.length >= 5;
  }
  function cleanString(inputString) {
    const cleanedString = inputString.replace(/[!?.]/g, '');
    const trimmedString = cleanedString.trim();
    return trimmedString;
  }
  //   importand fuction
  const addNewTask = () => {
    if (optionValue.length < 1) return toast.info("Please select a project before proceding");
    if (inputsAreFilled) {
      console.log({ TASKSS: tasks.find(task => task.task === taskName) })
      if (tasks.find(task => task?.task?.toLocaleLowerCase().trim() === taskName.toLocaleLowerCase().trim() && task.is_active) !== undefined) return toast.info('You cannot add the same log')
      if (tasks.find(task => compareStrings(task?.task?.toLocaleLowerCase().trim(), taskName.toLocaleLowerCase().trim())) !== undefined) return toast.info('You cannot add the same log');
      if (!isStringValid(taskName)) return toast.info('The log entered should have at least 25 characters and at least 5 words.')
      if (taskEndTime === '00:00') return toast.info("You can only update work logs for today")
      if (duration <= allowedTimeInterval) {
        if (taskStartTime > taskEndTime) return toast.info('Work log start time must be less than its end time');
        if (!taskDetailForToday) return addTaskForToday(taskStartTime, taskEndTime, taskName, details);
        updateTasksForToday(taskStartTime, taskEndTime, taskName, details);
      } else {
        toast.info(
          `The time you finished your work log must be within ${allowedTimeInterval} minutes of its starting time`
        );
        console.log({ taskStartTime, taskEndTime, duration });
      }
    } else {
      toast.error("All inputs should be filled");
    }
  };

  const updateTask = async () => {
    if (inputsAreFilled) {
      if (duration <= allowedTimeInterval) {
        const tasksExcludingCurrentTaskBeingEdited = tasks.filter(task => task._id !== taskId);
        if (tasksExcludingCurrentTaskBeingEdited.find(task => task?.task?.toLocaleLowerCase().trim() === taskName.toLocaleLowerCase().trim() && task.is_active) !== undefined) return toast.info('You cannot add the same log')
        if (!isStringValid(taskName)) return toast.info('The log entered should have at least 25 characters and at least 5 words.')
        if (taskEndTime === '00:00') return toast.info("You can only update work logs for today")
        if (taskStartTime > taskEndTime) return toast.info('Work log start time must be less than its end time');

        setLoading(true);
        setDisabled(true);

        try {
          const res = (await updateSingleCandidateTaskV2(
            {
              update_task: {
                "project": optionValue,
                "task": taskName,
                "task_type": taskType,
                "start_time": taskStartTime,
                "end_time": taskEndTime,
                "subproject": subprojectSelected,
              }
            },
            taskId,
          )).data;
          toast.success(res.message);
          setLoading(false);
          setDisabled(false);
          setEditLoading(false);

          updateSingleTask(taskStartTime, taskEndTime, taskName, details, optionValue, taskType, subprojectSelected);
          clearAllInputs();
          addTaskCondition();
          setTaskId("");

        } catch (error) {

          console.log(error);
          toast.error('An error occured while trying to edit your work log');
          setLoading(false);
          setDisabled(false);
          setEditLoading(false);
        }

      } else {
        toast.info(
          `The time you finished your work log must be within ${allowedTimeInterval} minutes of its starting time`
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
    // console.log(formattedDate);
    return formattedDate;
  }

  function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  }

  // const formattedDate = convertDateFormat(time);
  // console.log(formattedDate);

  // console.log(time);
  // useClickOutside(ref, () => { closeTaskScreen(); !afterSelectionScreen && setEditPage(false) });

  // useEffect (() => {

  //     if (newTaskDetails.username.length < 1) return setShowTaskForm(false);

  //     if ((newTaskDetails.title.length < 1) || (newTaskDetails.description.length < 1)) return setDisabled(true)

  //     setDisabled(false)

  // }, [newTaskDetails])
  useEffect(() => {
    if (taskStartTime) {
      const [hours, minutes] = taskStartTime.split(':').map(Number);
      const newMinutes = (minutes + allowedTimeInterval) % 60;
      const newHours = hours + Math.floor((minutes + allowedTimeInterval) / 60);
      const newEndTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      setTaskEndTime(newEndTime);
    }
  }, [taskStartTime])

  useEffect(() => {
    const currentUserSetting = currentUser?.settings_for_profile_info?.profile_info[currentUser?.settings_for_profile_info?.profile_info?.length - 1];

    // UPDATE TIME INTERVAL FOR TEAMLEADS
    if (currentUserSetting) {
      const rolesForUser = currentUserSetting?.other_roles ?
        [...new Set([currentUserSetting?.Role, ...currentUserSetting?.other_roles])]
        :
        [currentUserSetting?.Role];

      if (rolesForUser && rolesForUser.includes(rolesNamesDict.Teamlead)) setAllowedTimeInterval(30);
    } else {
      setAllowedTimeInterval(15);
    }

    if (taskDetailForToday) {
      setTaskDetailForTodayLoading(false);
      setTaskDetailForTodayLoaded(true);
      return;
    }

    setTaskDetailForTodayLoading(true);
    setTaskDetailForTodayLoaded(false);

    const data = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    getCurrentTimeFromDowell(data).then(res => {
      const today = res.data?.current_time;
      const todayInDateString = new Date(today).toDateString();

      const passedRequestDate = logRequestDate && new Date(logRequestDate) != 'Invalid Date' ?
        new Date(logRequestDate)
        :
        null;

      setTimeValue(
        passedRequestDate ?
          `${passedRequestDate.toDateString().split(" ")[0]} ${passedRequestDate.toDateString().split(" ")[1]} ${passedRequestDate.toDateString().split(" ")[2]} ${passedRequestDate.toDateString().split(" ")[3]}`
          :
          `${todayInDateString.split(" ")[0]} ${todayInDateString.split(" ")[1]} ${todayInDateString.split(" ")[2]} ${todayInDateString.split(" ")[3]}`
      );

      const todayDate = formatDateForAPI(
        passedRequestDate ?
          passedRequestDate
          :
          today
      );

      const dataToPost = {
        "company_id": currentUser.portfolio_info[0].org_id,
        "user_id": currentUser.userinfo.userID,
        "data_type": currentUser.portfolio_info[0].data_type,
        "task_created_date": todayDate,
      }

      getCandidateTasksOfTheDayV2(dataToPost).then(res => {
        const [parentTaskAddedForToday, listsOfTasksForToday] = [
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
          setTasks(listsOfTasksForToday?.reverse());
        }

        setTaskDetailForTodayLoaded(true);
        setTaskDetailForTodayLoading(false);

      }).catch(err => {
        console.log(err);
        setTaskDetailForTodayLoading(false);
      })

    }).catch(err => {
      setTaskDetailForTodayLoading(false);
      toast.info('An error occured while trying to determine your current time')
    })

  }, [])

  useEffect(() => {
    if (taskName?.length < 1 || optionValue.length < 1)
      return setDisabled(true);
    if (taskStartTime.length < 1 || taskEndTime.length < 1)
      return setDisabled(true);

    if (taskType.length < 1) return setDisabled(true);

    setDisabled(false);
  }, [taskName, optionValue, taskStartTime, taskEndTime, taskType]);

  useEffect(() => {
    setFormattedTaskName(formatSubprojectStringItemToHTML(taskName));
  }, [taskName])

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

  useListenToKeyStrokeInElement(
    ref,
    'Enter',
    () => {
      if (
        loading ||
        disabled ||
        taskStartTime.length < 1 ||
        taskEndTime.length < 1 ||
        taskName.length < 1 ||
        optionValue.length < 1 ||
        !subprojectSelected
      ) return

      if (isCreatingTask) {
        addNewTask()
        return
      }

      updateTask()
    }
  )

  useListenToKeyStrokeInElement(
    textareaRef,
    '@',
    () => {
      if (subprojectSelected) return

      setShowSubprojectSelections(true);
    },
    true
  )

  useListenToKeyStrokeInElement(
    textareaRef,
    'Backspace',
    () => {
      const currentTaskName = taskName.slice(-4) === '<br>' ?
        taskName.slice(0, -5)
        :
        taskName.slice(0, -1);

      const userIsDeletingSubproject = currentTaskName.slice(-3) === '</p';

      if (userIsDeletingSubproject) {
        handleCancelSubprojectSelection();
        setShowSubprojectSelections(true);
        return
      }
    },
    true
  )

  // console.log({ taskStartTime });

  const makeAPICallToAddTasks = async (
    today,
    startTime,
    endTime,
    task,
    updateTask,
  ) => {
    const passedRequestDate = logRequestDate && new Date(logRequestDate) != 'Invalid Date' ?
      new Date(logRequestDate)
      :
      null;

    const todayDate = formatDateForAPI(
      passedRequestDate ?
        passedRequestDate
        :
        today
    );

    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    let imageUrl = "";
    if (selectedFile) {
      const response = await fetch(
        "https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-hr-image/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // If the request is successful, parse the JSON response
        const data = await response.json();
        imageUrl = data.file_url;
        setSelectedFile(null)
      } else {
        // Handle the case where the request is not successful
        toast.error("Error uploading image");
      }
    }

    const dataToPost = {
      "project": optionValue,
      "applicant": currentUser.userinfo.username,
      "task": task,
      "task_added_by": currentUser.userinfo.username,
      "data_type": currentUser.portfolio_info[0].data_type,
      "company_id": currentUser.portfolio_info[0].org_id,
      "task_created_date": todayDate,
      "task_type": taskType,
      "start_time": startTime,
      "end_time": endTime,
      "user_id": currentUser.userinfo.userID,
      "subproject": subprojectSelected,
    }

    if (imageUrl.length > 0) dataToPost.image = imageUrl;

    const dataToPost2 = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "user_id": currentUser.userinfo.userID,
      "data_type": currentUser.portfolio_info[0].data_type,
      "task_created_date": todayDate,
    }

    try {

      let res;

      // UPDATE TASKS FOR TODAY
      if (updateTask) {
        res = (await updateNewCandidateTaskV2(dataToPost, taskDetailForToday?.parentTask?._id)).data;

        toast.success(res?.message);

        const copyOfTasksForToday = tasks.slice();

        copyOfTasksForToday.unshift({ ...res.response, _id: res.current_task_id });

        setLoading(false);
        setDisabled(false);

        setTasks(copyOfTasksForToday);
        clearAllInputs();
        setTaskId("");
        setTaskStartTime(endTime);
        const [hours, minutes] = endTime.split(':').map(Number);
        const newMinutes = (minutes + allowedTimeInterval) % 60;
        const newHours = hours + Math.floor((minutes + allowedTimeInterval) / 60);
        const newEndTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        setTaskEndTime(newEndTime);
        return
      }

      res = (await addNewCandidateTaskV2(dataToPost)).data;
      console.log(res);

      try {
        const taskRes = (await getCandidateTasksOfTheDayV2(dataToPost2)).data;

        const [parentTaskAddedForToday, listsOfTasksForToday] = [
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

        toast.success(res?.message);

        setTaskDetailForToday({
          parentTask: parentTaskAddedForToday,
          tasks: listsOfTasksForToday,
        })

        setLoading(false);
        setDisabled(false);
        setTasks(listsOfTasksForToday?.reverse());
        clearAllInputs();
        setTaskId("");

      } catch (error) {
        console.log(error);
        setLoading(false);
        setDisabled(false);
      }

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while trying to add your work log. Please try again later')
      setLoading(false);
      setDisabled(false);
    }
  }

  const addTaskForToday = async (startTime, endTime, task, details, updateTask = false) => {

    setLoading(true);
    setDisabled(true);


    // fetching time from dowell clock to prevent manipulation by changing system date/time
    try {
      const data = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
      const dowellClockResponse = (await getCurrentTimeFromDowell(data)).data;

      makeAPICallToAddTasks(
        dowellClockResponse?.current_time,
        startTime,
        endTime,
        task,
        updateTask
      );

    } catch (error) {
      console.log('Fetching time from dowell failed', error);
      toast.error('An error occurred while trying to determine your current time. Please try adding later.')

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
      toast.error('Something went wrong while trying to submit your work logs. Please try again later')
      setSavingLoading(false);
    }
  }

  const handleSelectSubprojectFromListing = (subprojectPassed, projectPassed, idPassed) => {
    setSubprojectSelected(subprojectPassed);
    setoptionValue(projectPassed);

    const taskNamewithAtCharStripped = taskName.split('@')[0];
    setTaskName(taskNamewithAtCharStripped.concat(`<@${subprojectPassed}~${projectPassed}~${idPassed}!> `));

    textareaRef?.current?.el?.current?.focus();
  }

  const handleCancelSubprojectSelection = () => {
    const [startIndex, endIndex] = [taskName.indexOf('<p><span'), taskName.indexOf('</span></p>')];
    setSubprojectSelected(null);
    setoptionValue('');
    setTaskName(taskName.replace(`${taskName.substring(startIndex, endIndex + 11)}`, '@'))
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

  const handleNotesButtonClick = () => {
    setNotesOverlayVisibility(true);
  };

  const closeModal = () => {
    setNotesOverlayVisibility(false);
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
              <p>Done uploading work logs for today?</p>

              <div className="task__Today__Submit__Wrapper">
                <img src={taskImg} alt="task illustration" />
                <p>You can submit all your work logs for today now or later if you would like to continue on updating later today.<br /><br />Please read and note the following:</p>
                <ul>
                  <li>If you choose <b>Submit later</b>, you can always come back anytime <b>today</b> and make changes</li>
                  <li>If you choose <b>Submit now</b>, you will <b>not</b> be able to make <b>any more updates today</b></li>
                  <li><b>Do not click</b> on <b>Submit now</b> if you still have other work logs to submit for today</li>
                  <li>If you forget to submit your task for the day, do not worry, all your work logs are saved </li>
                </ul>
              </div>
              <div className="buttons__Wrapper">
                <button
                  type={"button"}
                  className="add__Task__Btn cancel__Btn"
                  disabled={savingLoading}
                  onClick={() => {
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
                  {
                    showInfoModal ? <>Quick note</>
                      :
                      showTaskForm ? (
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
                              "Edit Work log"
                              :
                              taskDetailForTodayLoading ? "Loading" :
                                taskDetailForToday?.parentTask?.task_saved ?
                                  "View Work log Details"
                                  :
                                  "New Work log Details"
                          }
                        </>
                      ) : (
                        <>Add new work log</>
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
                {!taskDetailForTodayLoading && (<div className="Information_notes_subprojects">

                  <button
                    type={"button"}
                    className="Information_notes_subprojects_button"
                    onClick={handleNotesButtonClick}
                  >
                    <HiLightBulb fontSize={"1rem"} />Notes</button>

                  {notesOverlayVisibility && (
                    <Overlay>
                      <div className="overlay_main_div">
                        <div className="notes_overlay_div">
                          <AiOutlineClose onClick={closeModal} fontSize={"1.2rem"} cursor={'pointer'} />
                          <p>
                            <b>Notes</b><br />
                            When uploading a log, the following things are necessary:<br />
                            <ul className="log__Notess">
                              <li>You are to upload <b>20/40 hours</b> of logs weekly according to your designation</li>
                              <li>Log addition ends at <b>11:30 PM</b> or <b>23.30</b> everyday</li>
                              <li>Logs entered must have <b>at least 5 words</b> and <b>25 characters</b></li>
                              <li>Logs entered must be <b>unique</b> for that day</li>
                              <li>Logs entered must have a <b>maximum time difference</b> of <b>15mins</b> or <b>30mins</b> according to your designation</li>
                            </ul>
                          </p>
                        </div>
                      </div>
                    </Overlay>
                  )}
                  
                 <Link
                    to={'https://sc9rhp.csb.app/'}
                    target="_blank"
                    className="Information_notes_subprojects_button"
                  >
                    <GoTasklist fontSize={"1rem"} fontWeight={"400"}/>Subproject Info
                  </Link>
                </div>)}
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
                {
                  showInfoModal ?
                    (
                      taskDetailForTodayLoading ? <></> :
                        <>
                          <p className="info__Work__Log">
                            <span>You are to enter <b>80/160 work logs</b> per week according to your role/designation</span>
                          </p>
                          <p className="info__Work__Log">
                            The maximum duration of one work log is <b>15 or 30 minutes</b>, depending on your designation. You can add work logs spanning between <b>1</b> to <b>30</b> minutes, and your total should be <b>20/40 hours</b> in a week
                          </p>
                          <br />
                          <p className="info__Work__Log"><b>These are some examples of work logs:</b></p>
                          <ol className="example__info__Work__Log">
                            <li>Attending meeting and discussed xxxxxxx</li>
                            <li>Attending meeting and presented topic xxxxxx</li>
                            <li>Conducted discussions on xxxx</li>
                            <li>Coding for task xxxx</li>
                            <li>Testing product xxxxx for xxxxx</li>
                          </ol>
                          <button
                            type={"button"}
                            className="add__Task__Btn"
                            onClick={() => {
                              setShowInfoModal(false)
                              localStorage.setItem('log_info_shown', true)
                            }
                            }
                          >
                            {"Proceed"}
                          </button>
                        </>
                    ) :
                    showTaskForm ? (
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
                              {
                                isCreatingTask ?
                                  <>
                                    <div className="task__Item">
                                      <span className="selectProject">Add Log Image (OPTIONAL)</span>
                                      <input
                                        type={"file"}
                                        placeholder={"add log image"}
                                        style={{ margin: 0, marginBottom: "0.8rem" }}
                                        onChange={handleFileChange}
                                      />
                                      {selectedFile && (
                                        <img
                                          src={URL.createObjectURL(selectedFile)}
                                          alt="Uploaded Preview"
                                          style={{ display: "block" }}
                                        />
                                      )}
                                    </div>
                                  </>
                                  :
                                  null
                              }
                            </>
                        }
                        {
                          taskDetailForTodayLoading ? <></> :
                            !taskDetailForToday?.parentTask?.task_saved && <div className="task__Timing__Wrapper">
                              <div className="task__Item">
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
                              <div className="task__Item">
                                <span className="selectProject">Time finished</span>
                                <input
                                  type={"time"}
                                  placeholder={"end time of task"}
                                  value={taskEndTime}
                                  style={{ margin: 0, marginBottom: "0.8rem" }}
                                  onChange={({ target }) => setTaskEndTime(target.value)}
                                  max={`${Number(
                                    new Date(
                                      new Date(
                                        `${new Date().toDateString()} ${taskStartTime}`
                                      ).getTime() +
                                      allowedTimeInterval * 60000
                                    ).getHours()
                                  ) < 10
                                    ? "0" +
                                    new Date(
                                      new Date(
                                        `${new Date().toDateString()} ${taskStartTime}`
                                      ).getTime() +
                                      allowedTimeInterval * 60000
                                    ).getHours()
                                    : new Date(
                                      new Date(
                                        `${new Date().toDateString()} ${taskStartTime}`
                                      ).getTime() +
                                      allowedTimeInterval * 60000
                                    ).getHours()
                                    }:${new Date(
                                      new Date(
                                        `${new Date().toDateString()} ${taskStartTime}`
                                      ).getTime() +
                                      allowedTimeInterval * 60000
                                    ).getMinutes()}`}
                                  readOnly={loading || !taskDetailForTodayLoaded || taskStartTime.length < 1 ? true : false}
                                />
                              </div>
                              <div className="task__Item full__Widthh">
                                <span className="selectProject">Work log</span>
                                <div className="log__Add__New__Wrapper">
                                  <textarea
                                    type={"text"}
                                    placeholder={"Work log"}
                                    value={taskName}
                                    style={{ margin: 0, marginBottom: "0rem" }}
                                    onChange={({ target }) => setTaskName(target.value)}
                                    readOnly={loading || !taskDetailForTodayLoaded ? true : false}
                                    rows={3}
                                    className="log__textarea"
                                  // cols={40}
                                  // ref={textareaRef}
                                  >
                                  </textarea>

                                  {/* <ContentEditable 
                                    html={formattedTaskName}
                                    onChange={({ target }) => setTaskName(target.value)}
                                    id="new__Log__Textarea"
                                    ref={textareaRef}
                                    disabled={loading || !taskDetailForTodayLoaded ? true : false}
                                  />
                                  {
                                    showSubprojectSelections && <div
                                      className={'log__Add__Subproject'}
                                      ref={subprojectRef}
                                    >
                                      <SubprojectSelectWithSearch
                                        subprojects={subprojects}
                                        selectedSubProject={subprojectSelected}
                                        handleSelectItem={
                                          (subproject, project, id) => handleSelectSubprojectFromListing(subproject, project, id)
                                        }
                                        handleCancelSelection={handleCancelSubprojectSelection}
                                        selectedProject={optionValue}
                                        alwaysOnDisplay={true}
                                        passedInputVal={
                                          taskName.split('@')[1] ? 
                                            taskName.split('@')[1]
                                          :
                                          ''
                                        }
                                        hideSelectionsMade={true}
                                      />
                                    </div>
                                  } */}
                                </div>
                              </div>
                              <div className="task__Item">
                                <span className="selectProject">Work log type</span>
                                <select
                                  onChange={({ target }) => setTaskType(target.value)}
                                  className="addTaskDropDown new__Task"
                                  style={{
                                    margin: 0,
                                    marginBottom: "0.8rem",
                                  }}
                                  value={taskType}
                                >
                                  <option value={""}>Select</option>
                                  {taskTypes.map((v, i) => (
                                    <option key={i} value={v}>
                                      {v}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="task__Item full__Widthh">
                                <span className="selectProject">Subproject</span>
                                <SubprojectSelectWithSearch
                                  subprojects={subprojects}
                                  selectedSubProject={subprojectSelected}
                                  handleSelectItem={(subproject, project) => {
                                    setSubprojectSelected(subproject);
                                    setoptionValue(project);
                                  }}
                                  handleCancelSelection={
                                    () => {
                                      setSubprojectSelected(null);
                                      setoptionValue('');
                                    }
                                  }
                                  selectedProject={optionValue}
                                />
                              </div>
                              {/* <div className="task__Item">
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
                        <option value={""}>Select project</option>
                        {assignedProject.map((v, i) => (
                          <option key={i} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div> */}
                              <div className="add__Btn__Task">
                                <button
                                  style={{
                                    backgroundColor: "#005734",
                                    width: 30,
                                    height: 30,
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
                                <span>Work logs have been submitted for today!</span>
                              </p>
                            }
                            <table id="customers">
                              <tr>
                                <th>S/N</th>
                                <th>Time started</th>
                                <th>Time finished</th>
                                <th>Work log</th>
                                <th>Work log Image</th>
                                <th>Work log type</th>
                                <th>sub project</th>
                                <th>project</th>
                                <th>actions</th>
                              </tr>
                              <tbody>
                                {tasks.map((task, index) => (
                                  <tr key={task._id}>
                                    <td>{tasks.length - (index)}.</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.start_time}</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.end_time}</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.task}</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.task_image ? task.task_image : 'None'}</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.task_type}</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.subproject}</td>
                                    <td className={task.is_active && task.is_active === true ? "" : "deleted"}>{task.project}</td>
                                    <td>
                                      <div className="edit__Item__Customer">
                                        {
                                          task.is_active && task.is_active === true && <button
                                            onClick={(taskDetailForToday?.parentTask?.task_saved || editLoading || deleteLoading) ? () => { } : () => getTaskId(task._id)}
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
                                          onClick={(taskDetailForToday?.parentTask?.task_saved || editLoading || deleteLoading) ? () => { } : () => deleteTask(task._id)}
                                          className="delete"
                                          data-tooltip-id={task._id + "1"}
                                          data-tooltip-content={task.is_active && task.is_active === true ? 'Delete task' : 'Retrieve task'}
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
                                              task.is_active && task.is_active === true ?
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
                                    : "Done"}
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

const taskTypes = [
  "TASK UPDATE",
  "MEETING UPDATE",
]

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
