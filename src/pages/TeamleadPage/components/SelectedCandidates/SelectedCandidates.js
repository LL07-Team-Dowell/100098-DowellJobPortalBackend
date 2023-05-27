import Close from "@mui/icons-material/Close";
import FilterIcon from "../FilterIcon/FilterIcon";
import { IoCalendarClearOutline } from "react-icons/io5";

import "./style.css";
import { MdOutlineWorkOutline, MdHourglassDisabled } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";


const SelectedCandidates = ({ showTasks, candidatesCount, tasksCount, hrPageActive, title, className, sortActive, handleSortOptionClick, hrAttendancePageActive }) => {
    const [showSortOptions, setShowSortOptions] = useState(false);
    const sortOptionsRef = useRef(null);

    useClickOutside(sortOptionsRef, () => setShowSortOptions(false));

    useEffect(() => {

    }, [showSortOptions])

    const handleOptionClick = (option) => {
        if (!handleSortOptionClick) return setShowSortOptions(false);

        handleSortOptionClick(option);
        setShowSortOptions(false);
    }

    return <>

        <section className={`selected-candidates-container ${className ? className : ''}`}>
            {
                showSortOptions && <div className="background__Overlay">

                </div>
            }
            {
                hrPageActive ? <>
                    <div className="selected-candidates-count-container">
                        <h2>{title}</h2>
                        <p>{`${candidatesCount ? candidatesCount : '0'} new candidates are applied for the roles` }</p>    
                    </div>
                </>: 

                hrAttendancePageActive ? <>
                    <div className="selected-candidates-count-container">
                        <h2>{title}</h2>
                        <p>{`Showing ${tasksCount ? tasksCount : '0'} results`}</p>
                    </div>
                </> :

                sortActive ? <>
                    <div className="selected-candidates-count-container">
                        <h2>{hrAttendancePageActive ? title : "Task"}</h2>
                        <p>{`Showing ${tasksCount ? tasksCount : '0'} results`}</p>
                    </div>
                </> :

                <div className="selected-candidates-count-container">
                    <h2>{ showTasks ? hrAttendancePageActive ? title : "Task" : "Selected Candidates" }</h2>
                    <p>{ showTasks ? `Task given to ${tasksCount ? tasksCount : '0'} candidates`: `${candidatesCount ? candidatesCount : '0'} candidates are selected for the roles` }</p>    
                </div>
            }

            <div className="sort-candidates-container" onClick={() => {setShowSortOptions(true)}}>
                <FilterIcon />
                <p>Sort</p>
            </div>

            {
                showSortOptions && <>

                    <div className="sort__Candidates__Selection__Container" ref={sortOptionsRef}>
                        <Close className="close-icon" onClick={() => setShowSortOptions(false)} />
                        <div className="sort__Candidates__Selections">
                            <p>Sort By</p>
                            <div className="vertical-line"></div>
                            <ul>
                                <li onClick={() => handleOptionClick("project")}>
                                    <span>Project</span>
                                    <MdOutlineWorkOutline />
                                </li>
                                <li onClick={() => handleOptionClick("date")}>
                                    <span>Date</span>
                                    <IoCalendarClearOutline />
                                </li>
                                <li onClick={() => handleOptionClick(null)}>
                                    <span>Reset</span>
                                    <MdHourglassDisabled />
                                </li>
                            </ul>
                        </div>
                    </div>

                </>
            }
        </section>
    </>
}

export default SelectedCandidates;
