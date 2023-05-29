import { useState , useEffect } from 'react'
import {  useValues } from './context/Values'
import { useMultistepForm } from './component/hooks/useMultipleForm'
import FirstForm from './component/Forms/FirstForm'
import SecondForm from './component/Forms/SecondForm'
import ThirdForm from './component/Forms/ThirdForm'
import axios from 'axios'
import Teams from './component/Teams'
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext'
import Alert from './Alert'
import { toast } from 'react-toastify'
import { initialState } from './context/Values'
const  TasksCo = ({bback}) => {
  const { currentUser } = useCurrentUserContext();
  const {data , setdata} = useValues() ;
  console.log({currentUser})
  // alert
  const [message , setmessage] = useState('') ; 
  const [showalert , setshowalert] = useState(false) ; 
  const [loading ,setloading] = useState(false) ; 
  const [err , seterr] = useState(""); 
  console.log({membersEditTeam:data.membersEditTeam})
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next ,back , backfirst} =
  useMultistepForm([
    <FirstForm/>,
    <SecondForm  />,
    <ThirdForm/>,
  ])

  const buttonFunction = ()=>{
    const {individual_task , team_task, selected_members , team_name , members} = data ;
    console.log({currentStepIndex , individual_task , team_task})
    // Step 1 -> Step 2

    if(currentStepIndex=== 0 && !(individual_task || team_task)){ }
                        else if(currentStepIndex=== 0 && (individual_task || team_task)){
                          next()
                          return
                        }


        // Creating a team 
        else if(currentStepIndex === 1 && selected_members.length > 0){
          setloading(true)
          axios.post(`https://100098.pythonanywhere.com/team_task_management/create_team/`,{
            team_name,
            members: selected_members , 
            company_id: currentUser.portfolio_info[0].org_id,
        })
          .then(resp => {
            console.log(resp.data) ; 
            console.log({team_name})
              axios(`https://100098.pythonanywhere.com/team_task_management/get_all_teams/${currentUser.portfolio_info[0].org_id}/`)
                .then(resp =>{
                  setloading(false) ;
                  const id =  resp.data.response.data.find(v=>v.team_name === team_name)["_id"]
                  setdata({...data , TeamsSelected:resp.data.response.data,teamName:team_name ,team:id  , RESP_INDV_TASK:""});
                  toast("team created succesfully.") ; 
                  next() ;           
                })
                .catch(e =>{
                  seterr("something went wrong try again..") 
                })
          })
          .catch(err => {
            console.log(err) ;
            seterr("something went wrong try again..") 
          })
          return
        }
        else{
          // Creating a Team Task 
          if(data.discription && data.taskName){
              setloading(true) ;
              axios.post("https://100098.pythonanywhere.com/team_task_management/create_team_task/",{assignee:currentUser.userinfo.username
              ,title:data.taskName ,description:data.discription,team:data.teamId , completed:false})
              .then(r => {console.log(r.data);
                setloading(false)
                toast("task created successfully.") ; 
                setdata({...initialState ,TeamsSelected:data.TeamsSelected}) ; 
                backfirst()
              })
              .catch(e => {console.log(e);
                seterr("something went wrong try again ..")
                console.log({assignee:currentUser.userinfo.username
                ,title:data.taskName ,description:data.discription,team:data.teamId , completed:false })})

          }else{
            alert("message not ")
          }
        }
  }
    useEffect(()=>{
      if(data.RESP_INDV_TASK){
        backfirst() ;
        setdata({...data , RESP_INDV_TASK:"",TeamsSelected:data.TeamsSelected})
      }
    },[data])
  if(err) return <h4>{err}</h4>
  if(loading) return <h1>Loading...</h1>
    return (
    <>
      {
        showalert && <Alert message={message}/>
      }
    <div >

      <form onSubmit={e => e.preventDefault()}>
      {step}
  {!(data.individual_task && currentStepIndex === 1) && <button onClick={buttonFunction}>Next</button>}
   {
    isFirstStep || <button onClick={back}>Back</button>
   }
   {
    isFirstStep && <button onClick={bback}> Back</button>
   }
      </form>
    </div>
    </>
  )
}

export default TasksCo
// https://100098.pythonanywhere.com/candidate_management/get_all_onboarded_candidate/63a2b3fb2be81449d3a30d3f/