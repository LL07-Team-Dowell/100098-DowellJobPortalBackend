import DropdownButton from "../DropdownButton/Dropdown";


import "./style.css";


const AssignedProjectDetails = ({ showTask, assignedProject, availableProjects, handleSelectionClick, removeDropDownIcon, hrAttendancePageActive }) => {
    
    return <>
        <div className="project-details-container">
            {
                showTask ? hrAttendancePageActive ? <p>Attendance Details</p> : <p>Work log Details</p> : <></>
            }
            <div className={`project-info-container ${showTask ? 'flex-end' : ''}`}>
                <p>Project</p>
                <DropdownButton 
                    currentSelection={assignedProject ? assignedProject : 'None selected'} 
                    selections={
                        availableProjects && Array.isArray(availableProjects) ?
                            availableProjects.sort((a, b) => a.localeCompare(b))
                        :
                        []
                    } 
                    handleSelectionClick={handleSelectionClick} 
                    removeDropDownIcon={removeDropDownIcon} 
                />
            </div>
        </div>
    </>
}

export default AssignedProjectDetails;
