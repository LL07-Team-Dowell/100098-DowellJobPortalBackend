import { useEffect, useState } from "react";
import CompanyStructureScreen from "../../../../common/screens/CompanyStructure/CompanyStructureScreen";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getSettingUserProject } from "../../../../services/hrServices";
import { getSettingUserSubProject } from "../../../../services/adminServices";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";

export default function HRCompanyStructure () {
    const [projectsAdded, setProjectsAdded] = useState({});
    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [subProjectsAdded, setSubProjectsAdded] = useState([]);
    const [subProjectsLoaded, setSubProjectsLoaded] = useState(false);
    const [subProjectsLoading, setSubProjectsLoading] = useState(true);
  
    const {
        currentUser,
        allApplications
    } = useCurrentUserContext();

    const {
        companyStructure,
        companyStructureLoading,
        companyStructureLoaded,
    } = useHrJobScreenAllTasksContext();

    useEffect(() => {
        if (!projectsLoaded) {
            getSettingUserProject()
            .then((res) => {
                setProjectsLoading(false);
                setProjectsLoaded(true);
        
                const projectsGotten = res.data
                    ?.filter(
                    (project) =>
                        project?.data_type ===
                        currentUser.portfolio_info[0].data_type &&
                        project?.company_id === currentUser.portfolio_info[0].org_id &&
                        project.project_list &&
                        project.project_list.every(
                        (listing) => typeof listing === "string"
                        )
                    )
                    ?.reverse();
        
                if (projectsGotten.length < 1) return;
        
                setProjectsAdded(projectsGotten);
            })
            .catch((err) => {
                console.log(err);
                setProjectsLoading(false);
            });
        }
      
        if (!subProjectsLoaded) {
            getSettingUserSubProject()
            .then((res) => {
                setSubProjectsLoading(false);
                setSubProjectsLoaded(true);
        
                setSubProjectsAdded(
                    res.data?.data
                    ?.filter(
                        (item) =>
                        item.company_id === currentUser.portfolio_info[0].org_id &&
                            item.data_type === currentUser.portfolio_info[0].data_type
                    )
                    .reverse()
                );
            })
            .catch((err) => {
                console.log(err);
                setSubProjectsLoading(false);
            });
        }
      
    }, [currentUser])

    return <>
    
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
        >
            <CompanyStructureScreen 
                companyStructure={companyStructure}
                companyStructureLoading={companyStructureLoading}
                companyStructureLoaded={companyStructureLoaded}
                applications={allApplications}
                applicationsLoaded={true}
                projectsLoaded={projectsLoaded}
                projectsAdded={projectsAdded}
                subProjectsAdded={subProjectsAdded}
                subProjectsLoaded={subProjectsLoaded}
            />
        </StaffJobLandingLayout>
    </>
}