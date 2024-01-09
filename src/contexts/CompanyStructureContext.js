import { createContext, useContext, useState } from "react";

const CompanyStructureContext = createContext({})

export const useCompanyStructureContext = () => useContext(CompanyStructureContext);

export default function CompanyStructureContextProvider ({ children }) {
    const [ companyStructure, setCompanyStructure ] = useState({});
    const [ companyStructureLoading, setCompanyStructureLoading ] = useState(true);
    const [ companyStructureLoaded, setCompanyStructureLoaded ] = useState(false);

    return <CompanyStructureContext.Provider value={{
        companyStructure,
        setCompanyStructure,
        companyStructureLoading,
        setCompanyStructureLoading,
        companyStructureLoaded,
        setCompanyStructureLoaded,
    }}>
        { children }
    </CompanyStructureContext.Provider>
}