import React  ,{useEffect} from 'react'
import { useValues } from '../../context/Values'
import axios from 'axios'
import { useState } from 'react';
import Checkbox from '../Checkbox';
const SecondForm = ({}) => {
  const {data ,setdata} = useValues() ; 
  const [task , settask] = useState({choosed:false , value:""});
  const [choosedTeam , setChoosedTeam] = useState({choosed:false , value:""})
  const [loading ,setloading] = useState(false) ; 
  const {individual_task , team_task} = data ;
  const [teams ,setteams] = useState([])
  useEffect(()=>{
      if(task.choosed || !team_task){
        setloading(true) ; 
        axios(`https://100098.pythonanywhere.com/candidate_management/get_all_onboarded_candidate/63a2b3fb2be81449d3a30d3f/`,)
        .then(resp =>{ setdata({...data , memebers:[...data.memebers , resp.data.response.data.map(v =>v.username)]}); setloading(false)})
        .catch(err => console.log(err))
      }
  },[team_task ,task])
//   useEffect(()=>{
//     axios("https://100098.pythonanywhere.com/team_task_management/create_get_team/")
//     .then(resp =>{ setteams(resp.data);console.log(resp.data);setdata({...data , TeamsSelected:resp.data})})
//     .catch(err => console.log(err))
// },[])
  console.log("TeamsSelected",data.TeamsSelected)
const patchTeam = () => {
    const id = data.TeamsSelected.find(m => m.team_name === choosedTeam.value)["id"] 
    const teamName = data.TeamsSelected.find(m => m.team_name === choosedTeam.value)["team_name"] 
    console.log({id , teamName})
    axios.patch(`https://100098.pythonanywhere.com/team_task_management/edit-team-api/${id}/`,{ "team_name":teamName ,
    "members":data?.membersEditTeam})
    .then(resp => console.log(resp))
    .catch(err => {console.log(err);console.log({team:data?.membersEditTeam})})
}
            const handleCheckboxChange = (event) => {
                        const value = event.target.value;
                        if (event.target.checked) {
                                    setdata({...data , selected_members:[...data.selected_members , value]});
                        } else {
                                    setdata({...data ,selected_members:data.selected_members.filter((box) => box !== value)});
                        }
                      };
                      const handleCheckboxChange2 = (event) => {
                        const value = event.target.value;
                        if (event.target.checked) {
                                    setdata({...data , selected_members:[ value]});
                        } else {
                                    setdata({...data ,selected_members:[]});
                        }
                      };
                      const changeTeamName = (e) =>{
                        console.log({...data , team_name:e.target.value}) ; 
                        setdata({...data , team_name:e.target.value}) ; 
                      }
            useEffect(()=>{
              if(choosedTeam.value){
                setdata({...data , membersEditTeam:[...data.TeamsSelected.find(v => v.team_name === choosedTeam.value).members.map(v => v.name)]})
              }
            },[choosedTeam])

                      if(loading)return <h1>Loading...</h1>
  return (
    <div>   
            {
                        ( team_task) ? 
                        <>
                        {
                          (!task.choosed) ? <>
                          <button onClick={()=>{settask({choosed:true , value:"new Team"})}}>Create a new Team</button>
                          <button onClick={()=>{settask({choosed:true , value:"existing Team"})}}>Use an existing Team</button>

                          </> :
                          <>
                          {
                            (task.value === "new Team") ? 
                            <>
                             {data.memebers.map((member , i) => 
                                                <label>
                                                <input
                                                  type="checkbox"
                                                  value={member}
                                                  onChange={handleCheckboxChange}
                                                />
                                                {member}
                                              </label>
                                  )}
                              <br />
                              <input type="text" placeholder='' onChange={changeTeamName}  />
                            
                            </>
                            :
                            <>
                            {
                              !choosedTeam.choosed ? 
                              
                              data.TeamsSelected.map(v => <>
                                <button onClick={()=>setChoosedTeam({choosed:true , value:v.team_name})}>{v.team_name}</button> <br />
                              </>) 
                              : 
                              <>
                              <h1>{choosedTeam.value}</h1>
                                {choosedTeam.value} asdasdasd
                                {data.memebers.map((member , i) => 
                                                <>
                                              
                                              <Checkbox choosedTeamValue={choosedTeam.value} Member={member} key={i} />
                                              </>
                                
                                  )}
                                  {
                                    <>
                                    <br />
                                    <button onClick={()=>{patchTeam()}}>{"edit"}</button>
                                    </>
                                  }
                              </>
                            }
                            </>
                          }
                          </>
                        }
                          <br />

                  
                             </>       
                        :
                        <>
                    {data.memebers.map((member , i) => 
                                            <label>
                                            <input
                                              type="radio"
                                              value={member}
                                              onChange={handleCheckboxChange2}
                                              checked={member === data.selected_members[0]}
                                            />
                                            {member}
                                          </label>
                                )}
                                <input type="text"  placeholder='project name'/>

                                   </>
            }
            
    </div>
  )
}

export default SecondForm