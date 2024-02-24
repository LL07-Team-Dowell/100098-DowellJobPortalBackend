import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import React from "react";
import TrackAgendaPage from "../../../../common/screens/TrackAgenda/TrackAgenda";


const GroupleadTrackAgenda = () => {
    
    return <>
        <StaffJobLandingLayout
            teamleadView={true}
            isGrouplead={true}
            hideSearchBar={true}
        >
            <TrackAgendaPage 
                restrictProjects={true}
            />
        </StaffJobLandingLayout>
    </>
}

export default GroupleadTrackAgenda;