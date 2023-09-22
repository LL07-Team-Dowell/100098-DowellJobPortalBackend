import React, { useState } from "react";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useEffect } from "react";
import { generateCommonAdminReport } from "../../../../../services/commonServices";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { formatDateForAPI } from "../../../../../helpers/helpers";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import '../detailedIndividual/DetailedIndividual.scss';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Tooltip } from "react-tooltip";
import Avatar from "react-avatar";
import { BsAward } from "react-icons/bs";
import LittleLoading from "../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { getAllOnBoardCandidate } from "../../../../../services/adminServices";

const date = new Date();
const dateSevenDaysAgo = new Date(new Date().setDate(date.getDate() - 7));

const [
    todayDateFormattedForAPI,
    dateSevenDaysAgoFormattedForAPI,
] = [
    formatDateForAPI(date),
    formatDateForAPI(dateSevenDaysAgo),
];

const LeaderboardReport = ({ isPublicReportUser }) => {
    const initialDatesSelection = {
        startDate: dateSevenDaysAgoFormattedForAPI,
        endDate: todayDateFormattedForAPI,
    };
    
    const { currentUser, reportsUserDetails } =
        useCurrentUserContext();
    
    const [ datesSelection, setDatesSelection ] = useState({
        startDate: dateSevenDaysAgoFormattedForAPI,
        endDate: todayDateFormattedForAPI,
    });
    const [ pageLoading, setPageLoading ] = useState(true);
    const [ threshold, setThreshold ] = useState(30);
    const [ error, setError ] = useState(false);
    const [ reportsData, setReportsData ] = useState(null);
    const [ totalTasks, setTotalTasks ] = useState(0);
    const [ highestAndLowestData, setHighestAndLowestData ] = useState(null);
    const [ currentStatus, setCurrentStatus ] = useState(null);
    const [ showPopup, setShowPopup ] = useState(false);
    const [ newDataLoading, setNewDataLoading ] = useState(false);
    const [ applications, setApplications ] = useState([]);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (reportsData) return

        setError(false);
        setPageLoading(true);

        const dataToPost = {
            "report_type": "Level",
            "company_id": isPublicReportUser ? 
                reportsUserDetails?.company_id
            : 
                currentUser?.portfolio_info[0].org_id,
            "threshold": threshold,
            "start_date": formatDateForAPI(initialDatesSelection.startDate, 'report'),
            "end_date": formatDateForAPI(initialDatesSelection.endDate, 'report'),
        }

        Promise.all([
            getAllOnBoardCandidate(
                isPublicReportUser
                  ? reportsUserDetails?.company_id
                : 
                currentUser?.portfolio_info[0].org_id
            ),
            generateCommonAdminReport(dataToPost),
        ])
        .then(res => {
            console.log(res[0]?.data?.response);
            const applicationsRes = res[0]?.data?.response?.data;
            setApplications(res[0]?.data?.response?.data)

            console.log(res[1]?.data?.response);

            const response = res[1]?.data?.response;

            setPageLoading(false);

            const tasksArr = Object.keys(response?.users || {}).map(key => {
                return { 
                    user: applicationsRes.find(application => application.username === key) ?
                        applicationsRes.find(application => application.username === key)?.applicant
                    :
                    key
                    , 
                    ...response?.users[key] 
                }
            }).sort((a, b) => b.tasks - a.tasks);

            setHighestAndLowestData({ 
                highest: response?.highest,
                lowest: response?.lowest,
            })
            console.log(tasksArr);
            setReportsData(tasksArr);            
            setTotalTasks(tasksArr.reduce((a, b) => a + b.tasks, 0));
        }).catch(err => {
            console.log(err);
            setPageLoading(false);
            setError(true);
        })
    }, [])

    const generateNewData = async () => {
        setNewDataLoading(true);
        
        const dataToPost = {
            "report_type": "Level",
            "company_id": isPublicReportUser ? 
                reportsUserDetails?.company_id
            : 
                currentUser?.portfolio_info[0].org_id,
            "threshold": Number(threshold),
            "start_date": formatDateForAPI(datesSelection.startDate, 'report'),
            "end_date": formatDateForAPI(datesSelection.endDate, 'report'),
        }

        try {

            const res = (await generateCommonAdminReport(dataToPost)).data;
            const response = res?.response;
            
            const tasksArr = Object.keys(response?.users || {}).map(key => {
                return { 
                    user: applications.find(application => application.username === key) ?
                        applications.find(application => application.username === key)?.applicant
                    :
                    key
                    , 
                    ...response?.users[key] 
                }
            }).sort((a, b) => b.tasks - a.tasks);

            setHighestAndLowestData({ 
                highest: response?.highest,
                lowest: response?.lowest,
            })
            
            setReportsData(tasksArr);            
            setTotalTasks(tasksArr.reduce((a, b) => a + b.tasks, 0));
            setNewDataLoading(false);
            setShowPopup(false);

        } catch (error) {
            setNewDataLoading(false);
            toast.info('Something went wrong while trying to generate your report');
        }
    }

    if (pageLoading) return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Leaderboard report"}
        >
            <LoadingSpinner />
            <p style={{ textAlign: 'center' }}>Generating report for last 7 days...</p>
        </StaffJobLandingLayout>
    </>
    
    if (error) return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Leaderboard report"}
        >
            <p style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>An error occured while trying to generate your report</p>
        </StaffJobLandingLayout>
    </>

    return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Leaderboard report"}
        >
            <div className="detailed_indiv_container">
                <div className="task__report__nav">
                {isPublicReportUser ? (
                    <>
                    <h2>Leaderboard report</h2>
                    </>
                ) : (
                    <>
                    <button className="back" onClick={() => navigate(-1)}>
                        <MdArrowBackIosNew />
                    </button>
                    <h2>Leaderboard Report</h2>
                    </>
                )}
                </div>
                <p style={{ fontSize: "0.9rem" }}>
                    Get insights into the top performers in your organization
                </p>
                <div className="selction_container leaderboard">
                    <button className="generate__Level__Btn" onClick={() => setShowPopup(true)}>
                        Generate Report
                    </button>
                    <h4 style={{ marginBottom: 30 }}>
                        Showing report data from {new Date(datesSelection.startDate).toDateString()} to {new Date(datesSelection.endDate).toDateString()}
                    </h4>
                    <div className="indiv__Task__Rep__info">
                        <div className="leaderboard__Ranking__Wrapper top__Ranking">
                            <h4>Tasks Leaderboard</h4>
                            <div className="rankingss">
                                {
                                    reportsData[0] && <div className="task__item leaderboard" data-tooltip-id="first_rank">
                                        <div className="outline__Tile first"></div>
                                        <div className="user__detail">
                                            <Avatar
                                                name={reportsData[0].user}
                                                size={40}
                                                round
                                                color="#005734"
                                            />
                                            <p>{reportsData[0].user}</p>
                                        </div>
                                        <p className="ranking__Stat first">1</p>
                                        <div className="award__Badge first">
                                            <BsAward />
                                        </div>
                                        <Tooltip id="first_rank" content={`Tasks: ${reportsData[0].tasks}`} />
                                    </div>
                                }
                                {
                                    reportsData[1] && <div className="task__item leaderboard" data-tooltip-id="second_rank">
                                        <div className="outline__Tile second"></div>
                                        <div className="user__detail">
                                            <Avatar
                                                name={reportsData[1].user}
                                                size={40}
                                                round
                                                color="orange"
                                            />
                                            <p>{reportsData[1].user}</p>
                                        </div>
                                        <p className="ranking__Stat second">2</p>
                                        <div className="award__Badge second">
                                            <BsAward />
                                        </div>
                                        <Tooltip id="second_rank" content={`Tasks: ${reportsData[1].tasks}`} />
                                    </div>
                                }
                                {
                                    reportsData[2] && <div className="task__item leaderboard" data-tooltip-id="third_rank">
                                        <div className="outline__Tile third"></div>
                                        <div className="user__detail">
                                            <Avatar
                                                name={reportsData[2].user}
                                                size={40}
                                                round
                                                color="blue"
                                            />
                                            <p>{reportsData[2].user}</p>
                                        </div>
                                        <p className="ranking__Stat third">3</p>
                                        <div className="award__Badge third">
                                            <BsAward />
                                        </div>
                                        <Tooltip id="third_rank" content={`Tasks: ${reportsData[2].tasks}`} />
                                    </div>
                                }
                                {
                                    reportsData[3] && <div className="task__item leaderboard" data-tooltip-id="fourth_rank">
                                        <div className="outline__Tile fourth"></div>
                                        <div className="user__detail">
                                            <Avatar
                                                name={reportsData[3].user}
                                                size={40}
                                                round
                                                color="purple"
                                            />
                                            <p>{reportsData[3].user}</p>
                                        </div>
                                        <p className="ranking__Stat fourth">4</p>
                                        <div className="award__Badge fourth">
                                            <BsAward />
                                        </div>
                                        <Tooltip id="fourth_rank" content={`Tasks: ${reportsData[3].tasks}`} />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="task__Box">
                            <div className="task__item level">
                                <h4>
                                    User with the most tasks: {
                                        applications.find(application => application.username === Object.keys(highestAndLowestData?.highest || {})[0]) ?
                                            applications.find(application => application.username === Object.keys(highestAndLowestData?.highest || {})[0])?.applicant
                                        :
                                        Object.keys(highestAndLowestData?.highest || {})[0]
                                    }
                                </h4>
                                <div className="stat__Report">
                                    <div className="label__Wrapper">
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator active"></div>
                                            <p
                                                data-tooltip-id="highest_user_tasks"
                                            >
                                                Tasks uploaded by user
                                            </p>
                                            <Tooltip id="highest_user_tasks" content={`Count: ${highestAndLowestData?.highest[Object.keys(highestAndLowestData?.highest || {})[0]]}`} />
                                        </div>
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator"></div>   
                                            <p
                                                data-tooltip-id="highest_total_tasks"
                                            >
                                                Total tasks in organization
                                            </p>
                                            <Tooltip id="highest_total_tasks" content={`Count: ${totalTasks}`} />
                                        </div>
                                    </div>
                                    <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar 
                                            value={Number(highestAndLowestData?.highest[Object.keys(highestAndLowestData?.highest || {})[0]] / totalTasks * 100).toFixed(2)} 
                                            text={`${Number((highestAndLowestData?.highest[Object.keys(highestAndLowestData?.highest || {})[0]] / totalTasks) * 100).toFixed(2)}%`} 
                                            styles={
                                                buildStyles({
                                                    pathColor: `#005734`,
                                                    textColor: '#005734',
                                                    trailColor: '#efefef',
                                                    backgroundColor: '#005734',
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="task__item level">
                                <h4>
                                    Users with the lowest tasks: {
                                        Object.keys(highestAndLowestData?.lowest || {}).map(key => {
                                            const foundCandidateApplication = applications.find(application => application.username === key);
                                            if (foundCandidateApplication) return foundCandidateApplication?.applicant
                                            return key
                                        }).join(', ')
                                    }
                                </h4>
                                <div className="stat__Report">
                                    <div className="label__Wrapper">
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator active"></div>
                                            <p
                                                data-tooltip-id="lowest_user_tasks"
                                            >
                                                Tasks uploaded by user
                                            </p>
                                            <Tooltip id="lowest_user_tasks" content={`Count: ${highestAndLowestData?.lowest[Object.keys(highestAndLowestData?.lowest || {})[0]]}`} />
                                        </div>
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator"></div>   
                                            <p
                                                data-tooltip-id="lowest_total_tasks"
                                            >
                                                Total tasks in organization
                                            </p>
                                            <Tooltip id="lowest_total_tasks" content={`Count: ${totalTasks}`} />
                                        </div>
                                    </div>
                                    <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar 
                                            value={Number(highestAndLowestData?.lowest[Object.keys(highestAndLowestData?.lowest || {})[0]] / totalTasks * 100).toFixed(2)} 
                                            text={`${Number((highestAndLowestData?.lowest[Object.keys(highestAndLowestData?.lowest || {})[0]] / totalTasks) * 100).toFixed(2)}%`} 
                                            styles={
                                                buildStyles({
                                                    pathColor: `#005734`,
                                                    textColor: '#005734',
                                                    trailColor: '#efefef',
                                                    backgroundColor: '#005734',
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="leaderboard__Ranking__Wrapper">
                            <h4>Rankings</h4>
                            <div className="select__Status__Filter">
                                <select onChange={({ target }) => setCurrentStatus(target.value)}>
                                    <option value={''} disabled selected>Select status</option>
                                    <option value={'All'}>All</option>
                                    <option value={'Passed'}>Passed</option>
                                    <option value={'Defaulter'}>Defaulter</option>
                                </select>
                            </div>
                            <div className="ranking__Table_">
                                <table id="customers">
                                    <tr>
                                        <th>Rank</th>
                                        <th>User</th>
                                        <th>Tasks</th>
                                        <th>Status</th>
                                    </tr>
                                    <tbody>
                                        {
                                            currentStatus === 'Passed' || currentStatus === 'Defaulter' ?
                                            React.Children.toArray(reportsData.filter(item => item.status === currentStatus).map((dataItem, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{dataItem.user}</td>
                                                    <td>{dataItem.tasks}</td>
                                                    <td>{dataItem.status}</td>
                                                </tr>
                                            }))
                                            :
                                            React.Children.toArray(reportsData.map((dataItem, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{dataItem.user}</td>
                                                    <td>{dataItem.tasks}</td>
                                                    <td>{dataItem.status}</td>
                                                </tr>
                                            }))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            {
                showPopup &&
                <FormDatePopup
                    closeModal={
                        newDataLoading ? () => {} 
                        : 
                        () => {
                            setShowPopup(false)
                            setThreshold(30)
                            setDatesSelection(initialDatesSelection)
                        }
                    }
                    firstDate={datesSelection.startDate}
                    setFirstDate={(val) => setDatesSelection((prev) => { return {...prev, startDate: val}})}
                    lastDate={datesSelection.endDate}
                    setLastDate={(val) => setDatesSelection((prev) => { return {...prev, endDate: val}})}
                    isLoading={newDataLoading}
                    handleSubmit={generateNewData}
                    threshold={threshold}
                    setThreshold={setThreshold}
                />
            }
        </StaffJobLandingLayout>
    </>
}


const FormDatePopup = ({
    setFirstDate,
    setLastDate,
    firstDate,
    lastDate,
    handleSubmit,
    isLoading,
    closeModal,
    threshold,
    setThreshold,
}) => {

    const handleChange = (val) => {
        const filteredValue = val.replace(/\D/g, "");
        setThreshold(filteredValue);
    }

    return (
        <div className="overlay">
            <div className="form_date_popup_container">
                <div className="closebutton" onClick={() => closeModal()}>
                    <AiOutlineClose />
                </div>
                <label htmlFor="first_date">Threshold</label>
                <input
                    type="number"
                    onChange={(e) => handleChange(e.target.value)}
                    value={threshold}
                />

                <label htmlFor="first_date">Start Date</label>
                <input
                    type="date"
                    onChange={(e) => setFirstDate(e.target.value)}
                    value={firstDate}
                />
                <label htmlFor="first_date">End Date</label>
                <input
                    type="date"
                    placeholder="mm/dd/yy"
                    onChange={(e) => setLastDate(e.target.value)}
                    value={lastDate}
                />
                {
                    isLoading ? <LittleLoading /> : <button onClick={handleSubmit}>Generate</button>
                }
            </div>
        </div>
    );
};

export default LeaderboardReport;