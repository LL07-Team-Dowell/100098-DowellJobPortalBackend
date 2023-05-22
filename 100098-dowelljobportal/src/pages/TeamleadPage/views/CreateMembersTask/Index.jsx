import { useState , useEffect } from 'react'
import { useValues } from './context/Values'
import { useMultistepForm } from './component/hooks/useMultipleForm'
import FirstForm from './component/Forms/FirstForm'
import SecondForm from './component/Forms/SecondForm'
import ThirdForm from './component/Forms/ThirdForm'
import axios from 'axios'
import Teams from './component/Teams'
const intialValue = {

}

function Index() {
  const [impLoading , setImpLoading] = useState(false) ; 
  const {data , setdata} = useValues() ;
  console.log(data)
  console.log({membersEditTeam:data.membersEditTeam})
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next ,back} =
  useMultistepForm([
    <FirstForm/>,
    <SecondForm  />,
    <ThirdForm/>,
  ])
  function updateFields(fields) {
    setdata(prev => {
      return { ...prev, ...fields }
    })
  }
  useEffect(()=>{
        axios("https://100098.pythonanywhere.com/team_task_management/create_get_team/")
        .then(resp =>{console.log(resp.data); 
          setdata({...data ,teamId:resp.data.find(v => v.team_name === data.team_name).id})
        })
        .catch(err => console.log(err))
  },[])
  useEffect(()=>{
    setImpLoading(true)
    axios(`https://100098.pythonanywhere.com/candidate_management/get_all_onboarded_candidate/63a2b3fb2be81449d3a30d3f/`)
    .then(resp =>{ console.log(resp.data);setImpLoading(false)})
    .catch(err => console.log(err))
  },[])
  const buttonFunction = ()=>{
    const {individual_task , team_task, selected_members , team_name , members} = data ;
    if(currentStepIndex=== 0 && !(individual_task || team_task)){ }
                        else if(currentStepIndex=== 0 && (individual_task || team_task)){
                          next()
                          return
                        }
        else if(currentStepIndex === 1 && selected_members.length > 0){
          axios.post(`https://100098.pythonanywhere.com/team_task_management/create_get_team/`,{
            team_name,
            members: selected_members
        })
          .then(resp => {
            console.log(resp.data) ; 
            setdata({...data , teamName:resp.data.team_name})
            next() ; 
          })
          .catch(err => {
            console.log(err) ; 
            alert("err") ; 
          console.log({team_name , members:selected_members})

          })
          return

        }
        else{
          if(data.discription && data.taskName){
            axios.post("https://100098.pythonanywhere.com/team_task_management/create_team_task/",{assignee:data.Assignee,title:data.taskName ,description:data.discription,team:data.teamId , completed:false})
            .then(r => console.log(r.data))
            .catch(e => {console.log(e); console.log({assignee:data.Assignee,title:data.taskName ,description:data.discription,team:data.team_name , completed:false })})
          }else{
            alert("message not ")
          }
        }
  }
  if(impLoading)return<h1>Loading...</h1>
  return (
    <div >
      <form onSubmit={e => e.preventDefault()}>
      <div>{`${currentStepIndex + 1}/${steps.length}`}</div>
      {step}
      <button onClick={buttonFunction}>Next</button>
      </form>
      <hr />
      <Teams/>
    </div>
  )
}

export default Index
// https://100098.pythonanywhere.com/candidate_management/get_all_onboarded_candidate/63a2b3fb2be81449d3a30d3f/