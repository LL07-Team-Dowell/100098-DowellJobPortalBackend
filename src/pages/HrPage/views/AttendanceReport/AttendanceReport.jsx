import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import './style.css';
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getAllOnBoardedCandidate } from "../../../../services/candidateServices";

const AttendanceReport = () => {
    //dummy data
    const data = [
        { name: "John Doe", attendanceDetails: [true, true, false, true, true, true, false], event: "Meeting" },
        { name: "Jane Doe", attendanceDetails: [false, true, true, true, true, false, true], event: "Training" },
        { name: "Bob Smith", attendanceDetails: [true, true, false, false, true, true, true], event: "Conference" },
        { name: "John Doe", attendanceDetails: [true, true, false, true, true, true, false], event: "Meeting" },
        { name: "Jane Doe", attendanceDetails: [false, true, true, true, true, false, true], event: "Training" },
        { name: "Bob Smith", attendanceDetails: [true, true, true, true, true, true, true], event: "Conference" },
        { name: "John Doe", attendanceDetails: [true, true, false, true, true, true, false], event: "Meeting" },
        { name: "Jane Doe", attendanceDetails: [false, true, true, true, true, false, true], event: "Training" },
        { name: "Bob Smith", attendanceDetails: [true, true, true, true, true, true, true], event: "Conference" },
    ];


    const [selectedUser, setSelectedUser] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showAttendaceReport, setShowAttendaceReport] = useState(false);
    const { currentUser } = useCurrentUserContext();
    const [candidateOptions, setCandidateOptions] = useState([]);

    useEffect(() => {
        getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id).then(res => {
            const onboardingCandidates = res?.data?.response?.data;
            
            const options = onboardingCandidates.map(candidate => ({
                value: candidate._id,
                label: candidate.applicant,
            }));
            setCandidateOptions(options);
        }).catch(err => {
            console.log('onboarded failed to load');
        })
    }, [])

    const handleChange = (selectedOptions) => {
        setSelectedUser(selectedOptions);
    };

    const handleGetAttendanceClick = () => {
        if (selectedUser.length === 0 && startDate === "") {
            return toast.error("Please select user(s) and a start date.");
        } else if (selectedUser.length === 0) {
            return toast.error("Please select user(s).");
        } else if (startDate === "") {
            return toast.error("Please select a start date.");
        } else {
            setShowAttendaceReport(true);
        }
    }

    const renderAttendanceCircles = (attendanceDetails) => {
        return attendanceDetails.map((isPresent, index) => (
            <div
                key={index}
                className={`attendance-circle ${isPresent ? 'present' : 'absent'}`}
            ></div>
        ));
    };

    useEffect(() => {
        if (startDate) {
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 7);
            setEndDate(newEndDate.toISOString().split('T')[0]);
        }
    }, [startDate]);

    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
        >
            <section className="att_report_main">
                <h3>Attendance</h3>
                <div className="check">
                    <div className="item__Filter__Wrap">
                        <p>Select User:</p>
                        <Select
                            options={candidateOptions}
                            isMulti={true}
                            value={selectedUser}
                            onChange={handleChange}
                            className="item__Filter"
                        />
                    </div>
                    {/* <div className="internal_div"> */}
                    <div className="item__Filter__Wrap">
                        <p>Start Date</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="att__Date__Input"
                        />
                    </div>

                    <div className="item__Filter__Wrap">
                        <p>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            readOnly
                            className="att__Date__Input"
                        />
                    </div>
                    <button onClick={handleGetAttendanceClick} className="hr__Att__Btn">Get Attendance</button>
                    {/* </div> */}
                </div>
                {
                    showAttendaceReport &&
                    <div className="att_rep">
                        <div className="tbl_rep">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Attendance Detail</th>
                                        <th>Event</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.name}</td>
                                            <td>{renderAttendanceCircles(row.attendanceDetails)}</td>
                                            <td>{row.event}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>}
            </section>
        </StaffJobLandingLayout>
    );
}

export default AttendanceReport;