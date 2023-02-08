import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { PageUnderConstruction } from "../../../UnderConstructionPage/ConstructionPage"

const TeamsScreen = () => {
    const { currentUser } = useCurrentUserContext();
    
    return <>
        <JobLandingLayout user={currentUser} afterSelection={true}>
            <PageUnderConstruction />
        </JobLandingLayout>
    </>
}

export default TeamsScreen;
