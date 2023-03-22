import React , {useState , useEffect} from 'react' ; 
import axios from 'axios';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { testTasksToWorkWithForNow } from '../../../../utils/testData' ;
import Calendar from 'react-calendar';
import TitleNavigationBar from '../../../../components/TitleNavigationBar/TitleNavigationBar.js'
import AssignedProjectDetails from '../../../../pages/TeamleadPage/components/AssignedProjectDetails/AssignedProjectDetails.js' ;
import TaskScreen from '../../../TeamleadPage/views/TaskScreen/TaskScreen.js';
import {useSearchParams} from 'react-router-dom'
const HrTasks = () => {
            const [data ,setdata] = useState(testTasksToWorkWithForNow) ; 
            const [project , setproject] = useState("") ;
            const [taskdetail , settaskdetail] = useState([]) ; 
            const [taskdetail2 , settaskdetail2] = useState([]) ; 
            const [value, onChange] = useState(new Date());
            let [searchParams, setSearchParams] = useSearchParams();
            const name = searchParams.get('name')
            console.log("name",name) ;
            console.log(value.toString(), "value")
            // loading 
            useEffect(()=>{
                        settaskdetail(data.filter(d => d.project === project))
            },[project]);
            useEffect(()=>{
                        settaskdetail2(data.filter(d => {
                        const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
                        const calendatTime = value.toString().split(" ")[0] + " " + value.toString().split(" ")[1] + " " + value.toString().split(" ")[2] + " " +value.toString().split(" ")[3] 
                        return dateTime === calendatTime ; 
            }))
            },[value]);
            console.log("dataaa",Array.from(new Set(data)))
            console.log("project",project) ;
            const List = Array.from(new Set(data.map(d => d.project))) ; 
            console.log("LIST",List)
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
  return (
    <StaffJobLandingLayout hrView={true}>
            <div>
            <div>
            <TitleNavigationBar title={"Task details"}/>
            <AssignedProjectDetails showTask={true} hrAttendancePageActive={false} availableProjects={List} removeDropDownIcon={false} handleSelectionClick={e => setproject(e)} />
            {
                        taskdetail.map((d,i)=><li key={i}>{d.task}</li>)
            }
            </div>
           

            </div>
            <div style={{display:"flex" ,gap:"2rem" }}>
             <Calendar onChange={onChange} value={value} />
             <div style={{}}>
              <h4>{getFullMonthName(value.toString())}</h4>
             <ul>{taskdetail2.length > 0 ? taskdetail2.map((d , i) => <li key={i}>{d.task}</li>) : "No Tasks Found For Today"}</ul>

             </div>
             </div>
    </StaffJobLandingLayout>
  )
}

export default HrTasks
            // console.log(taskdetail2 , "settaskdetail2")
            // console.log(taskdetail , project)
                                    // d.task_created_date.split(" ") === value.toString() ;

                        // console.log(dateTime , "dateTime") ;
                        // console.log(calendatTime , "calendatTime")