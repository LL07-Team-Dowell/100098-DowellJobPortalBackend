import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useRef, useState } from 'react';
import useClickOutside from '../../../../hooks/useClickOutside';

import "./style.css";


const DropdownButton = ({ currentSelection, selections, adminPageActive, handleSelectionClick, removeDropDownIcon, className, handleClick}) => {
    const currentSelectionRef = useRef(null);
    const selectionsRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    console.log("selections" , selections)
    useClickOutside(selectionsRef, () => setShowDropdown(false));
    
    const updateCurrentSelection = (selection) => {
        
        if (!currentSelectionRef.current) return;

        currentSelectionRef.current.innerText = selection;

        handleSelectionClick && handleSelectionClick(selection);

    }

    return <>
        <div className={`dropdown-btn ${className ? className : ''} ${adminPageActive ? currentSelectionRef.current ? currentSelectionRef.current.innerText.toLocaleLowerCase() === 'active' ? 'green__Color abs__Pos' : 'orange__Color abs__Pos' : 'abs__Pos' : ''}`} onClick={() => handleClick ? handleClick(currentSelection) : setShowDropdown(prevValue => { return !prevValue })}>
            <span ref={currentSelectionRef}>{ currentSelection }</span>
            { !removeDropDownIcon && <KeyboardArrowRightIcon className="down-icon right-icon" /> }

            {
                selections ? 
                
                <div className={`dropdown-selections ${showDropdown ? 'active_' : ''}`} ref={selectionsRef}>
                    {React.Children.toArray(selections.map(selection => {
                        return <div className="dropdown-selection-item" onClick={ () => updateCurrentSelection(selection) }>
                            {selection}
                            <hr style={{ color: "lightgray" }}/>
                        </div>
                    }))}
                </div> : <></>

            }
        </div>
    </>
}

export default DropdownButton;
