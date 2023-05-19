import React, { createContext, useContext, useState } from "react";

const ResponsesContext = createContext({});

export const useResponsesContext = () => useContext(ResponsesContext);

export const ResponsesContextProvider = ({ children }) => {
            const [responses , setresponses] = useState([]) ; 
  return (
    <ResponsesContext.Provider value={{ responses, setresponses }}>
      {children}
    </ResponsesContext.Provider>
  );
};