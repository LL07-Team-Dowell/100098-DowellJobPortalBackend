import { createContext, useContext, useState } from "react";

const CandidateJobsContext = createContext({});
export const initialState = {
    individual_task:false , 
    team_task : false ,
    team_name:"" , 
    selected_members:[] , 
    memebers:['boxboy','ayo','sagar','isaac','Hardic','akram','manish'] , 
    task:"" , 
    teamName:"" ,
    taskName:"" , 
    discription:"" , 
    Assignee:"" , 
    completed:false , 
    TeamsSelected:[] ,
    teamId:"" , 
    membersEditTeam:[""] , 
    RESP_INDV_TASK:"",
    teamDescription:""
  }
export const useValues = () => useContext(CandidateJobsContext);
// CandidateJobsContextProvider
export const ValuesProvider = ({ children }) => {
    const [ data, setdata ] = useState(initialState)

    return (
        <CandidateJobsContext.Provider  value={{ data, setdata }}>
            {children}
        </CandidateJobsContext.Provider>
    )
}

