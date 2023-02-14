import { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const useJobContext = () => {
    return useContext(JobContext);
}

export const JobContextProvider = ( { children }) => {
    const [jobs, setJobs] = useState([]);

    return (
        <JobContext.Provider value={{ jobs, setJobs }}>
            {children}
        </JobContext.Provider>
    )
}