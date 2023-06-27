import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav className='create-new-team-header'>
        <div>
            <div>
                <button className='back'><MdOutlineArrowBackIosNew/></button>
                <h1>All Teams</h1>
            </div>
            <NavLink className='create-new-team-btn' to={"/create-task/create-new-team/"}>
              <BiPlus/> <span>Create New</span>
            </NavLink>
        </div>
    </nav>
  )
}

export default Navbar