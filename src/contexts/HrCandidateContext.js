import { createContext, useContext, useState } from "react";

const HrCandidateContext = createContext();

export const useHrCandidateContext = () => {
    return useContext(HrCandidateContext);
}

export const HrCandidateContextProvider = ( { children }) => {
    const [candidateData, setCandidateData] = useState([]);

    return (
        <HrCandidateContext.Provider value={{ candidateData, setCandidateData }}>
            {children}
        </HrCandidateContext.Provider>
    )
}
