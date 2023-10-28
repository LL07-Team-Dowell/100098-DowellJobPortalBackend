import { createContext, useContext, useState } from "react";

const CandidateTaskContext = createContext({});

export const useCandidateTaskContext = () => useContext(CandidateTaskContext);

export const CandidateTaskContextProvider = ({ children }) => {
    const [ userTasks, setUserTasks ] = useState([]);
    const [ tasksLoaded, setTasksLoaded ] = useState([]);
    const [ fetchedOnboardingUsers, setFetchedOnboardingUsers ] = useState([]);
    const [ fetchedOnboardingUsersLoaded, setFetchedOnboardingUsersLoaded ] = useState(false);
    const [ allProjects, setAllProjects ] = useState([]);
    const [ initialTasksLoaded, setInitialTasksLoaded ] = useState(false);
    
    return (
        <CandidateTaskContext.Provider value={{ 
            userTasks, 
            setUserTasks,
            tasksLoaded,
            setTasksLoaded,
            fetchedOnboardingUsers,
            setFetchedOnboardingUsers,
            fetchedOnboardingUsersLoaded,
            setFetchedOnboardingUsersLoaded,
            allProjects,
            setAllProjects,
            initialTasksLoaded,
            setInitialTasksLoaded,
        }}>
            { children }
        </CandidateTaskContext.Provider>
    )
}
