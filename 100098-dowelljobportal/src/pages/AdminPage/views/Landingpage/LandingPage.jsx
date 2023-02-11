import React from 'react'
import './index.scss'
import backpage from './assets/backpage.svg'
import plus from './assets/plus.svg' ; 

import search from './assets/search.svg'
import Card from './component/Card';
import {Link} from 'react-router-dom'
const LandingPage = () => {
  return (
    <div className='landing-page'>
            
            <Link to="/"><img src={backpage} alt="" className={"backpage"} /></Link>
            <div className="add_new_job">
                        <div>
                        <button><img src={plus} alt="" /></button>
                        <h3>Add New Job</h3>
                        </div>
                        
                        <div className="input">
                                    <img src={search} alt="" />
                                    <input type="text" placeholder='Search by skill, job' />
                        </div>
            </div>
            <div className="cards">
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            </div>
    </div>
  )
}

export default LandingPage