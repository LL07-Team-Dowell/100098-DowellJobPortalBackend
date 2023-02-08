import ApplicantIntro from "../../components/ApplicantIntro/ApplicantIntro";
import AssignedProjectDetails from "../../components/AssignedProjectDetails/AssignedProjectDetails";
import CustomHr from "../../components/CustomHr/CustomHr";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CandidateTaskItem from "../../components/CandidateTaskItem/CandidateTaskItem";
import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useCandidateTaskContext } from "../../../../contexts/CandidateTasksContext";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { getDaysInMonth } from "../../../../helpers/helpers";
import { differenceInCalendarDays } from 'date-fns';
import { fetchCandidateTasks } from "../../../../services/commonServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";


const TaskScreen = ({ handleAddTaskBtnClick, candidateAfterSelectionScreen, handleEditBtnClick, className, assignedProject }) => {
    const { currentUser } = useCurrentUserContext();
    const { userTasks, setUserTasks } = useCandidateTaskContext();
    const navigate = useNavigate();
    const [ tasksToShow, setTasksToShow ] = useState([]);
    const [ daysInMonth, setDaysInMonth ] = useState(0);
    const [ currentMonth, setCurrentMonth ] = useState("");
    const [ datesToStyle, setDatesToStyle ] = useState([]);

    useEffect(() => {

        if (!currentUser) return navigate(-1);

        fetchCandidateTasks().then(response => {
            const tasksForCurrentUser = response.data.filter(task => task.user === currentUser.username).reverse();
            setUserTasks(tasksForCurrentUser);
            setTasksToShow(tasksForCurrentUser.filter(task => new Date(task.created).toLocaleDateString() === new Date().toLocaleDateString()));
    
            const datesUserHasTask = [...new Set(tasksForCurrentUser.map(task => [ new Date(task.created) ])).values()].flat();
            setDatesToStyle(datesUserHasTask);
        }).catch(err => {
            console.log(err)
        });

        const today = new Date();

        setDaysInMonth(getDaysInMonth(today));
        setCurrentMonth(today.toLocaleDateString("en-us", {month: "long"}));

    }, [])

    useEffect(() => {

        setTasksToShow(userTasks.filter(task => new Date(task.created).toDateString() === new Date().toDateString()));
    
    }, [userTasks])

    const isSameDay = (a, b) => differenceInCalendarDays(a, b) === 0;

    const tileClassName = ({ date, view }) => {
        // Add class to tiles in month view only
        if (view === 'month') {
            // Check if a date React-Calendar wants to check is on the list of dates to add class to
            if (datesToStyle.find(dDate => isSameDay(dDate, date))) {
                return 'task__Indicator';
            }
        }
    }
    
    const handleDateChange = (dateSelected) => {

        setDaysInMonth(getDaysInMonth(dateSelected));
        
        setTasksToShow(userTasks.filter(task => new Date(task.created).toDateString() === dateSelected.toDateString()));
        setCurrentMonth(dateSelected.toLocaleDateString("en-us", {month: "long"}));

        console.log(daysInMonth)
    }

    return <>
        <div className={`candidate-task-screen-container ${className ? className : ''}`}>
            
            { 
                !candidateAfterSelectionScreen &&
                <>
                    <ApplicantIntro showTask={true} applicant={currentUser.username} />

                    <CustomHr />
                </>
            }

            <AssignedProjectDetails showTask={true} availableProjects={null} removeDropDownIcon={true} assignedProject={assignedProject} />

            <div className="all__Tasks__Container">
                <Calendar onChange={handleDateChange} tileClassName={tileClassName} />
                
                <div className="task__Details__Item">
                    <h3 className="month__Title">{currentMonth}</h3>
                    {
                        tasksToShow.length === 0 ? <p className="empty__Task__Content">No tasks found for today</p> :

                        React.Children.toArray(tasksToShow.map((task, index) => {
                            return <CandidateTaskItem currentTask={task} taskNum={index + 1} candidatePage={candidateAfterSelectionScreen} handleEditBtnClick={() => handleEditBtnClick(task)} updateTasks={setUserTasks} />
                        }))
                    }
                </div>

            </div>

            <div className="add-task-btn" onClick={handleAddTaskBtnClick}>
                <span>Add</span>
                <AddCircleOutlineIcon />
            </div>

        </div>
    </>

}

export default TaskScreen;
