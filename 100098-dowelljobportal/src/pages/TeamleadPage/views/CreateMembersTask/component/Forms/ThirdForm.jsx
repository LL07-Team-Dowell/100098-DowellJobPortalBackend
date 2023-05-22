import React , {useState ,useEffect} from 'react'
import { useValues } from '../../context/Values';
import axios from 'axios';

const ThirdForm = () => {
  const {data , setdata} = useValues() ;
  useEffect(()=>{
    axios("https://100098.pythonanywhere.com/team_task_management/create_get_team/")
    .then(resp =>{console.log(resp.data); 
      setdata({...data ,teamId:resp.data.find(v => v.team_name === data.team_name).id})
    })
    .catch(err => console.log(err))
},[])
  console.log({data})
  const {selected_members , TeamsSelected} = data ;
  console.log(TeamsSelected)
            const  formatNames = (names) => {
                        if (names.length === 0) {
                          return "";
                        } else if (names.length === 1) {
                          return names[0];
                        } else if (names.length === 2) {
                          return `${names[0]} and ${names[1]}`;
                        } else {
                          const lastName = names.slice(-1);
                          const otherNames = names.slice(0, -1);
                          return `${otherNames.join(", ")} and ${lastName}`;
                        }
                      }
    if(data.teamId === "") return <h1>Loading...</h1>
  return (
    <div>
            <h6>Assigned Member(s)</h6>
            <p>{formatNames(selected_members)}</p>
            {data.team_task && <p>Team Name: {data.team_name}</p>}
            <input type="text" placeholder='Task name'  onChange={e => setdata({...data ,taskName:e.target.value})}/>
            <br />
            <input type="text" placeholder='Task discription'  onChange={e => setdata({...data ,discription:e.target.value})}/>
            <p>Assignee</p>
            <select name="" id="" onChange={e => setdata({...data , Assignee:e.target.value})}>
              {data.memebers.map((v,i)=> <option value={v} key={i}>{v}</option>)}
            </select>
            {/* <select name="" id="" onChange={e => setdata({...data , team_name:e.target.value})}> 
              {data.TeamsSelected.map((v,i)=> <option value={v.team_name} key={i}>{v.team_name}</option> )}
            </select>  */}
            {/* 
           
           */}
    </div>
  )
}

export default ThirdForm