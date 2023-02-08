import { createContext, useContext, useState } from "react";

const CandidateJobsContext = createContext({});

export const useCandidateJobsContext = () => useContext(CandidateJobsContext);

export const CandidateJobsContextProvider = ({ children }) => {
    const [ candidateJobs, setCandidateJobs ] = useState({
        appliedJobs: [],
        currentUserApplications: [],
        userInterviews: [],
    })

    return (
        <CandidateJobsContext.Provider value={{ candidateJobs, setCandidateJobs }}>
            {children}
        </CandidateJobsContext.Provider>
    )
}

