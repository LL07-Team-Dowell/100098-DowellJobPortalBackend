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
            let [searchParams, setSearchParams] = useSearchParams();
            const applicant = searchParams.get('applicant')
            const [data ,setdata] = useState(testTasksToWorkWithForNow.filter(s => s.applicant === applicant)) ; 
            useEffect(()=>{
              setdata(testTasksToWorkWithForNow.filter(s => s.applicant === applicant)) 
            },[applicant])
            console.log("data" , data)
            const [project , setproject] = useState("") ;
            const [taskdetail , settaskdetail] = useState([]) ; 
            const [taskdetail2 , settaskdetail2] = useState([]) ; 
            const [value, onChange] = useState(new Date());

            console.log("applicant",applicant) ;
            console.log(value.toString(), "value")
            // loading 
            useEffect(()=>{
                        settaskdetail(data.filter(d => d.project === project))
            },[project , data ]);
            useEffect(()=>{
                        settaskdetail2(taskdetail.filter(d => {
                        const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
                        const calendatTime = value.toString().split(" ")[0] + " " + value.toString().split(" ")[1] + " " + value.toString().split(" ")[2] + " " +value.toString().split(" ")[3] 
                        return dateTime === calendatTime ; 
            }))
            console.log({data},{data2:data.filter(d => {
              const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
              const calendatTime = value.toString().split(" ")[0] + " " + value.toString().split(" ")[1] + " " + value.toString().split(" ")[2] + " " +value.toString().split(" ")[3] 
              return dateTime === calendatTime ; 
  })})
            },[value , taskdetail , data]);
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
            console.log({data ,taskdetail , taskdetail2 })
  return (
    <StaffJobLandingLayout hrView={true}>
            <div>
            <div>
            <TitleNavigationBar title={"Task details"}/>
            <AssignedProjectDetails showTask={true} hrAttendancePageActive={false} availableProjects={List} removeDropDownIcon={false} handleSelectionClick={e => setproject(e)} />
            {
                        // taskdetail.map((d,i)=><li key={i}>{d.task}</li>)
            }
            </div>
           

            </div>
            <div style={{display:"flex" ,gap:"2rem" }}>
             <Calendar onChange={onChange} value={value} />
             <div style={{}}>
              <h4>{getFullMonthName(value.toString())}</h4>
             <ul>{taskdetail2.length > 0 ? taskdetail2.map((d , i) => <li style={{listStyle:"none",color:"#ccc",fontWeight:400}} key={i}>{d.task}</li>) : "No Tasks Found For Today"}</ul>

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