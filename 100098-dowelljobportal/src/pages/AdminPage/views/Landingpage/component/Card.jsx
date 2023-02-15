import React from 'react'
import arrowright from '../assets/arrowright.svg'  ; 
import edit from '../assets/edit.svg' ; 
import {AiOutlineClockCircle} from 'react-icons/ai' ; 
import {CgDanger} from 'react-icons/cg' ; 
import { Link } from 'react-router-dom';
import './index.scss'
const style={
            fontSize:"24px" , 
            color:"#7C7C7C"
}
const Card = ({company_id , created_on , skills , job_title}) => {
  const date = () => {
    const today = new Date();
    const targetDate = created_on;
    const diffTime = Math.abs(today - targetDate);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMonths > 1) {
    return `${diffMonths} Monthes ago`
    } else if (diffWeeks > 1) {
      return `${diffWeeks} weeks ago`
    } else if (diffDays > 1) {
      return `${diffDays} days ago`
    } else if (diffHours > 1) {
      return `${diffHours} hours ago`
    } else if (diffMinutes > 1) {
      return `${diffMinutes} minutes ago`
    } else {
    return ("Less than 1 minute");
    }
  }
  return (
            <div className="card">
            <div className="card__header">
                        <h5>{job_title}</h5>
                        <Link to={"/edit-job"}><img src={edit} alt="" /></Link>
            </div>
            <div className="card__skill">
            <div><h6>Skills:</h6> <span>{skills}</span></div>
            <div>
              <h6>Active</h6>
            <input type="checkbox" id="switch" /><label for="switch">Toggle</label>

            </div>
            </div>

            <div className='card__footer'>
                        <div>
                        <p><AiOutlineClockCircle style={style}/> <span>{date() ? date() : 'asd'}</span></p>
                        <div className='line'></div>
                        <p><CgDanger style={style}/><span>2 candidates apply for this</span></p>
                        </div>
                        <button>
                        <span><Link to="/view-job" style={{color:"white"}}>View <img src={arrowright} alt="" /></Link></span>
                        </button>
            </div>
</div>
  )
}

export default Card