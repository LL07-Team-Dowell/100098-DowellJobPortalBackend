import DropdownButton from "../DropdownButton/Dropdown";


import "./style.css";


const AssignedProjectDetails = ({ showTask, assignedProject, availableProjects, handleSelectionClick, removeDropDownIcon, hrAttendancePageActive }) => {

    return <>
        <div className="project-details-container">
            {
                showTask ? hrAttendancePageActive ? <p>Attendance Details</p> : <p>Task Details</p> : <></>
            }
            <div className={`project-info-container ${showTask ? 'flex-end' : ''}`}>
                <p>Project</p>
                <DropdownButton currentSelection={assignedProject ? assignedProject : 'Hr Hiring'} selections={availableProjects} handleSelectionClick={handleSelectionClick} removeDropDownIcon={removeDropDownIcon} />
            </div>
        </div>
    </>
}

export default AssignedProjectDetails;
