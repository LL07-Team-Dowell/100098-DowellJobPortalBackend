import { useNavigate } from "react-router-dom";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import ApplicantDetails from "../../../TeamleadPage/components/ApplicationDetails/ApplicationDetails";
import Footer from "../../components/Footer/Footer";

import "./style.css";


const ViewAppliedJobScreen = ( { job, applicationDetails }) => {
    
    const navigate = useNavigate();

    return <>

        <div className="view__Applied__Jobs__Container">
            <TitleNavigationBar title={"Application Details"} handleBackBtnClick={() => navigate(-1)} />
            <div className="view__Job__Details">
                <h2><b>{job.title}</b></h2>
                <ApplicantDetails candidateApplicationPageActive={true} applicantData={applicationDetails} />
            </div>
        </div>
        <Footer />
    </>
}

export default ViewAppliedJobScreen;

