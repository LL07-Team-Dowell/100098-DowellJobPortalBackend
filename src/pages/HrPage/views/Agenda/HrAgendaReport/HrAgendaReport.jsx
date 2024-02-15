import React from "react";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import AgendaReport from "../../../../../common/screens/AgendaReport/AgendaReport";

const HrAgendaReport = () => {
    return (<StaffJobLandingLayout hrView={true}><AgendaReport /></StaffJobLandingLayout>);
}

export default HrAgendaReport;