import React from "react";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import AgendaReport from "../../../../../common/screens/AgendaReport/AgendaReport";

const AdminAgendaReport = () => {

    return (
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Reports"}
            newSidebarDesign={true}
        ><AgendaReport /></StaffJobLandingLayout>
    );
}

export default AdminAgendaReport;