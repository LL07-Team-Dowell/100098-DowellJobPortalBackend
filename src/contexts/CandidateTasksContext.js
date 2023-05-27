import { createContext, useContext, useState } from "react";

const CandidateTaskContext = createContext({});

export const useCandidateTaskContext = () => useContext(CandidateTaskContext);

export const CandidateTaskContextProvider = ({ children }) => {
    const [ userTasks, setUserTasks ] = useState([]);
    
    return (
        <CandidateTaskContext.Provider value={{ userTasks, setUserTasks }}>
            { children }
        </CandidateTaskContext.Provider>
    )
}
