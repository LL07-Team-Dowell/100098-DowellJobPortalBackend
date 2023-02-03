import React from 'react'
import arrowright from '../assets/arrowright.svg'  ; 
import edit from '../assets/edit.svg' ; 
import {AiOutlineClockCircle} from 'react-icons/ai' ; 
import {CgDanger} from 'react-icons/cg'
import './index.scss'
const style={
            fontSize:"24px" , 
            color:"#7C7C7C"
}
const Card = () => {
  return (
            <div className="card">
            <div className="card__header">
                        <h5>Business Plan Development</h5>
                        <img src={edit} alt="" />
            </div>
            <div className="card__skill">
            <div><h6>skills:</h6> <span>Business </span></div>
            <input type="checkbox" id="switch" /><label for="switch">Toggle</label>
            </div>

            <div className='card__footer'>
                        <div>
                        <p><AiOutlineClockCircle style={style}/> <span>Opened 1 week ago</span></p>
                        <div className='line'></div>
                        <p><CgDanger style={style}/><span>2 candidates apply for this</span></p>
                        </div>
                        <button>
                        <span>View <img src={arrowright} alt="" /></span>
                        </button>
            </div>
</div>
  )
}

export default Card