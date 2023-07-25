import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { NavLink, useNavigate } from 'react-router-dom'
const Navbar = ({title , removeButton, color, noButtonBack, addTeamTask, addTeamTaskTitle, handleAddTeamTaskFunction}) => {
  const navigate = useNavigate()
  return (
    <nav className='create-new-team-header'>
        <div>
            <div>
                {noButtonBack ? null :<button className='back' onClick={()=>navigate(-1)}><MdOutlineArrowBackIosNew/></button>}
                {title !== undefined && <h1 style={{color:color? color: '#000'}}>{title}</h1>}
            </div>
            {!removeButton && <NavLink className='create-new-team-btn' to={"/create-task/create-new-team/"}>
              <BiPlus/> <span>Create New</span>
            </NavLink>}
            {
              addTeamTask && <button className='create-new-team-btn' onClick={handleAddTeamTaskFunction}><BiPlus/> <span>{addTeamTaskTitle}</span></button>
            }
        </div>
    </nav>
  )
}

export default Navbar