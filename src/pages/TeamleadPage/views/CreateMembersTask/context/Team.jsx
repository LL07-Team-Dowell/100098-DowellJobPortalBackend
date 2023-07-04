import { createContext, useContext, useState } from "react";

const TeamContext = createContext({});

export const initialState = {}

export const useTeam = () => useContext(TeamContext);
export const TeamProvider = ({ children }) => {

    const [ team, setteam ] = useState(null)
   
    return (
        <TeamContext.Provider  value={{ team, setteam }}>
            {children}
        </TeamContext.Provider>
    )
}

