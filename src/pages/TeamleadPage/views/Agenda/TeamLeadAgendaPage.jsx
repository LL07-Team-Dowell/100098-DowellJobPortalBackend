import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import React from "react";
import TrackAgendaPage from "../../../../common/screens/TrackAgenda/TrackAgenda";


const TeamLeadAgendaPage = () => {
    
    return <>
        <StaffJobLandingLayout
            teamleadView={true}
            hideSearchBar={true}
        >
            <TrackAgendaPage 
                restrictProjects={true}
                isTeamLead={true}
            />
        </StaffJobLandingLayout>
    </>
}

export default TeamLeadAgendaPage;