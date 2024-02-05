import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useNavigate } from "react-router-dom";
import { TfiAgenda } from "react-icons/tfi";
import './style.scss';
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineUpdate } from "react-icons/md";

const AttendanceLandingPage = () => {
    const navigate = useNavigate();
    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
            pageTitle={'Attendance'}
        >
            <h2 className="attendance__Report__Heading">Attendance Report</h2>
            <div className="create_team_parent report" style={{ padding: '20px 20px 200px' }}>
                <div
                    className="Create_Team"
                    onClick={() => navigate("/attendance-/attendance-report")}
                >
                    <div>
                        <div>
                            <TbReportAnalytics className="icon" />
                        </div>
                        <h4>View Attendance</h4>
                        <p>
                            Get insights into attendance trends and weekly progress for effective organization management.
                        </p>
                    </div>
                </div>
                <div
                    className="Create_Team"
                    onClick={() => navigate("/attendance-/attendance-update")}
                >
                    <div>
                        <div>
                            <MdOutlineUpdate className="icon" />
                        </div>
                        <h4>Update Attendance</h4>
                        <p>
                            Update attendance records for precise tracking and efficient management of working hours.
                        </p>
                    </div>
                </div>
            </div>
        </StaffJobLandingLayout>
    );
}

export default AttendanceLandingPage;