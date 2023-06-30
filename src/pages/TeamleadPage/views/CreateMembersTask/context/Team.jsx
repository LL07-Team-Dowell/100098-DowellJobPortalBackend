import { createContext, useContext, useEffect, useState } from "react";
import { getAllTeams } from "../../../../../services/createMembersTasks";
import { useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";

const TeamContext = createContext({});

export const initialState = {}

export const useTeam = () => useContext(TeamContext);
export const TeamProvider = ({ children }) => {
  const {id} = useParams();

    const [ team, setteam ] = useState(initialState)
   
    return (
        <TeamContext.Provider  value={{ team, setteam }}>
            {children}
        </TeamContext.Provider>
    )
}

