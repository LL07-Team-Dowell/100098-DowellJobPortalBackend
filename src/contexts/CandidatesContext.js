import { createContext, useContext, useReducer, useState } from "react";
import { candidateDataReducer } from "../reducers/CandidateDataReducer";

export const initialCandidatesData = {
    candidatesToHire: [],
    onboardingCandidates: [],
    candidatesToRehire: [],
    selectedCandidates: [],
    rejectedCandidates: [],
}

export const initialCandidatesDataStateNames = {
    candidatesToHire: "candidatesToHire",
    onboardingCandidates: "onboardingCandidates",
    candidatesToRehire: "candidatesToRehire",
    selectedCandidates: "selectedCandidates",
    rejectedCandidates: "rejectedCandidates",
}

const CandidateContext = createContext({});

export const useCandidateContext = () => {
    return useContext(CandidateContext);
}

export const CandidateContextProvider = ({ children }) => {

    const [ candidatesData, dispatchToCandidatesData ] = useReducer(candidateDataReducer, initialCandidatesData);
    const [ candidatesDataLoaded, setCandidatesDataLoaded ] = useState(false);

    return (
        <CandidateContext.Provider value={{ candidatesData, dispatchToCandidatesData, candidatesDataLoaded, setCandidatesDataLoaded }}>
            {children}
        </CandidateContext.Provider>
    )
}

