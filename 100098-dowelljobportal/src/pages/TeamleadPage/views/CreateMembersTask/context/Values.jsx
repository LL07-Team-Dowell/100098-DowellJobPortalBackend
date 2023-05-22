import { createContext, useContext, useState } from "react";

const CandidateJobsContext = createContext({});

export const useValues = () => useContext(CandidateJobsContext);

export const CandidateJobsContextProvider = ({ children }) => {
    const [ data, setdata ] = useState({
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
      membersEditTeam:[]
    })

    return (
        <CandidateJobsContext.Provider  value={{ data, setdata }}>
            {children}
        </CandidateJobsContext.Provider>
    )
}

