import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import UsersLogsScreen from "../../../../common/screens/UserLogsScreen/UserLogsScreen";


const AdminLogsApprovalPage = () => {
    const navigate = useNavigate();

    return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={'Work Logs'}
            hideSearchBar={true}
            newSidebarDesign={true}
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

export default AdminLogsApprovalPage;