import { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const useJobContext = () => {
    return useContext(JobContext);
}

export const JobContextProvider = ( { children }) => {
    const [jobs, setJobs] = useState([]);
    const [list , setlist] = useState([])
    return (
        <JobContext.Provider value={{ jobs, setJobs , setlist , list }}>
            {children}
        </JobContext.Provider>
    )
}