import React, { useEffect, useRef, useState } from "react";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import JobCategoryCard from "../../components/JobCategoryCard/JobCategoryCard";
import videoItem from "../../../../assets/videos/intro-video.mp4"
import { FaPlay, FaPause } from "react-icons/fa";
import employeeImageItem from "../../../../assets/images/human-resource.png"
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";


const EmployeeJobScreen = () => {
    const videoRef = useRef(null);
    const [ isVideoPlaying, setVideoPlaying ] = useState(false);
    const [ isMouseOver, setMouseOver ] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();
    
    const handleJobCategoryCardClick = () => {
        navigate("/jobs?jobCategory=Employee")
    }

    const handlePlayBtnClick = () => {
        if (!videoRef.current) return

        setVideoPlaying(!isVideoPlaying);

        if (isVideoPlaying) return videoRef.current.pause();
        videoRef.current.play();
    }

    useEffect(() => {

        if (videoRef.current && videoRef.current.ended) return setVideoPlaying(false)

    }, [isMouseOver])

    return <>
        <JobLandingLayout user={currentUser}>
            <div className="candidate__Jobs__Screen__Container" onMouseOver={() => setMouseOver(!isMouseOver)}>
                <div className="intro__Container">
                    <div className="left__Intro__Content">
                        <h1 className="job__Screen__Title"><b>Join Dowell Team as an Employee</b></h1>
                        <div className="job__Cards__Container">
                            <JobCategoryCard 
                                title={"Employee jobs"} 
                                subtitle={"View all"}
                                categoryImage={employeeImageItem}
                                handleCardClick={() => handleJobCategoryCardClick()}
                            />
                        </div>
                    </div>
                    <div className="right__Intro__Content" onMouseOver={() => setMouseOver(!isMouseOver)}>
                        <video controls={false} ref={videoRef}>
                            <source src={videoItem} />
                        </video>
                        <div className="play__Btn" onClick={handlePlayBtnClick}>{!isVideoPlaying ? <FaPlay className="play__Icon" /> : <FaPause className="play__Icon" />}</div>
                        <div className="right__Intro__Content__Bg__Shadow"></div>
                    </div>
                </div>
            </div>
        </JobLandingLayout>
    </>
}

export default EmployeeJobScreen;