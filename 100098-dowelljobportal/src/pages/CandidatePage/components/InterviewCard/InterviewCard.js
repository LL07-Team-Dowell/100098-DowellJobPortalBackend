import { AiOutlineCheckCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { mutableNewApplicationStateNames } from "../../../../contexts/NewApplicationContext";
import { formatDateAndTime } from "../../../../helpers/helpers";
import { candidateStatuses } from "../../utils/candidateStatuses";
import "./style.css";


const InterviewCard = ({ interviewDetails, job, currentApplicationStatus, hrDiscordLink, guestUser }) => {
    const navigate = useNavigate();
    
    const handleClick = (e) => {
        e.preventDefault();
        // navigate("/applied/view_job_application", { state: { jobToView: job, applicationDetails: applicationDetails } });
    }

    const guestStyle = {
        height: 'unset',
    }

    return <>
        <div className="candidate__Interview__Card" style={guestUser ? guestStyle : {}}>
            <p className="job__Title">{job ? job.title : ""}</p>
            <p className="interview__Schedule__Item">{guestUser ? 'Interview to be scheduled' : `Interview scheduled (${(job.others[mutableNewApplicationStateNames.others_scheduled_interview_date] && job.others[mutableNewApplicationStateNames.others_scheduled_interview_date] !== "") ? formatDateAndTime(job.others[mutableNewApplicationStateNames.others_scheduled_interview_date]) : formatDateAndTime(interviewDetails.created)})`}</p>
            <Link className="view__Interview__Btn" to={"/applied/view-applications"} onClick={handleClick}>
                View details
            </Link>
            <div className="interview__Details__Container">
                <div className="interview__Status__Container">

                    <div className="interview__Status__Item">
                        <AiOutlineCheckCircle className={`${currentApplicationStatus === candidateStatuses.SELECTED ? 'status__Icon' : 'status__Icon__Xl'} green__Color`} />
                        <span className={`${currentApplicationStatus === candidateStatuses.SELECTED ? 'interview__Text' : 'interview__Text__No__Wrap'}`}>Interview with HR</span>
                    </div>

                    {
                        currentApplicationStatus === candidateStatuses.SELECTED && <>
                            <div className="vertical__Line"></div>

                            <div className="interview__Status__Item">
                                <AiOutlineCheckCircle className="status__Icon__Xl green__Color" />
                                <span className="interview__Text__Xl">Application sent to Team lead</span>
                            </div>
                        </>
                    }
                    
                </div>
                
                {
                    !guestUser && <div className="discord__Btn__Container">
                        <button onClick={() => window.location.href = currentApplicationStatus === candidateStatuses.SELECTED ? hrDiscordLink : "https://discord.gg/FkBxVUKsAq"}><a href={currentApplicationStatus === candidateStatuses.SELECTED ? hrDiscordLink : "https://discord.gg/FkBxVUKsAq"} rel="noopener" aria-label="join meeting on discord">Discord</a></button>
                        {
                            currentApplicationStatus === candidateStatuses.SELECTED ? 
                            <span>Join link to have meeting with Teamlead</span> :
                            <span>Join link to have meeting with HR</span>
                        }
                    </div>
                }
            </div>
        </div>
    </>
}

export default InterviewCard;