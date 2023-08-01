import { createContext, useContext, useState } from "react";
const HrJobScreenAllTasksContext = createContext();
export const useHrJobScreenAllTasksContext = () => {
  return useContext(HrJobScreenAllTasksContext);
};
export const HrJobScreenAllTasksContextProvider = ({ children }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [ candidateResponses, setCandidateResponses ] = useState([]);

  return (
    <HrJobScreenAllTasksContext.Provider
      value={{ allTasks, setAllTasks, questions, setQuestions, candidateResponses, setCandidateResponses }}
    >
      {children}
    </HrJobScreenAllTasksContext.Provider>
  );
};
