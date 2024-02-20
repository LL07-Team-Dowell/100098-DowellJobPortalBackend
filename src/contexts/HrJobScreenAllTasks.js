import { createContext, useContext, useEffect, useState } from "react";
import { getCompanyStructure } from "../services/adminServices";
import { useCurrentUserContext } from "./CurrentUserContext";

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
  const [ companyStructure, setCompanyStructure ] = useState({});
  const [ companyStructureLoading, setCompanyStructureLoading ] = useState(true);
  const [ companyStructureLoaded, setCompanyStructureLoaded ] = useState(false);
    
  
  const { 
    currentUser, 
  } = useCurrentUserContext();

  useEffect(() => {
    if (!currentUser) return

    if (!companyStructureLoaded) {
      setCompanyStructureLoading(true);

      getCompanyStructure(currentUser?.portfolio_info[0]?.org_id).then(res => {
        setCompanyStructureLoading(false);
        setCompanyStructureLoaded(true);
        setCompanyStructure(res.data?.data);

        // setCompanyStructure(testCompanyData); // for testing
      }).catch(err => {
        console.log('Failed to get company structure for admin');
        setCompanyStructureLoading(false);
      })
    }

  }, [currentUser])

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
        companyStructure,
        setCompanyStructure,
        companyStructureLoading,
        setCompanyStructureLoading,
        companyStructureLoaded,
        setCompanyStructureLoaded,
      }}
    >
      {children}
    </HrJobScreenAllTasksContext.Provider>
  );
};
