import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useRef, useState } from 'react';
import useClickOutside from '../../../../hooks/useClickOutside';

import "./style.css";
import { AiOutlineSearch } from 'react-icons/ai';


const DropdownButton = ({ currentSelection, selections, adminPageActive, handleSelectionClick, removeDropDownIcon, className, handleClick, disabled, selectionsDropDownClassName }) => {
    const currentSelectionRef = useRef(null);
    const selectionsRef = useRef(null);
    const inputRef = useRef();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    useClickOutside(selectionsRef, () => setShowDropdown(false));
    
    const updateCurrentSelection = (selection) => {
        
        if (!currentSelectionRef.current) return;

        currentSelectionRef.current.innerText = selection;
        setSearchValue('');

        handleSelectionClick && handleSelectionClick(selection);

    }

    return <>
        <div 
            className={
                `dropdown-btn 
                ${className ? className : ''} 
                ${adminPageActive ? currentSelectionRef.current ? currentSelectionRef.current.innerText.toLocaleLowerCase() === 'active' ? 'green__Color abs__Pos' : 'orange__Color abs__Pos' : 'abs__Pos' : ''}
                ${disabled ? 'disabled' : ''}
                `
            } 
            onClick={
                handleClick ?
                    () => handleClick(currentSelection)
                : 
                (e) => {
                    if (inputRef.current && inputRef.current?.contains(e?.target)) return;
                    setShowDropdown(prevValue => { return !prevValue })
                }
            }
        >
            <span ref={currentSelectionRef}>{ currentSelection }</span>
            { 
                !removeDropDownIcon &&
                <>
                    {
                        showDropdown ?
                            <KeyboardArrowDownIcon className="down-icon right-icon" />
                        :
                        <KeyboardArrowRightIcon className="down-icon right-icon" />
                    }
                </>
            }

            {
                selections ? 
                
                <div 
                    className={`dropdown-selections ${showDropdown ? 'active_' : ''} ${selectionsDropDownClassName && showDropdown ? selectionsDropDownClassName : ''}`} 
                    ref={selectionsRef}
                >
                    <div className='search__Selections__Wrap' ref={inputRef}>
                        <AiOutlineSearch 
                            fontSize={'0.875rem'}
                        />
                        <input 
                            type='text'
                            value={searchValue}
                            onChange={({ target }) => setSearchValue(target.value)}
                            placeholder='Search'
                        />
                    </div>
                    {
                        React.Children.toArray(selections
                            .filter(selection => {
                                if (searchValue.length > 0) {
                                    if (selection.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) return true;
                                    return false;
                                }
                                return true;
                            })
                            .map(selection => {
                            return <div className={`dropdown-selection-item ${selection === currentSelection ? 'active-item_' : ''}`} onClick={ () => updateCurrentSelection(selection) }>
                                {selection}
                                <div style={{ backgroundColor: "#fafafa", height: "0.07rem", marginTop: "0.5rem" }}></div>
                            </div>
                        }))
                    }
                </div> : <></>

            }
        </div>
    </>
}

export default DropdownButton;
