import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import React from "react";
import TrackAgendaPage from "../../../../common/screens/TrackAgenda/TrackAgenda";


const ProjectLeadAgendaPage = () => {

    return <>
        <StaffJobLandingLayout
            projectLeadView={true}
        >
            <TrackAgendaPage />
        </StaffJobLandingLayout>
    </>
}

export default ProjectLeadAgendaPage;