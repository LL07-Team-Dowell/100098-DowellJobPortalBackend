import { useSearchParams } from "react-router-dom";
import { getJobsFromAdmin } from "../../../services/adminServices";
import { React, useEffect, useState } from "react";
import { useCurrentUserContext } from "../../../contexts/CurrentUserContext";
import styles from './styles.module.css';
import JobCard from "../../../components/JobCard/JobCard";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Toast, toast } from "react-toastify";

const InternalJobApply = () => {
    const { currentUser } = useCurrentUserContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [allJobsFromAdmin, setAllJobsFromAdmin] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getJobsFromAdmin(currentUser?.portfolio_info[0]?.org_id).then(res => {
            console.log('ressss>>>>>>>>', res?.data?.response?.data, searchParams.get('type'));
            const filteredJobs = res?.data?.response?.data?.filter(job => {
                return job.type_of_opening === searchParams.get('type') && job.is_internal === true && currentUser?.portfolio_info[0]?.data_type === job?.data_type;
            });
            console.log('filtereddddd>>>>>>>>>>>>>>>>>.', filteredJobs);
            setAllJobsFromAdmin(filteredJobs);
            setIsLoading(false);
        }).catch(err => {
            console.log('errrr>>>>>>', err);
            setIsLoading(false);
        })
    }, [])

    const handleApplyClick = () => {
        return toast.success('Applied!...');
    }


    return (
        <div className={styles.main_div_wrap}>
            {
                isLoading ? <LoadingSpinner width={35} height={35} /> :
                    <div className={styles.job_main_wrap}>

                        {
                            // React.Children.toArray(
                            allJobsFromAdmin.map((jobs) => {
                                return <JobCard
                                    // key={index}
                                    job={{ job_title: jobs?.job_title, payment: jobs?.payment, time_interval: jobs?.time_interval, skills: jobs?.skills }}
                                    subtitle={jobs?.job_catagory}
                                    candidateViewJob={true}
                                    buttonText={"Apply"}
                                    className={styles.job_cards}
                                    handleBtnClick={handleApplyClick}
                                />
                                // return <div className={styles.job_cards}>
                                //     <p className={styles.job_title}>{jobs?.job_title}</p>
                                //     <p className={styles.other_info_}><b className={styles.other_info_tag}>Job Category:</b>{jobs?.job_catagory}</p>
                                //     <p><b>Skills:</b>{jobs?.skills}</p>
                                //     <p><b>Interval:</b>{jobs?.time_interval}</p>
                                //     <p><b>Payment:</b>{jobs?.payment}</p>
                                //     <button className={styles.apply_btn_}>
                                //         Apply
                                //         <AiOutlineArrowRight />
                                //     </button>
                                // </div>
                            })
                            // )
                        }
                    </div>}
        </div>
    )
}

export default InternalJobApply;