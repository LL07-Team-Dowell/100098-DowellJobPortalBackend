import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useNavigate } from "react-router-dom";
import { TfiAgenda } from "react-icons/tfi";
import styles from './styles.module.css';
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineUpdate } from "react-icons/md";

const WorklogsLandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className={`${styles.create_team_parent} ${styles.report}`} style={{ padding: '20px 20px 200px' }}>
            <div
                className={styles.Create_Team}
                onClick={() => navigate("/task")}
            >
                <div>
                    <div>
                        <TbReportAnalytics className={styles.icon} />
                    </div>
                    <h4>View Worklogs</h4>
                    <p>
                        Get insights into attendance trends and weekly progress for effective organization management.
                    </p>
                </div>
            </div>
            <div
                className={styles.Create_Team}
                onClick={() => navigate("/work-log-request")}
            >
                <div>
                    <div>
                        <MdOutlineUpdate className={styles.icon} />
                    </div>
                    <h4>Log Request</h4>
                    <p>
                        Update attendance records for precise tracking and efficient management of working hours.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WorklogsLandingPage;