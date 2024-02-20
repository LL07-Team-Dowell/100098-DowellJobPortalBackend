import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUserContext } from "./CurrentUserContext";
import { useJobContext } from "./Jobs";
import { getCompanyStructure } from "../services/adminServices";

const CompanyStructureContext = createContext({})

export const useCompanyStructureContext = () => useContext(CompanyStructureContext);

export default function CompanyStructureContextProvider ({ children }) {
    const [ companyStructure, setCompanyStructure ] = useState({});
    const [ companyStructureLoading, setCompanyStructureLoading ] = useState(true);
    const [ companyStructureLoaded, setCompanyStructureLoaded ] = useState(false);
    const [ showConfigurationModal, setShowConfigurationModal ] = useState(false);
    const [ currentModalPage, setCurrentModalPage ] = useState(1);

    const { 
        currentUser, 
        allCompanyApplications, 
        userRemovalStatusChecked 
    } = useCurrentUserContext();
    const {
        applicationsLoaded,
        setApplications,
        setApplicationsLoaded,
    } = useJobContext();

    useEffect(() => {
        if (!currentUser) return

        if (!applicationsLoaded) {
            if (!userRemovalStatusChecked) return

            setApplications(allCompanyApplications);
            setApplicationsLoaded(true);
        }

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

    }, [currentUser, userRemovalStatusChecked])

    return <CompanyStructureContext.Provider value={{
        companyStructure,
        setCompanyStructure,
        companyStructureLoading,
        setCompanyStructureLoading,
        companyStructureLoaded,
        setCompanyStructureLoaded,
        showConfigurationModal,
        setShowConfigurationModal,
        currentModalPage,
        setCurrentModalPage,
    }}>
        { children }
    </CompanyStructureContext.Provider>
}