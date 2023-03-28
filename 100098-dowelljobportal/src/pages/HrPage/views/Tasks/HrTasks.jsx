import React , {useState , useEffect} from 'react' ; 
import axios from 'axios';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { testTasksToWorkWithForNow } from '../../../../utils/testData' ;
import Calendar from 'react-calendar';
import TitleNavigationBar from '../../../../components/TitleNavigationBar/TitleNavigationBar.js'
import AssignedProjectDetails from '../../../../pages/TeamleadPage/components/AssignedProjectDetails/AssignedProjectDetails.js' ;
import TaskScreen from '../../../TeamleadPage/views/TaskScreen/TaskScreen.js';
import {useSearchParams} from 'react-router-dom'
import { fetchCandidateTasks } from '../../../../services/commonServices'; 
import './index.scss'
import { differenceInCalendarDays } from 'date-fns';

const HrTasks = () => {
            // searchParams
            let [searchParams, setSearchParams] = useSearchParams();
            const applicant = searchParams.get('applicant') ; 
            
            // states
            const [data ,setdata] = useState(testTasksToWorkWithForNow.filter(s => s.applicant === applicant)) ; 
            const [project , setproject] = useState("") ;
            const [taskdetail , settaskdetail] = useState([]) ; 
            const [taskdetail2 , settaskdetail2] = useState([]) ; 
            const [value, onChange] = useState(new Date());
            const [ datesToStyle, setDatesToStyle ] = useState([]);
            const [noApplicant , setnoApplicant] = useState(false) ; 
            // List 
            const List = Array.from(new Set(data.map(d => d.project))) ; 
            useEffect(()=>{
              if(data.length < 1  ){
                  setnoApplicant(true) ;
              }else{
                setnoApplicant(false) ;
              }
            },[applicant , data]) ; 
            
            useEffect(()=>{
              setdata(testTasksToWorkWithForNow.filter(s => s.applicant === applicant)) 
            },[applicant])

            useEffect(()=>{
                        const newdata = data.filter(d => d.project === project) ; 
                        settaskdetail(newdata) ;
                        const datesUserHasTask = [...new Set(data.map(task => [ new Date(task.task_created_date) ])).values()].flat();
                        console.log({datesUserHasTask})
                        setDatesToStyle(datesUserHasTask) ; 
                      },[project , data ]);

            useEffect(()=>{
                        settaskdetail2(taskdetail.filter(d => {
                        const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
                        const calendatTime = value.toString().split(" ")[0] + " " + value.toString().split(" ")[1] + " " + value.toString().split(" ")[2] + " " +value.toString().split(" ")[3] 
                        return dateTime === calendatTime ; 
            }))
            },[value , taskdetail , data]);

            function getFullMonthName(dateString) {
              const date = new Date(dateString);
              const monthIndex = date.getMonth();
              const months = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
              ];
              const fullMonthName = months[monthIndex];
              return fullMonthName;
            }

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
  return (
    <StaffJobLandingLayout hrView={true}>
           {
            noApplicant ? <>NO Applicant</> 
            :
            <>
            <div>
            <div style={{marginTop:40}}>
            <TitleNavigationBar title={"Task details"}/>
            <AssignedProjectDetails  assignedProject={List[0] ? List[0] : ""} showTask={true} hrAttendancePageActive={false} availableProjects={List} removeDropDownIcon={false} handleSelectionClick={e => setproject(e)} />
            
            </div>
           

            </div>
            <div style={{display:"flex" ,gap:"2rem", marginLeft:100 ,  }}>
             <Calendar onChange={onChange} value={value}  tileClassName={tileClassName}  />
             <div style={{}}>
              <h4>{getFullMonthName(value.toString())}</h4>
             <ul>{taskdetail2.length > 0 ? taskdetail2.map((d , i) => <li style={{listStyle:"none",color:"#ccc",fontWeight:400}} key={i}>{d.task}</li>) : "No Tasks Found For Today"}</ul>

             </div>
             </div>
             </>
           }
    </StaffJobLandingLayout>
  )
}

export default HrTasks
            // console.log(taskdetail2 , "settaskdetail2")
            // console.log(taskdetail , project)
                                    // d.task_created_date.split(" ") === value.toString() ;

                        // console.log(dateTime , "dateTime") ;
                        // console.log(calendatTime , "calendatTime")
                        {
                          // taskdetail.map((d,i)=><li key={i}>{d.task}</li>)
              }