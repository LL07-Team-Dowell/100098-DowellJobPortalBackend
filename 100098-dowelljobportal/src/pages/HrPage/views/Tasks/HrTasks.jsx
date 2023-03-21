import React , {useState , ue, useEffect} from 'react' ; 
import axios from 'axios';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { testTasksToWorkWithForNow } from '../../../../utils/testData' ;
import Calendar from 'react-calendar';
const HrTasks = () => {
            const [data ,setdata] = useState(testTasksToWorkWithForNow) ; 
            const [project , setproject] = useState("") ;
            const [taskdetail , settaskdetail] = useState([]) ; 
            const [taskdetail2 , settaskdetail2] = useState([]) ; 
            const [value, onChange] = useState(new Date());
            console.log(value.toString(), "value")
            // loading 
            useEffect(()=>{
                        settaskdetail(data.filter(d => d.project === project))
            },[project])
            useEffect(()=>{
                        settaskdetail2(data.filter(d => {
                        const dateTime = d.task_created_date.split(" ")[0]+ " " + d.task_created_date.split(" ")[1]+ " " + d.task_created_date.split(" ")[2]+ " " + d.task_created_date.split(" ")[3] ;
                        const calendatTime = value.toString().split(" ")[0] + " " + value.toString().split(" ")[1] + " " + value.toString().split(" ")[2] + " " +value.toString().split(" ")[3] 

                        return dateTime === calendatTime ; 
            }))
            },[value])

  return (
    <StaffJobLandingLayout hrView={true}>
            <div>
            <div>
            <h1>Task details</h1>
            {
                        taskdetail.map((d,i)=><li key={i}>{d.task}</li>)
            }
            </div>
            <h1>Hr Project</h1>
           
            <select onChange={e => setproject( e.target.value)}>
                        {data.map((d , i)=> <option  value={d.project} key={i}>{d.project}</option>)}
            </select>
            </div>
             <Calendar onChange={onChange} value={value} />
             {taskdetail2.length > 0 ? taskdetail2.map((d , i) => <li key={i}>{d.task}</li>) : "No Tasks Found For Today"}
    </StaffJobLandingLayout>
  )
}

export default HrTasks
            // console.log(taskdetail2 , "settaskdetail2")
            // console.log(taskdetail , project)
                                    // d.task_created_date.split(" ") === value.toString() ;

                        // console.log(dateTime , "dateTime") ;
                        // console.log(calendatTime , "calendatTime")