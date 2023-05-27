import React, { createContext, useContext, useState } from "react";

const ResponsesContext = createContext({});

export const useResponsesContext = () => useContext(ResponsesContext);

export const ResponsesContextProvider = ({ children }) => {
  const [responses , setresponses] = useState([]) ; 
  const [allquestions, setAllQuestions] = useState([]);

  return (
    <ResponsesContext.Provider value={{ responses, setresponses, allquestions, setAllQuestions }}>
      {children}
    </ResponsesContext.Provider>
  );
};