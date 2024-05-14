import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles.module.css';
import { AiOutlineAim } from "react-icons/ai";

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
                        <AiOutlineAim
                            className={styles.icon}
                        />
                    </div>
                    <h4>View Worklogs</h4>
                    <p>
                        View your tasks given and milestones completed on a project.
                    </p>
                </div>
            </div>
            <div
                className={styles.Create_Team}
                onClick={() => navigate("/work-log-request")}
            >
                <div>
                    <div>
                        <AiOutlineAim
                            className={styles.icon}
                        />
                    </div>
                    <h4>Log Requests</h4>
                    <p>
                        Track the progress and status of worklog requests you made
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WorklogsLandingPage;