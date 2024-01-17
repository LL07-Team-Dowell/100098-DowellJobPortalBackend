import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { PageUnderConstruction } from "../../../UnderConstructionPage/ConstructionPage";

const EventScreen = () => {
    return (
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Events"}
            newSidebarDesign={true}
        >
            <PageUnderConstruction />
        </StaffJobLandingLayout>
    );
}
export default EventScreen;