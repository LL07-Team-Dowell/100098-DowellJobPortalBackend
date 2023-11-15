import React, { useState } from "react";
import styles from './styles.module.css';
import { useEffect } from "react";
import { getWorklogDetailsWithinTimeframe } from "../../services/commonServices";
import { formatDateForAPI } from "../../helpers/helpers";
import Overlay from "../Overlay";
import { AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import HorizontalBarLoader from "../HorizontalBarLoader/HorizontalBarLoader";
import { toast } from "react-toastify";


const WeeklogsCount = ({ user, className }) => {
    const [ logData, setLogData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ dataLoaded, setDataLoaded ] = useState(false);
    const [ showOverlay, setShowOverlay ] = useState(false);
    const [ startDate, setStartDate ] = useState('');
    const [ startDateCopy, setStartDateCopy ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ endDateCopy, setEndDateCopy ] = useState('');
    const [ customLogDataLoading, setCustomDataLoading ] = useState(false);
    const [ customLogData, setCustomData ] = useState(null);
    const [ showSecondPage, setShowSecondPage ] = useState(false);

    const calculateHours = (logsPassed) => {
        const hourGapBetweenLogs = logsPassed.map(log => {
          const [ startTime, endTime ] = [ new Date(`${log.task_created_date} ${log.start_time}`), new Date(`${log.task_created_date} ${log.end_time}`) ]
          if (startTime == 'Invalid Date' || endTime == 'Invalid Date') return 0
    
          const diffInMs = Math.abs(endTime - startTime);
          return  diffInMs / (1000 * 60 * 60);
        });
    
        const totalHours = Number(hourGapBetweenLogs.reduce((x, y) => x + y , 0)).toFixed(2)
        return totalHours
    }

    useEffect(() => {

        if (!user || dataLoaded) return

        setLoading(true);

        const today = new Date();
        const mondayOfThisWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay() + 1)).setHours(0, 0, 0, 0));
        const sundayOfNextWeek = new Date(new Date().setDate(mondayOfThisWeek.getDate() + 6));

        getWorklogDetailsWithinTimeframe(
            '2023-11-01',
            '2023-11-15',
            // formatDateForAPI(mondayOfThisWeek),
            // formatDateForAPI(sundayOfNextWeek),
            user?.userinfo?.userID,
            user?.portfolio_info[0]?.org_id,
        ).then(res => {
            console.log(res.data);
            setLogData(res.data?.task_details);
            setLoading(false);
            
            setStartDate(mondayOfThisWeek);
            setStartDateCopy(mondayOfThisWeek);

            setEndDate(sundayOfNextWeek);
            setEndDateCopy(sundayOfNextWeek);

            setDataLoaded(true);
        }).catch(err => {
            console.log('err getting log count and hours: ', err?.response ? err?.response?.data : err?.message);
            setLoading(false);
        })

    }, [])

    const handleCloseModal = () => {
        setStartDateCopy(startDate);
        setEndDateCopy(endDate);

        setShowOverlay(false);
        setCustomData(null);
    }

    const handleGenerateCustomData = async () => {
        if (startDateCopy > endDateCopy) return toast.info('The start date you select has to be less than the end date selected')

        setCustomDataLoading(true);

        try {
            const res = (await getWorklogDetailsWithinTimeframe(startDateCopy, endDateCopy, user?.userinfo?.userID, user?.portfolio_info[0]?.org_id)).data;
            
            setCustomData(res?.task_details);
            setCustomDataLoading(false);

            setShowSecondPage(false);
        } catch (error) {
            setCustomDataLoading(false);
            toast.error('An error occured while trying to get your logs for custom range');
        }
    }

    if (!user) return

    return <>
        <div className={`${className} ${styles.wrapper}`}>
            <h1 className={styles.heading}>Hello {user?.userinfo?.first_name} {user?.userinfo?.last_name},</h1>
            <p className={styles.info__Item}>
                {
                    loading ? <>
                        <span>Crunching the latest data for you...</span>
                    </> :
                    <>
                        <span>
                            You have a total of {logData?.length} {logData?.length > 1 ? 'logs' : 'log'} and {calculateHours(logData)} hours this week
                        </span>
                        <button 
                            className={styles.btn}
                            onClick={() => setShowOverlay(true)}
                        >
                            View Details
                        </button>
                    </>
                }
            </p>
            {
                showOverlay && <Overlay className={styles.overlay_}>
                    <div className={styles.modal__Container}>
                        {
                            showSecondPage ? <div 
                                className={styles.back} 
                                onClick={
                                    customLogDataLoading ? 
                                        () => {} 
                                    :
                                    () => setShowSecondPage(false)
                                }
                            >
                                <AiOutlineArrowLeft />
                            </div>
                            :
                            <div className={styles.close} onClick={handleCloseModal}>
                                <AiOutlineClose />
                            </div>
                        }
                        <h2 className={styles.log__Title}>
                            {
                                showSecondPage ? 
                                    'Get your log details between date range' 
                                :
                                `Log details from ${new Date(startDateCopy).toDateString()} to ${new Date(endDateCopy).toDateString()}`
                            }
                        </h2>
                        <div className={styles.table__Wrap}>
                            {
                                customLogDataLoading ? <div className={styles.load__text}>
                                    <p>Generating...</p>
                                </div>
                                :
                                showSecondPage ?
                                    <>
                                        <label 
                                            htmlFor="start"
                                            className={styles.label_}
                                        >
                                            <span>Start Date</span>
                                            <input
                                                type="date"
                                                value={formatDateForAPI(startDateCopy)}
                                                onChange={({ target }) =>
                                                    setStartDateCopy(target.value)
                                                }
                                                id="start"
                                            />
                                        </label>

                                        <br />

                                        <label 
                                            htmlFor="end"
                                            className={styles.label_}
                                        >
                                            <span>End Date</span>
                                            <input
                                                type="date"
                                                value={formatDateForAPI(endDateCopy)}
                                                onChange={({ target }) =>
                                                    setEndDateCopy(target.value)
                                                }
                                                id="end"
                                            />
                                        </label>
                                    </>
                                :
                                    customLogData && customLogData?.length < 1 ?

                                    <div className={styles.load__text}>
                                        <p>You have no logs between {new Date(startDateCopy).toDateString()} and {new Date(endDateCopy).toDateString()}</p>
                                    </div>

                                :
                                    logData && logData?.length < 1 ?
                                    <div className={styles.load__text}>
                                        <p>You have no logs between {new Date(startDateCopy).toDateString()} and {new Date(endDateCopy).toDateString()}</p>
                                    </div>

                                :
                                <>
                                    <table id="customers">
                                        <tr>
                                            <th>S/N</th>
                                            <th>Date added</th>
                                            <th>Time started</th>
                                            <th>Time finished</th>
                                            <th>Work log</th>
                                            <th>Work log type</th>
                                            <th>Work log approved</th>
                                            <th>sub project</th>
                                        </tr>
                                        <tbody>
                                        {
                                            React.Children.toArray(
                                                customLogData ? 
                                                    customLogData 
                                                    : 
                                                    logData
                                                ?.reverse()
                                                ?.map((task, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}.</td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? ""
                                                                : "deleted"
                                                            }
                                                        >
                                                            {new Date(
                                                                task.task_created_date
                                                            ).toDateString()}
                                                        </td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? ""
                                                                : "deleted"
                                                            }
                                                        >
                                                            {task.start_time}
                                                        </td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? ""
                                                                : "deleted"
                                                            }
                                                        >
                                                            {task.end_time}
                                                        </td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? ""
                                                                : "deleted"
                                                            }
                                                        >
                                                            {task.task}
                                                        </td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? ""
                                                                : "deleted"
                                                            }
                                                        >
                                                            {task.task_type}
                                                        </td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? task.approved
                                                                    ? "approved"
                                                                    : "not__Approved"
                                                                : "deleted"
                                                            }
                                                        >
                                                            {task.approved ? "Yes" : "No"}
                                                        </td>
                                                        <td
                                                            className={
                                                                task.is_active &&
                                                                task.is_active === true
                                                                ? ""
                                                                : "deleted"
                                                            }
                                                        >
                                                            {task.subproject}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                        </tbody>
                                    </table>
                                </>
                            }
                        </div>
                        {
                            customLogDataLoading ? 
                                <div className={styles.load__Wrap}>
                                    <HorizontalBarLoader height={'1.3rem'} />
                                </div>
                            :
                            <button 
                                className={styles.btn}
                                onClick={
                                    showSecondPage ? () => handleGenerateCustomData()
                                        :
                                    () => setShowSecondPage(true)
                                }
                            >
                                {
                                    showSecondPage ?
                                        'Generate'
                                    :
                                    'Generate Custom'
                                }
                            </button>
                        }
                       
                    </div>
                </Overlay>
            }
        </div>
    </>
}

export default WeeklogsCount;