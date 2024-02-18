import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useJobContext } from "../../../../contexts/Jobs";
import { useCompanyStructureContext } from "../../../../contexts/CompanyStructureContext";
import CompanyStructureScreen from "../../../../common/screens/CompanyStructure/CompanyStructureScreen";

const CompanyStructurePage = () => {
    const {
        applications,
        applicationsLoaded,
        projectsLoaded,
        projectsAdded,
        subProjectsAdded,
        subProjectsLoaded,
    } = useJobContext();

    const {
        companyStructure,
        setCompanyStructure,
        companyStructureLoading,
        companyStructureLoaded,
        showConfigurationModal,
        setShowConfigurationModal,
        currentModalPage,
        setCurrentModalPage,
    } = useCompanyStructureContext();


    return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={'Company Structure'}
            newSidebarDesign={true}
        >
            <CompanyStructureScreen
                companyStructure={companyStructure}
                setCompanyStructure={setCompanyStructure}
                companyStructureLoading={companyStructureLoading}
                companyStructureLoaded={companyStructureLoaded}
                showConfigurationModal={showConfigurationModal}
                setShowConfigurationModal={setShowConfigurationModal}
                currentModalPage={currentModalPage}
                setCurrentModalPage={setCurrentModalPage}
                applications={applications}
                applicationsLoaded={applicationsLoaded}
                projectsLoaded={projectsLoaded}
                projectsAdded={projectsAdded}
                subProjectsAdded={subProjectsAdded}
                subProjectsLoaded={subProjectsLoaded}
                hasEditRights={true}
            />
        </StaffJobLandingLayout>
    </>
}

export default CompanyStructurePage;