import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import React from "react";
import TrackAgendaPage from "../../../../common/screens/TrackAgenda/TrackAgenda";

const AdminAgendaPage = () => {

    return <>
        <StaffJobLandingLayout
            adminView={true}
            newSidebarDesign={true}
            adminAlternativePageActive={true}
            pageTitle={'Agenda'}
        >
            <TrackAgendaPage />
        </StaffJobLandingLayout>
    </>
}

export default AdminAgendaPage;