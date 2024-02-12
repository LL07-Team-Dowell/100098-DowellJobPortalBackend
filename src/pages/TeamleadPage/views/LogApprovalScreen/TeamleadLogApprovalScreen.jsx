import { useNavigate } from "react-router-dom";
import UsersLogsScreen from "../../../../common/screens/UserLogsScreen/UserLogsScreen"
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import styles from "./styles.module.css";


const TeamleadLogApprovalScreen = () => {
    const navigate = useNavigate();

    return <>
        <StaffJobLandingLayout
            teamleadView={true}
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

export default TeamleadLogApprovalScreen;