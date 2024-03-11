import styles from "./styles.module.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useEffect, useState } from "react";
import { getAllLeaveApplication } from "../../../../services/adminServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import Avatar from "react-avatar";
import { adminLeaveApplication, denyLeaveApplication } from "../../../../services/adminServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";

const LeaveScreen = () => {
    const { currentUser, allCompanyApplications, setAllCompanyApplications } = useCurrentUserContext();
    const screens = ['Pending Approval', 'Approved', 'Denied'];
    const [activeScreen, setActiveScreen] = useState(0);
    const [allLeaveApplications, setAllLeaveApplications] = useState([]);
    const [filteredLeaveApplications, setFilteredLeaveApplications] = useState([]);
    const [approveOrDeny, setApproveOrDeny] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproveLeaveLoading, setIsApproveLeaveLoading] = useState(false);
    const [isLeaveDenyLoading, setIsLeaveDenyLoading] = useState(false);
    const [loadingIndex, setLoadingIndex] = useState(null);

    const handleOptionClick = (index) => {
        setActiveScreen(index);

        if (index === 0) {
            if (allLeaveApplications?.some(application => application.Leave_Denied !== undefined)) {
                const filteredData = allLeaveApplications.filter(application => application.Leave_Denied === false && application.Leave_Approved === false);
                setFilteredLeaveApplications(filteredData);
                setApproveOrDeny(true);
            }
        } else if (index === 1) {
            if (allLeaveApplications?.some(application => application.Leave_Denied !== undefined)) {
                const filteredData = allLeaveApplications.filter(application => application.Leave_Approved === true);
                setFilteredLeaveApplications(filteredData);
                setApproveOrDeny(false);
            }
        } else if (index === 2) {
            if (allLeaveApplications?.some(application => application.Leave_Denied !== undefined)) {
                const filteredData = allLeaveApplications.filter(application => application.Leave_Denied === true);
                setFilteredLeaveApplications(filteredData);
                setApproveOrDeny(false);
            }
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchApplications = async () => {
            console.log('all applications', allCompanyApplications);
            try {
                const res = (await getAllLeaveApplication(currentUser?.portfolio_info[0]?.org_id))?.data?.response;
                setAllLeaveApplications(res);
                setFilteredLeaveApplications(res?.filter(application => application.Leave_Denied === false && application.Leave_Approved === false))
                console.log('resssssssss', res);
                setApproveOrDeny(true);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching Applications", error);
                toast.error('Error fetching leave application.');
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, [])


    const updatingAllCompanyApplications = (_id) => {
        const index = allCompanyApplications.findIndex(application => application?.status === candidateStatuses?.ONBOARDING && application?.user_id === _id);
        console.log('Index where condition is true:', index);
        setAllCompanyApplications(allCompanyApplications[index].status = candidateStatuses?.LEAVE);
    }

    const handleApproveApplication = async (_id, user_id) => {
        setIsApproveLeaveLoading(true);
        await adminLeaveApplication(_id, user_id).then(res => {
            toast.success('Leave Approved successfully.');
            updatingAllCompanyApplications(user_id);
            const index = allLeaveApplications.findIndex(application => (application._id === _id));

            const updatedApplications = [...allLeaveApplications];
            updatedApplications[index] = { ...updatedApplications[index], Leave_Approved: true };

            setAllLeaveApplications(updatedApplications);
            handleOptionClick(0);
            setIsApproveLeaveLoading(false);
        }).catch(err => {
            toast.error('Unable to approve leave!');
            setIsApproveLeaveLoading(false);
        })

    }

    const handleDenyApplication = async (_id) => {
        setIsLeaveDenyLoading(true);
        await adminLeaveApplication(_id).then(() => {
            toast.success('Leave Denied successfully.');
            const index = allLeaveApplications.findIndex(application => (application._id === _id));

            const updatedApplications = [...allLeaveApplications];
            updatedApplications[index] = { ...updatedApplications[index], Leave_Denied: true };

            setAllLeaveApplications(updatedApplications);
            setIsLeaveDenyLoading(false);
            handleOptionClick(0);
        }).catch(() => {
            toast.error('Unable to deny application!');
            setIsLeaveDenyLoading(false);
        })
    }

    return (
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={'Leave'}
            newSidebarDesign={true}
        >
            {isLoading ? <LoadingSpinner /> :
                <div className={styles.leave_main_wrap}>
                    <div className={styles.switch_screen}>
                        {
                            screens.map((option, index) => (
                                <p
                                    key={index}
                                    className={`${styles.switch_option} ${activeScreen === index ? `${styles.active}` : ''}`}
                                    onClick={() => handleOptionClick(index)}
                                >
                                    {option}
                                </p>
                            ))}
                    </div>
                    <div className={styles.leave_card_mainWrap}>
                        {
                            filteredLeaveApplications.map((application, index) => (
                                <div key={application.id} className={styles.leave_card}>
                                    <Avatar name={application?.applicant[0]}
                                        round={true}
                                        size='5rem'
                                        color="#0f5256"
                                        className={styles.avatar_wrap}
                                    />
                                    <div className={styles.info_leave}>
                                        <p><b>Applicant:</b> {application?.applicant}</p>
                                        <p><b>Leave Startt:</b> {application?.leave_start_date}</p>
                                        <p><b>Leave End:</b> {application?.leave_end_date}</p>
                                        {/* <p><b>Project:</b> {application?.project}</p> */}
                                        <p><b>Project:</b> {application && Array.isArray(application?.project) && application?.project.length > 0 ? application?.project.join(', ') : application?.project}</p>
                                    </div>
                                    {
                                        approveOrDeny ?
                                            // true ?
                                            <div className={styles.button_container}>
                                                <button onClick={() => {
                                                    handleDenyApplication(application?._id)
                                                    setLoadingIndex(index)
                                                }} className={styles.deny_leave}>
                                                    {loadingIndex === index && isLeaveDenyLoading ? <LoadingSpinner width={18} height={18} /> :
                                                        'Deny'
                                                    }</button>
                                                <button onClick={() => {
                                                    handleApproveApplication(application?._id, application.user_id)
                                                    setLoadingIndex(index)
                                                }
                                                }>
                                                    {loadingIndex === index && isApproveLeaveLoading ? <LoadingSpinner width={18} height={18} /> :
                                                        'Approve'
                                                    }</button>
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                            ))}
                    </div>
                </div>}
        </StaffJobLandingLayout >
    )
}

export default LeaveScreen;