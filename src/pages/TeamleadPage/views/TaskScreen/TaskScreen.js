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
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getCandidateTask } from "../../../../services/candidateServices";


const TaskScreen = ({ handleAddTaskBtnClick, candidateAfterSelectionScreen, handleEditBtnClick, className, assignedProject  }) => {
    const { currentUser } = useCurrentUserContext();
    const { userTasks, setUserTasks } = useCandidateTaskContext();
    const navigate = useNavigate();
    const [ tasksToShow, setTasksToShow ] = useState([]);
    const [ daysInMonth, setDaysInMonth ] = useState(0);
    const [ currentMonth, setCurrentMonth ] = useState("");
    const [ datesToStyle, setDatesToStyle ] = useState([]);

    const [project , setproject] = useState(null) ;
    const [tasksofuser , settasksofuser] = useState([]) ; 
    const [taskdetail2 , settaskdetail2] = useState([]) ; 
    const [value, onChange] = useState(new Date());

    useEffect(()=>{
        getCandidateTask(currentUser.portfolio_info[0].org_id)
        .then(resp =>{ setUserTasks(resp.data.response.data.filter(v => v.applicant === currentUser.userinfo.username));console.log('a;aaaa',resp.data.response.data ,resp.data.response.data.filter(v => v.applicant === currentUser.userinfo.username)) })
    },[]); 
    useEffect(()=>{
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        settaskdetail2(userTasks.filter(d => {
        const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
        const calendatTime = value.toString().split(" ")[0] + " " + value.toString().split(" ")[1] + " " + value.toString().split(" ")[2] + " " +value.toString().split(" ")[3] ;
        console.log({dateTime , calendatTime})
        return dateTime === calendatTime ; 
}))
},[value , userTasks , project]);

    useEffect(() => {

        if (!currentUser) return navigate(-1);
        if (userTasks.length > 0) return

        getCandidateTask(currentUser.portfolio_info[0].org_id).then(res => {
            const tasksForCurrentUser = res.data.response.data.filter(v => v.applicant === currentUser.userinfo.username);
            setUserTasks(tasksForCurrentUser);
            settaskdetail2(userTasks.filter(d => new Date(d.task_created_date).toDateString() === new Date().toLocaleDateString()))

            // setTasksToShow(tasksForCurrentUser.filter(task => new Date(task.created).toLocaleDateString() === new Date().toLocaleDateString()));
    
            const datesUserHasTask = [...new Set(tasksForCurrentUser.map(task => [ new Date(task.task_created_date) ])).values()].flat();
            setDatesToStyle(datesUserHasTask);
        }).catch(err => {
            console.log(err)
        });

        const today = new Date();

        setDaysInMonth(getDaysInMonth(today));
        setCurrentMonth(today.toLocaleDateString("en-us", {month: "long"}));

    }, [])

    useEffect(() => {

        setTasksToShow(userTasks.filter(task => new Date(task.task_created_date).toDateString() === new Date().toDateString()));
    
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
        
        // setTasksToShow(userTasks.filter(task => new Date(task.created).toDateString() === dateSelected.toDateString()));
        settaskdetail2(userTasks.filter(d => new Date(d.task_created_date).toDateString() === dateSelected.toDateString()))
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

            <AssignedProjectDetails assignedProject={project ? project : assignedProject[0]} showTask={true} availableProjects={assignedProject} removeDropDownIcon={true} handleSelectionClick={e => setproject(e)} />

            <div className="all__Tasks__Container">
                <Calendar onChange={handleDateChange}  value={value} tileClassName={tileClassName} />
                <div className="tasks__Wrapper">
                    {taskdetail2.length > 0 && <><h3 className="task__Title">Tasks</h3><br /></>}
                    <ul>{taskdetail2.length > 0 ? taskdetail2.map((d , i) => <li style={{color:"#000",fontWeight:400}} key={i}>{d.task}</li>) : "No Tasks Found For Today"}</ul>
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

{/* <div className="task__Details__Item">
    <h3 className="month__Title">{currentMonth}</h3>
    {
        tasksToShow.length === 0 ? <p className="empty__Task__Content">No tasks found for today</p> :

        React.Children.toArray(tasksToShow.map((task, index) => {
            return <CandidateTaskItem currentTask={task} taskNum={index + 1} candidatePage={candidateAfterSelectionScreen} handleEditBtnClick={() => handleEditBtnClick(task)} updateTasks={setUserTasks} />
        }))
    }
</div> */}