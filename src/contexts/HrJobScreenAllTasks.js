import { createContext, useContext, useState } from "react";

const HrJobScreenAllTasksContext = createContext();

export const useHrJobScreenAllTasksContext = () => {
  return useContext(HrJobScreenAllTasksContext);
};

export const HrJobScreenAllTasksContextProvider = ({ children }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [ candidateResponses, setCandidateResponses ] = useState([]);
  const [ loadedTasks, setLoadedTasks ] = useState([]);
  const [projectsAdded, setProjectsAdded] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  
  return (
    <HrJobScreenAllTasksContext.Provider
      value={{ 
        allTasks, 
        setAllTasks, 
        questions, 
        setQuestions, 
        candidateResponses, 
        setCandidateResponses, 
        loadedTasks,
        setLoadedTasks,
        projectsAdded,
        setProjectsAdded,
        projectsLoaded,
        setProjectsLoaded,
        projectsLoading,
        setProjectsLoading,
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
      }}
    >
      {children}
    </HrJobScreenAllTasksContext.Provider>
  );
};
