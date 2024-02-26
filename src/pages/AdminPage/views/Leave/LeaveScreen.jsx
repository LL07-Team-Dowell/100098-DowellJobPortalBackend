import styles from "./styles.module.css";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useEffect, useState } from "react";
import { getAllLeaveApplication } from "../../../../services/adminServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import Avatar from "react-avatar";
import { adminLeaveApplication, denyLeaveApplication } from "../../../../services/adminServices";
import { toast } from "react-toastify";

const LeaveScreen = () => {
    const { currentUser } = useCurrentUserContext();
    const screens = ['Pending Approval', 'Approved', 'Denied'];
    const [activeScreen, setActiveScreen] = useState(0);
    const [allLeaveApplications, setAllLeaveApplications] = useState([]);
    const [filteredLeaveApplications, setFilteredLeaveApplications] = useState([]);
    const [approveOrDeny, setApproveOrDeny] = useState(false)

    const handleOptionClick = (index) => {
        setActiveScreen(index);

        if (index === 0) {
            if (allLeaveApplications.some(application => application.Leave_Denied !== undefined)) {
                const filteredData = allLeaveApplications.filter(application => application.Leave_Denied === false && application.Leave_Approved === false);
                setFilteredLeaveApplications(filteredData);
                setApproveOrDeny(true);
            }
        } else if (index === 1) {
            if (allLeaveApplications.some(application => application.Leave_Denied !== undefined)) {
                const filteredData = allLeaveApplications.filter(application => application.Leave_Approved === true);
                setFilteredLeaveApplications(filteredData);
                setApproveOrDeny(false);
            }
        } else if (index === 2) {
            if (allLeaveApplications.some(application => application.Leave_Denied !== undefined)) {
                const filteredData = allLeaveApplications.filter(application => application.Leave_Denied === true);
                setFilteredLeaveApplications(filteredData);
                setApproveOrDeny(false);
            }
        }
    }

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = (await getAllLeaveApplication(currentUser?.portfolio_info[0]?.org_id)).data.response;
                setAllLeaveApplications(res);
                console.log('ressssssss', res);
            } catch (error) {
                console.error("Error fetching Applications", error);
            }
        };

        fetchApplications();
    }, [])

    const handleApproveApplication = async (_id, user_id) => {
        await adminLeaveApplication(_id, user_id).then(res => {
            toast.success('Leave Approved successfully.');
        }).catch(err => {
            toast.error('Unable to approve leave!');
        })
    }

    const handleDenyApplication = async (_id) => {
        await adminLeaveApplication(_id).then(() => {
            toast.success('Leave Denied successfully.');
        }).catch(() => {
            toast.error('Unable to deny application!');
        })
    }

    return (
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={'Leave'}
            newSidebarDesign={true}
        >
            <div className={styles.leave_main_wrap}>
                <div className={styles.switch_screen}>
                    {
                        screens.map((option, index) => (
                            <p
                                key={index}
                                className={`switch_option ${activeScreen === index ? 'active' : ''}`}
                                onClick={() => handleOptionClick(index)}
                            >
                                {option}
                            </p>
                        ))}
                </div>
                <div className={styles.leave_card_mainWrap}>
                    {
                        filteredLeaveApplications.map(application => (
                            <div key={application.id} className={styles.leave_card}>
                                <Avatar name={application?.applicant[0]}
                                    round={true}
                                    size='6rem'
                                    color="#005734"
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
                                        <div className={styles.button_container}>
                                            <button onClick={() => handleDenyApplication(application?._id, application.user_id)} className={styles.deny_leave}>Deny</button>
                                            <button onClick={() => handleApproveApplication(application?._id)}>Approve</button>
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                        ))}
                </div>
            </div>
        </StaffJobLandingLayout>
    )
}

export default LeaveScreen;