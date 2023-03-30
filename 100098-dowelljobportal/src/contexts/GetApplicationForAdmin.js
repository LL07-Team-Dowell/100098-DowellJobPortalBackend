import React, { createContext, useContext, useState } from "react";
import { getApplicationForAdmin } from "../services/adminServices";

const MyContext = createContext({});

export const useMyContext = () => useContext(MyContext);

export const GetApplicationForAdmin = ({ children }) => {
  const [List, setList] = useState([]);
 

  return (
    <MyContext.Provider value={{ myData, setMyData }}>
      {children}
    </MyContext.Provider>
  );
};
