import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUserContext } from "./CurrentUserContext";
import { useJobContext } from "./Jobs";
import { getApplicationForAdmin, getCompanyStructure } from "../services/adminServices";
import { testCompanyData } from "../pages/AdminPage/views/CompanyStructure/utils/testData";

const CompanyStructureContext = createContext({})

export const useCompanyStructureContext = () => useContext(CompanyStructureContext);

export default function CompanyStructureContextProvider ({ children }) {
    const [ companyStructure, setCompanyStructure ] = useState({});
    const [ companyStructureLoading, setCompanyStructureLoading ] = useState(true);
    const [ companyStructureLoaded, setCompanyStructureLoaded ] = useState(false);
    const [ showConfigurationModal, setShowConfigurationModal ] = useState(false);
    const [ currentModalPage, setCurrentModalPage ] = useState(1);

    const { currentUser } = useCurrentUserContext();
    const {
        applicationsLoaded,
        setApplications,
        setApplicationsLoaded,
    } = useJobContext();

    useEffect(() => {
        if (!currentUser) return

        if (!applicationsLoaded) {

            getApplicationForAdmin(currentUser?.portfolio_info[0]?.org_id).then(res => {
                const applicationsFetched = res?.data?.response?.data?.filter(
                    (item) => currentUser?.portfolio_info[0]?.data_type === item.data_type
                )?.reverse()

                setApplications(applicationsFetched);
                setApplicationsLoaded(true);

            }).catch(err => {
                console.log('Failed to get applications for admin');
                setApplicationsLoaded(true);
            })
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

    }, [])

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