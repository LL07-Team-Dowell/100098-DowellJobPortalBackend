import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { NavLink, useNavigate } from 'react-router-dom'
const Navbar = ({title , removeButton}) => {
  const navigate = useNavigate()
  return (
    <nav className='create-new-team-header'>
        <div>
            <div>
                <button className='back' onClick={()=>navigate(-1)}><MdOutlineArrowBackIosNew/></button>
                <h1>{title}</h1>
            </div>
            {!removeButton && <NavLink className='create-new-team-btn' to={"/create-task/create-new-team/"}>
              <BiPlus/> <span>Create New</span>
            </NavLink>}
        </div>
    </nav>
  )
}

export default Navbar