import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import React from "react";
import TrackAgendaPage from "../../../../common/screens/TrackAgenda/TrackAgenda";

const HrAgendaPage = () => {
    
    return <>
        <StaffJobLandingLayout
            hrView={true}
            pageTitle={'Agenda'}

        >
            <TrackAgendaPage />
        </StaffJobLandingLayout>
    </>
}

export default HrAgendaPage;