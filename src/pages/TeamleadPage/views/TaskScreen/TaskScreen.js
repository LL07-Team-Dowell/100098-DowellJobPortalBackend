import ApplicantIntro from "../../components/ApplicantIntro/ApplicantIntro";
import AssignedProjectDetails from "../../components/AssignedProjectDetails/AssignedProjectDetails";
import CustomHr from "../../components/CustomHr/CustomHr";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CandidateTaskItem from "../../components/CandidateTaskItem/CandidateTaskItem";
import React, { useEffect, useState } from "react";
import "./style.css";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCandidateTaskContext } from "../../../../contexts/CandidateTasksContext";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatDateAndTime, formatDateForAPI, getDaysInMonth } from "../../../../helpers/helpers";
import { differenceInCalendarDays } from "date-fns";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getCandidateTask, getCandidateTasksOfTheDayV2 } from "../../../../services/candidateServices";
import styled from "styled-components";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../CreateMembersTask/component/Navbar";
import { getSettingUserProject } from "../../../../services/hrServices";
import { getCandidateTasksV2 } from "../../../../services/teamleadServices";
import { extractNewTasksAndAddExtraDetail } from "../../util/extractNewTasks";
import Button from "../../../AdminPage/components/Button/Button";
import { toast } from "react-toastify";
import SubprojectSelectWithSearch from "../../../../components/SubprojectSelectWithSearch/SubprojectSelectWithSearch";
import { getAllCompanyUserSubProject } from "../../../../services/commonServices";
import { AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import RequestTask from "./components/RequestTask";

const TaskScreen = ({
  handleAddTaskBtnClick,
  candidateAfterSelectionScreen,
  handleEditBtnClick,
  className,
  assignedProject,
  showBackBtn,
  loadProjects,
  isGrouplead,
}) => {
  const { currentUser } = useCurrentUserContext();
  const { userTasks, setUserTasks } = useCandidateTaskContext();
  const navigate = useNavigate();
  // const [tasksToShow, setTasksToShow] = useState([]);
  // const [daysInMonth, setDaysInMonth] = useState(0);
  // const [currentMonth, setCurrentMonth] = useState("");
  const [datesToStyle, setDatesToStyle] = useState([]);

  const [project, setproject] = useState(null);
  console.log(project);
  // const [tasksofuser, settasksofuser] = useState([]);
  const [taskdetail2, settaskdetail2] = useState([]);
  const [value, setValue] = useState(new Date());
  const [value1, setValue1] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [singleTaskLoading, setSingleTaskLoading] = useState(false);
  const [tasksForTheDay, setTasksForTheDay] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [params, setParams] = useSearchParams();
  const [tasksForProjectLoading, setTasksForProjectLoading] = useState(false);
  const [allSubProjects, setAllSubprojects] = useState([]);
  const [subprojectSelected, setSubprojectSelected] = useState('');
  const [showSubprojectSelection, setShowSubprojectSelection] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentDate = new Date();
  console.log(currentDate);
  const dateToCompare = new Date(value1);
  const isToday = (
    dateToCompare.getDate() === currentDate.getDate() &&
    dateToCompare.getMonth() === currentDate.getMonth() &&
    dateToCompare.getFullYear() === currentDate.getFullYear()
  );
  console.log({ isToday });

  const checkIfToday = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
  }

  useEffect(() => {
    setLoading(true);
    setproject(assignedProject[0]);
    setValue1(new Date());
    setDatesToStyle([]);
    setTasksForTheDay(null);

    const dateFormattedForAPI = formatDateForAPI(new Date());
    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "user_id": currentUser.userinfo.userID,
      "data_type": currentUser.portfolio_info[0].data_type,
      "task_created_date": dateFormattedForAPI,
    }

    Promise.all([
      // getCandidateTask(currentUser.portfolio_info[0].org_id),
      getCandidateTasksOfTheDayV2(dataToPost),
      getAllCompanyUserSubProject(currentUser.portfolio_info[0].org_id, currentUser.portfolio_info[0].data_type),
      loadProjects && getSettingUserProject(),
    ]).then(res => {
      // setUserTasks(
      //   res[0]?.data?.response?.data?.filter(
      //     (v) => v.applicant === currentUser.userinfo.username
      //   )
      // );
      setUserTasks(
        res[0]?.data?.task_details
      );
      setLoading(false);
      setAllSubprojects(res[1]);

      if (loadProjects) {
        const list = res[2]?.data
          ?.filter(
            (project) =>
              project?.data_type === currentUser.portfolio_info[0].data_type &&
              project?.company_id === currentUser.portfolio_info[0].org_id &&
              project.project_list &&
              project.project_list.every(
                (listing) => typeof listing === "string"
              )
          ).reverse();

        setAllProjects(
          list.length < 1 ? []
            :
            list[0]?.project_list
        )

        list.length > 0 && setproject(list[0]?.project_list[0]);
      }
    }).catch(err => {
      setLoading(false);
    })

  }, []);

  useEffect(() => {
    // settaskdetail2(
    //   userTasks.filter((d) => {
    //     const dateTime =
    //       d.task_created_date.split(" ")[0] +
    //       " " +
    //       d.task_created_date.split(" ")[1] +
    //       " " +
    //       d.task_created_date.split(" ")[2] +
    //       " " +
    //       d.task_created_date.split(" ")[3];
    //     const calendatTime =
    //       value.toString().split(" ")[0] +
    //       " " +
    //       value.toString().split(" ")[1] +
    //       " " +
    //       value.toString().split(" ")[2] +
    //       " " +
    //       value.toString().split(" ")[3];
    //     console.log({ dateTime, calendatTime });
    //     return dateTime === calendatTime;
    //   })
    // );
    
    settaskdetail2(
      userTasks.filter((d) => 
        formatDateForAPI(d.task_created_date) ===
        formatDateForAPI(value)
      )
    );
  }, [value, userTasks]);

  useEffect(() => {
    if (!project || tasksForProjectLoading) {
      setTasksForTheDay(null);
      setDatesToStyle([]);
      setSubprojectSelected('');
      return;
    }

    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "data_type": currentUser.portfolio_info[0].data_type,
      "project": project,
    }

    setTasksForProjectLoading(true);
    setSubprojectSelected('');
    setValue1(new Date());

    const previousTasks = userTasks.filter(t => !t.task && !t.user_id && t.project);

    getCandidateTasksV2(dataToPost).then(res => {
      setTasksForProjectLoading(false);
      const foundTasksForCandidate = extractNewTasksAndAddExtraDetail(res.data.task_details, res.data.task)?.filter(item => item.user_id === currentUser.userinfo.userID && item.project === project);

      const projectsMatching = [
        ...previousTasks.filter(
          (task) => task?.project === project
        ),
        ...foundTasksForCandidate
      ]
      console.log(projectsMatching);
      const datesUserHasTaskForProject = [
        ...new Set(
          projectsMatching.map((task) => [new Date(task.task_created_date)])
        ).values(),
      ].flat();
      setDatesToStyle(datesUserHasTaskForProject);

      settaskdetail2(
        projectsMatching.filter(item => 
          formatDateForAPI(item.task_created_date) === formatDateForAPI(value)
        )
      );
    }).catch(err => {
      console.log(err);
      setTasksForProjectLoading(false);
    })
  }, [project]);

  // useEffect(() => {
  //   if (!currentUser) return navigate(-1);
  //   if (userTasks.length > 0) return;

  //   setproject(assignedProject[0]);

  //   getCandidateTask(currentUser.portfolio_info[0].org_id)
  //     .then((res) => {
  //       const tasksForCurrentUser = res.data.response.data.filter(
  //         (v) => v.applicant === currentUser.userinfo.username
  //       );
  //       setUserTasks(tasksForCurrentUser);
  //       settaskdetail2(
  //         userTasks.filter(
  //           (d) =>
  //             new Date(d.task_created_date).toDateString() ===
  //             new Date().toLocaleDateString()
  //         )
  //       );

  //       // setTasksToShow(tasksForCurrentUser.filter(task => new Date(task.created).toLocaleDateString() === new Date().toLocaleDateString()));

  //       const datesUserHasTask = [
  //         ...new Set(
  //           tasksForCurrentUser.map((task) => [
  //             new Date(task.task_created_date),
  //           ])
  //         ).values(),
  //       ].flat();
  //       setDatesToStyle(datesUserHasTask);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   const today = new Date();

  //   setDaysInMonth(getDaysInMonth(today));
  //   setCurrentMonth(today.toLocaleDateString("en-us", { month: "long" }));
  // }, []);

  // useEffect(() => {
  //   setTasksToShow(
  //     userTasks.filter(
  //       (task) =>
  //         formatDateForAPI(task.task_created_date) ===
  //         formatDateForAPI(new Date())
  //     )
  //   );
  // }, [userTasks]);

  useEffect(() => {
    const tab = params.get('tab');
    if (!tab || tab === 'pending') return setPanding(true);

    setPanding(false);
  }, [params])

  const isSameDay = (a, b) => differenceInCalendarDays(a, b) === 0;

  const tileClassName = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (tasksForProjectLoading) return ''
      if (datesToStyle.find((dDate) => formatDateForAPI(dDate) === formatDateForAPI(date))) {
        return "task__Indicator";
      }
    }
  };

  const handleDateChange = async (dateSelected) => {
    // setDaysInMonth(getDaysInMonth(dateSelected));
    setValue1(new Date(dateSelected))
    // setTasksToShow(userTasks.filter(task => new Date(task.created).toDateString() === dateSelected.toDateString()));
    settaskdetail2(
      userTasks.filter(
        (d) =>
          formatDateForAPI(d.task_created_date) ===
          formatDateForAPI(new Date(dateSelected))
      )
    );

    // setCurrentMonth(
    //   new Date(dateSelected).toLocaleDateString("en-us", { month: "long" })
    // );

    setSingleTaskLoading(true);
    setTasksForTheDay(null);

    // const date = new Date(dateSelected);
    // const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    // const dateFormattedForAPI = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    const dateFormattedForAPI = formatDateForAPI(dateSelected);
    const dataToPost = {
      "company_id": currentUser.portfolio_info[0].org_id,
      "user_id": currentUser.userinfo.userID,
      "data_type": currentUser.portfolio_info[0].data_type,
      "task_created_date": dateFormattedForAPI,
    }

    try {
      const res = (await getCandidateTasksOfTheDayV2(dataToPost)).data;

      const foundApplicantTaskItemForTheDay = res.task_details.find(task => task.applicant === currentUser.userinfo.username && task.task_created_date === dateFormattedForAPI);
      if (foundApplicantTaskItemForTheDay && res.task.length > 0) {
        setTasksForTheDay(res.task.filter(task => task.task_id === foundApplicantTaskItemForTheDay?._id));
      }
      setSingleTaskLoading(false);
    } catch (error) {
      console.log(error);
      setSingleTaskLoading(false);
    }

  };

  const Wrappen = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 2rem;
    padding-top: 30px;
    flex-direction: row;
    width: 32%;
    margin-right: auto;
    margin-left: auto;
    position: reletive;

    

    a {
      border-radius: 10px;
      background: #f3f8f4;
      color: #b8b8b8;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      font-size: 1rem;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.01em;
      cursor: pointer;
      width: 10rem;
      height: 3rem;
      transition: 0.3s ease-in-out;
      text-align: center;
    }
    .link-isActive {
      background: #005734;
      box-shadow: 0px 2.79922px 25px rgba(0, 87, 52, 0.67);
      color: #fff;
    }

    .main{
      padding: 1.5rem;
      box-shadow: 0px 2.79922px 25px rgba(0, 87, 52, 0.67);
   
    }

    input{
      width: 400px;
      padding: 0.5rem 0.2rem;
      font-size: 1rem;
    }

    textarea{
      width:400px;
      font-family: poppins;
      font-size: 1rem;
    }

    .buttons{
      width: 150px;
      display: flex;
      justify-content: space-between;

      button{
        padding: 0.5rem;
        font-size: 1rem;
      }
    }


    @media only screen and (max-width: 1000px) {
      width: 90%;

      a{
        font-size: 0.8rem;
      }

      

    }

  `;

  const [panding, setPanding] = useState(true);
  const clickToPandingApproval = () => {
    setPanding(true);
  };

  const clickToApproved = () => {
    setPanding(false);
  };

  const [updatetaskdate, setUpdateTaskDate] = useState("");
  console.log({ "updatetaskdate": updatetaskdate });
  // const [description, setDescription] = useState("");
  // const [formData, setFormData] = useState({
  //   updatetaskdate: "",
  //   description: "",
  //   project: ""
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // };

  const handleRequestTaskUpdateBtnClick = async (value1) => {
    const currentDate = value1;
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(currentDate.getFullYear()).slice(2);
    const formattedDate = `${day}/${month}/${year}`;
    setUpdateTaskDate(formattedDate)
    setShowModal(true);
  }

  return (
    <>
      {
        showBackBtn && <>
          <Navbar
            title={'Your tasks'}
            removeButton={true}
          />
        </>
      }
      {showModal ? <Wrappen>
        <RequestTask project={project} updatetaskdate={updatetaskdate} setShowModal={setShowModal} />
      </Wrappen > : <>
        <Wrappen>
          <NavLink
            className={`${panding ? "link-isActive" : "link-notactive"}`}
            to={
              isGrouplead ?
                "/user-tasks?tab=pending"
                :
                "/task?tab=pending"
            }
            onClick={clickToPandingApproval}
          >
            Pending Approval
          </NavLink>
          <NavLink
            className={`${panding ? "link-notactive" : "link-isActive"}`}
            to={
              isGrouplead ?
                "/user-tasks?tab=approval"
                :
                "/task?tab=approval"
            }
            onClick={clickToApproved}
          >
            Approved
          </NavLink>
        </Wrappen>

        <div
          className={`candidate-task-screen-container ${className ? className : ""
            }`}
        >
          {!candidateAfterSelectionScreen && (
            <>
              <ApplicantIntro showTask={true} applicant={currentUser.username} />

              <CustomHr />
            </>
          )}

          <AssignedProjectDetails
            assignedProject={
              project
              // ? 
              // project
              // :
              // loadProjects ?
              //   allProjects[0]
              //   :
              //   assignedProject[0]
            }
            showTask={true}
            availableProjects={
              loadProjects ?
                allProjects
                :
                assignedProject
            }
            removeDropDownIcon={false}
            handleSelectionClick={(e) => setproject(e)}
          />

          <div className="subproject__Div__Wrapper">
            <div className="subproject__Div">
              <span style={{ fontFamily: 'Poppins', fontSize: '0.9rem' }}>Subproject</span>
              <div className="subproject__Custom__Select">
                <div
                  className="select_"
                  onClick={
                    subprojectSelected.length < 1 ?
                      () => setShowSubprojectSelection(!showSubprojectSelection)
                      :
                      () => { }
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
                    subprojects={allSubProjects.filter(item => item.parent_project === project)}
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
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Calendar
                  onChange={handleDateChange}
                  value={value}
                  tileClassName={tileClassName}
                />
                <div className="tasks__Wrapper">
                  {
                    tasksForProjectLoading ? <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <LoadingSpinner
                          width={'16px'}
                          height={'16px'}
                        />
                        <p className="task__Title" style={{ margin: 0 }}>Filtering tasks...</p>
                      </div>
                    </> :
                      singleTaskLoading ? <>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <LoadingSpinner
                            width={'16px'}
                            height={'16px'}
                          />
                          <p className="task__Title" style={{ margin: 0 }}>Loading tasks...</p>
                        </div>

                      </> :
                        <>
                          {taskdetail2.length > 0 && (
                            <>
                              <p className="task__Title">Tasks Added</p>
                            </>
                          )}
                          <ul>
                            {
                              taskdetail2.length > 0 ?
                                tasksForTheDay && Array.isArray(tasksForTheDay) ?
                                  tasksForTheDay.filter(task => task.project === project && task.is_active && task.is_active === true).length < 1 ? <>
                                    <p className="task__Title">{!project ? "No project selected" : "No tasks found for today"}</p>

                                    {
                                      project && value1 < new Date() && !checkIfToday(new Date(), value1) &&
                                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 12 }}>
                                        <Button
                                          text={"Request to update"}
                                          className={'approve__Task__Btn'}
                                          handleClick={() => handleRequestTaskUpdateBtnClick(value1)}
                                        />
                                      </div>
                                    }
                                    {/* {
                                  project &&  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {
                                      isToday ? "" : <Button
                                        text={"Request to update"}
                                        className={'approve__Task__Btn'}
                                      />
                                    }
                                  </div>
                                } */}
                                  </> :
                                    <>
                                      {
                                        subprojectSelected.length > 0 ?
                                          tasksForTheDay.filter(task => task.project === project && task.subproject === subprojectSelected && task.is_active && task.is_active === true).length < 1 ?
                                            <p style={{ fontSize: '0.75rem' }}>
                                              No tasks found matching subproject of <b>{subprojectSelected}</b> under the <b>{project}</b> project
                                            </p>
                                            :
                                            React.Children.toArray(tasksForTheDay.filter(task => task.project === project && task.subproject === subprojectSelected && task.is_active && task.is_active === true).map(task => {
                                              return <div style={{ color: "#000", fontWeight: 500, fontSize: "1rem" }}>
                                                {new Date(task.task_created_date).toLocaleString(
                                                  "default",
                                                  { month: "long" }
                                                )}
                                                <p style={{ display: "inline", marginLeft: "0.2rem" }}>{formatDateForAPI(task.task_created_date, 'day-only')}</p>

                                                <p style={{ display: "inline", marginLeft: "0.7rem", fontSize: "0.9rem" }}>
                                                  {task.task} <span style={{ color: "#B8B8B8" }}> from {task.start_time} to {task.end_time}</span>
                                                </p>
                                              </div>
                                            }))
                                          :
                                          React.Children.toArray(tasksForTheDay.filter(task => task.project === project && task.is_active && task.is_active === true).map(task => {
                                            return <div style={{ color: "#000", fontWeight: 500, fontSize: "1rem" }}>
                                              {new Date(task.task_created_date).toLocaleString(
                                                "default",
                                                { month: "long" }
                                              )}
                                              <p style={{ display: "inline", marginLeft: "0.2rem" }}>{formatDateForAPI(task.task_created_date, 'day-only')}</p>

                                              <p style={{ display: "inline", marginLeft: "0.7rem", fontSize: "0.9rem" }}>
                                                {task.task} <span style={{ color: "#B8B8B8" }}> from {task.start_time} to {task.end_time}</span>
                                              </p>
                                            </div>
                                          }))
                                      }
                                    </>
                                  :

                                  taskdetail2.map((d, i) => (
                                    <div style={{ color: "#000", fontWeight: 500, fontSize: "1rem" }} key={i}>
                                      {new Date(d.task_created_date).toLocaleString(
                                        "default",
                                        { month: "long" }
                                      )}
                                      <p style={{ display: "inline", marginLeft: "0.2rem" }}>{formatDateForAPI(d.task_created_date, 'day-only')}</p>

                                      <p style={{ display: "inline", marginLeft: "0.7rem", fontSize: "0.9rem" }}>
                                        {d.task}
                                      </p>
                                    </div>
                                  ))
                                :
                                <>
                                  <p className="task__Title">{!project ? "No project selected" : "No tasks found for today"}</p>
                                  {
                                    project && value1 < new Date() && !checkIfToday(new Date(), value1) &&
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 12 }}>
                                      <Button
                                        text={"Request to update"}
                                        className={'approve__Task__Btn'}
                                        handleClick={() => handleRequestTaskUpdateBtnClick(value1)}
                                      />
                                    </div>
                                  }
                                  {/* {
                              !project ? 
                              <p className="task__Title">{"No project selected"}</p>
                              :
                              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {
                                  isToday ? "" : <Button
                                    text={"Request UpdateTask"}
                                    className={'approve__Task__Btn'}
                                  />
                                }

                                {console.log({ task: taskdetail2 })}
                              </div>
                            } */}
                                </>
                            }
                          </ul>
                        </>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </>
      }
    </>
  );
};

export default TaskScreen;
