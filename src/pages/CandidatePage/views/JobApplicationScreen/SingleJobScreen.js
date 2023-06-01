import React, { useEffect, useState } from "react";
import { BsCashStack } from "react-icons/bs";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { handleShareBtnClick } from "../../utils/helperFunctions";
import { dowellInfo, dowellLinks } from "../../utils/jobFormApplicationData";
import TitleNavigationBar from "../../../../components/TitleNavigationBar/TitleNavigationBar";
import { IoBookmarkSharp } from "react-icons/io5";
import { RiShareBoxFill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import { VscCalendar } from "react-icons/vsc";
import { BsClock } from "react-icons/bs";
import { useMediaQuery } from "@mui/material";
import { dowellLoginUrl } from "../../../../services/axios";
import { jobKeys } from "../../../AdminPage/utils/jobKeys";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";

const SingleJobScreen = () => {

    const { jobTitle } = useParams();
    const [ allJobs, setAllJobs ] = useState([]);
    const [ currentJob, setCurrentJob ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ jobSaved, setJobSaved ] = useState(false);
    const isLargeScreen = useMediaQuery("(min-width: 992px)");
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();

    useEffect(() => {

        // getJobs().then(res => {
        //     setAllJobs(res.data);
        //     setLoading(false);
        // }).catch(err => {
        //     console.log(err);
        //     setLoading(false);
        // })

    }, [])

    useEffect(() => {

        const formattedAllJobs = allJobs.map(job => ({ id: job.id, title: job.title.slice(-1) === " " ? job.title.slice(0, -1).toLocaleLowerCase().replaceAll("/", "-").replaceAll(" ", "-") : job.title.toLocaleLowerCase().replaceAll("/", "-").replaceAll(" ", "-") }))
        
        const foundJob = formattedAllJobs.find(job => job.title === jobTitle);

        if (!foundJob) return setCurrentJob(null);

        const currentJobDetails = allJobs.find(job => job.id === foundJob.id);
        setCurrentJob(currentJobDetails);

    }, [jobTitle, allJobs])

    const handleApplyBtnClick = () => {

        if (!currentUser) return window.location.href = dowellLoginUrl + `/apply/job/${currentJob.id}/`;

        navigate(`/apply/job/${currentJob.id}/form/`, { state: { currentUser: currentUser } });

    }

    const handleBackBtnClick = () => {
        navigate(`/jobs/?jobCategory=${currentJob.typeof === "Internship" ? "Intern" : currentJob.typeof}`, { state: { jobCategory:  currentJob.typeof === "Internship" ? "Intern" : currentJob.typeof}})
    }


    if (loading) return <LoadingSpinner />
    
    return <>
        <div className="candidate__Job__Application__Container">
            <TitleNavigationBar handleBackBtnClick={() => handleBackBtnClick()} />
            {
                !currentJob ? <>
                    <h1><b>Job posting not available</b></h1>

                    <div className='apply_Btn_Container'>
                        <button className="apply-btn" onClick={() => navigate("/jobs")}>Go To All Jobs</button>
                    </div>
                </> : 
                
                <>
                    <div className="job__Title__Container">
                        <div className="job__Title__Items">
                            <h1 className="job__Title"><b>{currentJob.title}</b></h1>
                            <p>Dowell Ux living lab</p>  
                        </div>
                        <div className="job__Share__Items">
                            <button className={`save__Btn grey__Btn ${jobSaved ? 'active' : ''}`} onClick={() => setJobSaved(!jobSaved)}>
                                { isLargeScreen && <span>{jobSaved ? "Saved": "Save"}</span> }
                                <IoBookmarkSharp className="save__Icon" />
                            </button>
                            <button className="share__Btn grey__Btn" onClick={() => handleShareBtnClick(currentJob.title, `Apply for ${currentJob.title} on Dowell!`, window.location)}>
                                { isLargeScreen && <span>Share</span> }
                                <IoMdShare />
                            </button>
                        </div>
                    </div>
                    <div className="job__Info__Container">
                        <div className="job__Skills__Info">
                            <span className="job__Skill__Wrapper">
                                <VscCalendar className="info__Icon" />
                                <span>Start Date:&nbsp;<span className="highlight__Job__Info">Immediately</span></span>
                            </span>
                            {
                                currentJob.others && currentJob.others[jobKeys.othersInternJobType] &&
                                <span className="job__Skill__Wrapper">
                                    <BusinessCenterIcon className="info__Icon" />
                                    <span>Job Type:&nbsp;<span className="highlight__Job__Info">{ currentJob.others[jobKeys.othersInternJobType]}</span></span>
                                </span>
                            }
                            {
                                currentJob.others && currentJob.others[jobKeys.othersResearchAssociateJobType] &&
                                <span className="job__Skill__Wrapper">
                                    <BusinessCenterIcon className="info__Icon" />
                                    <span>Job Type:&nbsp;<span className="highlight__Job__Info">{ currentJob.others[jobKeys.othersResearchAssociateJobType]}</span></span>
                                </span>
                            }
                            {
                                currentJob.others && currentJob.others[jobKeys.othersFreelancerJobType] && 
                                <span className="job__Skill__Wrapper">
                                    <BusinessCenterIcon className="info__Icon" />
                                    <span>Job Type:&nbsp;<span className="highlight__Job__Info">{ currentJob.others[jobKeys.othersFreelancerJobType]}</span></span>
                                </span>
                            }
                            {
                                currentJob.typeof === "Employee" && 
                                <span className="job__Skill__Wrapper">
                                    <BusinessCenterIcon className="info__Icon" />
                                    <span>Job Type:&nbsp;<span className="highlight__Job__Info">Full time</span></span>
                                </span>
                            }
                            <span className="job__Skill__Wrapper">
                                <BsClock className="info__Icon" />
                                <span>Duration:&nbsp;<span className="highlight__Job__Info">{ currentJob.time_period}</span></span>
                            </span>
                            {
                                currentJob.others && currentJob.others[jobKeys.paymentForJob] &&
                                <span className="job__Skill__Wrapper">
                                    <BsCashStack className="info__Icon" />
                                    <span>Payment:&nbsp;<span className="highlight__Job__Info">{currentJob.others[jobKeys.paymentForJob]}</span></span>
                                </span>
                            }
                        </div>
                        <div className="job__Quick__Apply__Container">
                            <button className="apply__Btn green__Btn" onClick={handleApplyBtnClick}>
                                <span>Apply</span>
                                <RiShareBoxFill />
                            </button>
                        </div>
                    </div>

                    <div className="job__About__Info">
                        <p className="job__About__Title paragraph__Title__Item">Description: </p>
                        <span>{currentJob.description}</span>
                    </div>

                    <div className="job__Skills__Info">
                        <p className="paragraph__Title__Item">Skills:</p>
                        <span>
                            { currentJob.skills }
                        </span>
                    </div>

                    <div className='apply_Btn_Container'>
                        <button className="apply__Btn green__Btn" onClick={handleApplyBtnClick}>
                            <span>Apply for Job</span>
                            <RiShareBoxFill />
                        </button>
                        <button className={`save__Btn grey__Btn ${jobSaved ? 'active' : ''}`} onClick={() => setJobSaved(!jobSaved)}>
                            <span>{jobSaved ? "Saved": "Save"}</span>
                            <IoBookmarkSharp />
                        </button>
                    </div>
                </>
            }
        </div>
        <div className="bottom__About__Dowell__Container">
            <div className="intro__Container">
                <div className="img__Container">
                    <img src={process.env.PUBLIC_URL + "/logos/logo-1.png"} alt="dowell logo" loading="lazy" />
                </div>
                <div className="info__Container">
                    <h2 className="about__Dowell__Title"><b>About D'Well Research</b></h2>
                    <p className="about__Dowell">{dowellInfo}</p>
                </div>
            </div>

            <div className="social__Icons__Container">
                {
                    React.Children.toArray(dowellLinks.map(dowellLink => {
                        return <a aria-label={dowellLink.title} href={dowellLink.link} rel="noopener noreferrer" target="_blank" className="social__Icon__Item">
                            {dowellLink.icon}
                        </a>
                    }))
                }
            </div>
        </div>
    </>

}

export default SingleJobScreen;
