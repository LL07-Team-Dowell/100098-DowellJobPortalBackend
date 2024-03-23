import { GiNotebook } from "react-icons/gi";
import ItemFeatureCard from "../../../../common/components/ItemFeatureCard/ItemFeatureCard";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { PiTreeStructure } from "react-icons/pi";
import styles from "./styles.module.css";

const HRorganisationLandingPage = () => {
    const navigate = useNavigate();

    return <>
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
        >
            <div className={styles.wrapper}>
                <h2>Your Organization</h2>
                <div className={styles.features__Wrap}>
                    <ItemFeatureCard 
                        featureIcon={<GiNotebook />}
                        featureTitle={'Training'}
                        featureDescription={'Create training questions to accurately access your incoming talents'}
                        handleFeatureCardClick={() => navigate("/hr-training")}
                    />
                    <ItemFeatureCard 
                        featureIcon={<FaUsers />}
                        featureTitle={'Users'}
                        featureDescription={'View all users, assign leave and edit projects assigned to users in your organisation'}
                        handleFeatureCardClick={() => navigate("/all-users")}
                    />
                    <ItemFeatureCard 
                        featureIcon={<PiTreeStructure />}
                        featureTitle={'Organisation Structure'}
                        featureDescription={"Get an in-depth view into the organisational structure of your company"}
                        handleFeatureCardClick={() => navigate("/company-structure")}
                    />
                </div>
            </div>

        </StaffJobLandingLayout>
    </>
}

export default HRorganisationLandingPage;