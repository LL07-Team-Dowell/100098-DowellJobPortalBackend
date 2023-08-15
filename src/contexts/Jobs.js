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
    const [ projectsAdded, setProjectsAdded ] = useState([]);
    const [ projectsLoaded, setProjectsLoaded ] = useState(false);
    const [ projectsLoading, setProjectsLoading ] = useState(true);
    const [ productLinks, setProductLinks ] = useState([]);

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
            projectsAdded,
            setProjectsAdded,
            projectsLoaded, 
            setProjectsLoaded,
            projectsLoading,
            setProjectsLoading,
            productLinks,
            setProductLinks,
        }}>
            {children}
        </JobContext.Provider>
    )
}