import { createContext, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const NavigationContext = createContext({});

export const useNavigationContext = () => {
    return useContext(NavigationContext);
}

export const NavigationContextProvider = ({ children }) => {

    const { section, sub_section, path } = useParams();
    const [ searchParams, setSearchParams ] = useSearchParams();
    
    return (
        <NavigationContext.Provider value={{ section, sub_section, path, searchParams }} >
            { children }
        </NavigationContext.Provider>
    )
}
