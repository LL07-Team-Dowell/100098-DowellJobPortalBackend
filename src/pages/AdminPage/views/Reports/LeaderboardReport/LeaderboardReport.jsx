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
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import { getAllOnBoardCandidate } from "../../../../../services/adminServices";
import { getSettingUserProfileInfo } from "../../../../../services/settingServices";
import { rolesDict } from "../../Settings/AdminSettings";

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
    const [ settingsUserList, setSettingsUserList ] = useState([]);
    const [ projectCountData, setProjectCountData ] = useState(null);
    const [ searchValue, setSearchValue ] = useState("");
    const [ currentRoleFilter, setCurrentRoleFilter ] = useState('');
    const [ dataToDisplay, setDataToDisplay ] = useState([]);

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
            "threshold": isPublicReportUser ? 
                Number(reportsUserDetails?.reportThreshold)
            : 
            threshold,
            "start_date": isPublicReportUser ? 
                formatDateForAPI(reportsUserDetails?.reportStartDate, 'report')
            :  
            formatDateForAPI(initialDatesSelection.startDate, 'report'),
            "end_date": isPublicReportUser ? 
                formatDateForAPI(reportsUserDetails?.reportEndDate, 'report')
            : 
            formatDateForAPI(initialDatesSelection.endDate, 'report'),
        }

        Promise.all([
            getAllOnBoardCandidate(
                isPublicReportUser
                  ? reportsUserDetails?.company_id
                : 
                currentUser?.portfolio_info[0].org_id
            ),
            generateCommonAdminReport(dataToPost),
            getSettingUserProfileInfo(),
        ])
        .then(res => {
            console.log(res[0]?.data?.response);
            const applicationsRes = res[0]?.data?.response?.data;
            setApplications(res[0]?.data?.response?.data)

            console.log(res[1]?.data?.response);

            const response = res[1]?.data?.response;
            const settingsInfo = isPublicReportUser ? 
            res[2]?.data
            ?.reverse()
            ?.filter(
                (item) => item.company_id === reportsUserDetails?.company_id
            )
            ?.filter(
                (item) => item.data_type === reportsUserDetails?.data_type
            )
            : res[2]?.data
            ?.reverse()
            ?.filter(
                (item) =>
                item.company_id === currentUser.portfolio_info[0].org_id
            )
            ?.filter(
                (item) =>
                item.data_type === currentUser.portfolio_info[0].data_type
            );

            const tasksArr = Object.keys(response?.users || {}).map(key => {
                const foundUserApplication = applicationsRes.find(application => application.username === key);
                const foundUserSettingItem = settingsInfo?.find(
                    (value) =>
                      value?.profile_info[value?.profile_info?.length - 1]
                        ?.profile_title === foundUserApplication?.portfolio_name
                );

                return { 
                    user:  foundUserApplication ?
                        foundUserApplication?.applicant
                    :
                    key
                    , 
                    roleSetting: foundUserSettingItem?.profile_info[
                        foundUserSettingItem?.profile_info?.length - 1
                    ],
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
            setSettingsUserList(settingsInfo);
            setProjectCountData({
                project_with_most_tasks: response?.project_with_most_tasks[0],
                project_with_least_tasks: response?.project_with_least_tasks[0],
            })

            setPageLoading(false);
        }).catch(err => {
            console.log(err);
            setPageLoading(false);
            setError(true);
        })
    }, [])

    useEffect(() => {

        if (!reportsData) return 

        const data = reportsData.map(dataItem => {
            
            if (currentRoleFilter !== 'All' && currentRoleFilter !== '') {
                const [ userRole, userOtherRoles ] = [
                    rolesDict[dataItem?.roleSetting?.Role] ? 
                        dataItem?.roleSetting?.Role
                    : 
                        "No role assigned"
                    ,
                    dataItem?.roleSetting?.other_roles ?
                        dataItem?.roleSetting.other_roles
                        .map((role) => {
                            if (!rolesDict[role]) return null;
                            return rolesDict[role];
                        })
                        :
                        []
                ]
    
                if (![userRole, ...userOtherRoles].includes(currentRoleFilter)) return null
    
                return dataItem                                        
            }

            return dataItem
        }).filter(item => item)

        setDataToDisplay(data);

    }, [currentRoleFilter, reportsData])

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
                const foundUserApplication = applications?.find(application => application.username === key);
                const foundUserSettingItem = settingsUserList?.find(
                    (value) =>
                      value?.profile_info[value?.profile_info?.length - 1]
                        ?.profile_title === foundUserApplication?.portfolio_name
                );

                return { 
                    user: foundUserApplication ?
                        foundUserApplication?.applicant
                    :
                    key
                    , 
                    roleSetting: foundUserSettingItem?.profile_info[
                        foundUserSettingItem?.profile_info?.length - 1
                    ],
                    ...response?.users[key] 
                }
            }).sort((a, b) => b.tasks - a.tasks);

            setHighestAndLowestData({ 
                highest: response?.highest,
                lowest: response?.lowest,
            })
            
            setReportsData(tasksArr);            
            setTotalTasks(tasksArr.reduce((a, b) => a + b.tasks, 0));
            setProjectCountData({
                project_with_most_tasks: response?.project_with_most_tasks[0],
                project_with_least_tasks: response?.project_with_least_tasks[0],
            })

            setNewDataLoading(false);
            setShowPopup(false);

        } catch (error) {
            setNewDataLoading(false);
            toast.info(
                error.response
                  ? error.response.status === 500
                    ? 'Report generation failed'
                    : error.response.data.message
                  : 'Report generation failed'
            );
        }
    }

    if (pageLoading) return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Leaderboard report"}
        >
            <LoadingSpinner />
            <p style={{ textAlign: 'center' }}>
                {
                    isPublicReportUser ? 'Generating report...'
                    :
                    'Generating report for last 7 days...'
                }
            </p>
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
                    {
                        !isPublicReportUser && <button className="generate__Level__Btn" onClick={() => setShowPopup(true)}>
                            Generate Report
                        </button>
                    }
                    <h4 style={{ marginBottom: 30, marginTop: '2rem' }}>
                        Showing report data from {new Date(datesSelection.startDate).toDateString()} to {new Date(datesSelection.endDate).toDateString()}
                    </h4>
                    <div className="indiv__Task__Rep__info">
                        <div className="leaderboard__Ranking__Wrapper top__Ranking">
                            <h4>Work logs Leaderboard</h4>
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
                                        <Tooltip id="first_rank" content={`Work logs: ${reportsData[0].tasks}`} />
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
                                        <Tooltip id="second_rank" content={`Work logs: ${reportsData[1].tasks}`} />
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
                                        <Tooltip id="third_rank" content={`Work logs: ${reportsData[2].tasks}`} />
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
                                        <Tooltip id="fourth_rank" content={`Work logs: ${reportsData[3].tasks}`} />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="task__Box">
                            <div className="task__item level">
                                <h4>
                                    User with the most work logs: {
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
                                                Work logs uploaded by user
                                            </p>
                                            <Tooltip id="highest_user_tasks" content={`Count: ${highestAndLowestData?.highest[Object.keys(highestAndLowestData?.highest || {})[0]]}`} />
                                        </div>
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator"></div>   
                                            <p
                                                data-tooltip-id="highest_total_tasks"
                                            >
                                                Total work logs in organization
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
                                    Users with the lowest work logs: {
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
                                                Work logs uploaded by user
                                            </p>
                                            <Tooltip id="lowest_user_tasks" content={`Count: ${highestAndLowestData?.lowest[Object.keys(highestAndLowestData?.lowest || {})[0]]}`} />
                                        </div>
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator"></div>   
                                            <p
                                                data-tooltip-id="lowest_total_tasks"
                                            >
                                                Total work logs in organization
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
                        <div className="task__Box" style={{ marginTop: 30 }}>
                            <div className="task__item level">
                                <h4>
                                    Project with the most work logs: {
                                        projectCountData?.project_with_most_tasks?.title
                                    }
                                </h4>
                                <div className="stat__Report">
                                    <div className="label__Wrapper">
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator active"></div>
                                            <p
                                                data-tooltip-id="highest_project_tasks"
                                            >
                                                Work logs uploaded in project
                                            </p>
                                            <Tooltip id="highest_project_tasks" content={`Count: ${projectCountData?.project_with_most_tasks?.tasks_added}`} />
                                        </div>
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator"></div>   
                                            <p
                                                data-tooltip-id="highest_total_tasks_proj"
                                            >
                                                Total work logs in organization
                                            </p>
                                            <Tooltip id="highest_total_tasks_proj" content={`Count: ${totalTasks}`} />
                                        </div>
                                    </div>
                                    <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar 
                                            value={Number(projectCountData?.project_with_most_tasks?.tasks_added / totalTasks * 100).toFixed(2)} 
                                            text={`${Number((projectCountData?.project_with_most_tasks?.tasks_added / totalTasks) * 100).toFixed(2)}%`} 
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
                                    Project with the lowest work logs: {
                                        projectCountData?.project_with_least_tasks?.title
                                    }
                                </h4>
                                <div className="stat__Report">
                                    <div className="label__Wrapper">
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator active"></div>
                                            <p
                                                data-tooltip-id="lowest_project_tasks"
                                            >
                                                Work logs uploaded in project
                                            </p>
                                            <Tooltip id="lowest_project_tasks" content={`Count: ${projectCountData?.project_with_least_tasks?.tasks_added}`} />
                                        </div>
                                        <div className="label__Wrapper__Item">
                                            <div className="label__Wrapper__Indicator"></div>   
                                            <p
                                                data-tooltip-id="lowest_total_tasks_proj"
                                            >
                                                Total work logs in organization
                                            </p>
                                            <Tooltip id="lowest_total_tasks_proj" content={`Count: ${totalTasks}`} />
                                        </div>
                                    </div>
                                    <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar 
                                            value={Number(projectCountData?.project_with_least_tasks?.tasks_added / totalTasks * 100).toFixed(2)} 
                                            text={`${Number((projectCountData?.project_with_least_tasks?.tasks_added / totalTasks) * 100).toFixed(2)}%`} 
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
                            <h4>
                                Rankings {
                                    currentRoleFilter !== '' && currentRoleFilter !== 'All' ?
                                        `for ${
                                            rolesDict[currentRoleFilter] ? 
                                                rolesDict[currentRoleFilter]
                                            : 
                                            "No role assigned"
                                        }`
                                    :
                                    ''
                                }
                            </h4>
                            <span style={{ fontSize: '0.7rem' }}>From {new Date(datesSelection.startDate).toDateString()} to {new Date(datesSelection.endDate).toDateString()}</span>
                            <div className="heading__Actions__Wrapper">
                                <div className="search__Wrapper">
                                    <AiOutlineSearch />
                                    <input 
                                        type="text"
                                        value={searchValue}
                                        onChange={({ target }) => setSearchValue(target.value)}
                                        placeholder="Search user"
                                    />
                                </div>
                                <div className="select__Status__Filter">
                                    <select onChange={({ target }) => setCurrentStatus(target.value)}>
                                        <option value={''} disabled selected>Select status</option>
                                        <option value={'All'}>All</option>
                                        <option value={'Passed'}>Passed</option>
                                        <option value={'Defaulter'}>Defaulter</option>
                                    </select>
                                </div>
                            </div>
                            <div className="select__Status__Filter single">
                                <select onChange={({ target }) => setCurrentRoleFilter(target.value)}>
                                    <option value={''} disabled selected>Filter role</option>
                                    <option value={'All'}>All</option>
                                    <option value={'candidate'}>Candidate</option>
                                    <option value={'Hr'}>Hr</option>
                                    <option value={'group_lead'}>Grouplead</option>
                                    <option value={'Proj_Lead'}>Teamlead</option>
                                </select>
                            </div>
                            <div className="ranking__Table_">
                                <table id="customers">
                                    <tr>
                                        <th>Rank</th>
                                        <th>User</th>
                                        <th>Work logs</th>
                                        <th>Role</th>
                                        <th>Other roles</th>
                                        <th>Status</th>
                                    </tr>
                                    <tbody>
                                        {
                                            currentStatus === 'Passed' || currentStatus === 'Defaulter' ?
                                            React.Children.toArray(
                                                dataToDisplay
                                                .filter(item => item.status === currentStatus)
                                                .filter(item => item.user?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                                            .map((dataItem, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{dataItem.user}</td>
                                                    <td>{dataItem.tasks}</td>
                                                    <td>
                                                        {
                                                            rolesDict[dataItem?.roleSetting?.Role]
                                                            ? rolesDict[dataItem?.roleSetting?.Role]
                                                            : "No role assigned"
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            dataItem?.roleSetting?.other_roles ?
                                                                dataItem?.roleSetting.other_roles
                                                                .map((role) => {
                                                                if (!rolesDict[role]) return null;
                                                                return rolesDict[role];
                                                                })
                                                                .join(", ")
                                                            :
                                                            'No other roles assigned'
                                                        }
                                                    </td>
                                                    <td>{dataItem.status}</td>
                                                </tr>
                                            }))
                                            :
                                            React.Children.toArray(
                                                dataToDisplay
                                                .filter(item => item.user?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                                            .map((dataItem, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{dataItem.user}</td>
                                                    <td>{dataItem.tasks}</td>
                                                    <td>
                                                        {
                                                            rolesDict[dataItem?.roleSetting?.Role]
                                                            ? rolesDict[dataItem?.roleSetting?.Role]
                                                            : "No role assigned"
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            dataItem?.roleSetting?.other_roles ?
                                                                dataItem?.roleSetting.other_roles
                                                                .map((role) => {
                                                                if (!rolesDict[role]) return null;
                                                                return rolesDict[role];
                                                                })
                                                                .join(", ")
                                                            :
                                                            'No other roles assigned'
                                                        }
                                                    </td>
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