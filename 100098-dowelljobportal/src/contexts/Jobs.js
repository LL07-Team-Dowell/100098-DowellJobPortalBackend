import { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const useJobContext = () => {
    return useContext(JobContext);
}

export const JobContextProvider = ( { children }) => {
    const [jobs, setJobs] = useState([]);
    const [list , setlist] = useState([]) ;
    const [jobs2 , setjobs2] = useState([]) ; 
  const [searchValue , setsearchValue] = useState("") ;

    return (
        <JobContext.Provider value={{ jobs, setJobs , setlist , list , jobs2 , setjobs2 , searchValue ,setsearchValue  }}>
            {children}
        </JobContext.Provider>
    )
}