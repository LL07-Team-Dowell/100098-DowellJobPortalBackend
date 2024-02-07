import styles from './styles.module.css';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { useNavigate } from "react-router-dom";
import { TfiAgenda } from "react-icons/tfi";
import { CgInsights } from "react-icons/cg";

const AgendaLandingPage = () => {
    const navigate = useNavigate();
    return (
        <StaffJobLandingLayout
            hrView={true}
            pageTitle={'Agenda'}
            hideSearchBar={true}
        >
            <h2 className={styles.agenda__Report__Heading}>Agenda Report</h2>
            <div className={`${styles.create_team_parent} ${styles.report}`} style={{ padding: '20px 20px 200px' }}>
                <div
                    className={styles.Create_Team}
                    onClick={() => navigate("/agenda/track-agenda")}
                >
                    <div>
                        <div>
                            <CgInsights className={styles.icon} />
                        </div>
                        <h4>Track Agenda</h4>
                        <p>
                            Get insights into scheduled events and activities for efficient organization.
                        </p>
                    </div>
                </div>
                <div
                    className={styles.Create_Team}
                    onClick={() => navigate("/agenda/agenda-report")}
                >
                    <div>
                        <div>
                            <TfiAgenda className={styles.icon} />
                        </div>
                        <h4>Agenda Report</h4>
                        <p>
                            Get insights into the agenda items and weekly progress in your organization.
                        </p>
                    </div>
                </div>
            </div>
        </StaffJobLandingLayout>
    );
}

export default AgendaLandingPage;