import { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const useJobContext = () => {
    return useContext(JobContext);
}

export const JobContextProvider = ( { children }) => {
    const [jobs, setJobs] = useState([]);
    const [list , setlist] = useState([]) ;
    const [jobs2 , setjobs2] = useState([]) ; 
    const [resp , setresponse ] = useState(false) ; 
    const [searchValue , setsearchValue] = useState("") ;
    const [ jobLinks, setJobLinks ] = useState([]);

    return (
        <JobContext.Provider value={{ 
            jobs, 
            setJobs , 
            setlist , 
            list , 
            jobs2 , 
            setjobs2 , 
            searchValue ,
            setsearchValue ,
            resp , 
            setresponse,
            jobLinks,
            setJobLinks,
        }}>
            {children}
        </JobContext.Provider>
    )
}