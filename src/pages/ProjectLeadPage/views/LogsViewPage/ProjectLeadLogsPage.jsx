import { useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import UsersLogsScreen from "../../../../common/screens/UserLogsScreen/UserLogsScreen";
import styles from "./styles.module.css";


const ProjectLeadLogsPage = () => {
    const navigate = useNavigate();

    return <>
        <StaffJobLandingLayout
            projectLeadView={true}
            hideSearchBar={true}
        >
            <div className={styles.lead__Approval__View}>
                <TitleNavigationBar
                    handleBackBtnClick={() => navigate(-1)}
                    className={styles.back__Btn__Wrap}
                    buttonWrapClassName={styles.back__Btn}
                />
                <UsersLogsScreen
                    isApprovalView={true} 
                    limitProjectsAllowedToView={true}
                />
            </div>
        </StaffJobLandingLayout>
    </>
}

export default ProjectLeadLogsPage;