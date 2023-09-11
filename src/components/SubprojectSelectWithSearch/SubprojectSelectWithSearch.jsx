import React from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import styles from './styles.module.css';
import { useState } from "react";
import { useEffect } from "react";

const SubprojectSelectWithSearch = ({ 
    subprojects, 
    selectedSubProject, 
    handleSelectItem, 
    handleCancelSelection, 
    selectedProject, 
    className,
    searchWrapperClassName,
    hideSelectionsMade,
}) => {
    const [ inputVal, setInputVal ] = useState('');
    const [ displayedItems, setDisplayedItems ] = useState([]);

    useEffect(() => {
        setDisplayedItems(subprojects ? subprojects : [])
    }, [])

    useEffect(() => {
        const filteredList = subprojects?.map(item => {
            const itemInList = item.sub_project_list.filter(i => i.toLocaleLowerCase().replaceAll(" ", "").includes(inputVal.toLocaleLowerCase().replaceAll(" ", "")));
            if (itemInList.length < 1) return null
            
            return {
                ...item,
                sub_project_list: itemInList,
            }
        }).filter(item => item); 

        setDisplayedItems(filteredList);
    }, [inputVal])

    return <>
        <div className={`${styles.dropdown} ${className ? className : ''}`}>
            {
                selectedSubProject && selectedSubProject.length > 0 ? <>
                    {
                        hideSelectionsMade ? <></> :
                        <>
                            <div className={styles.selected__Item}>
                                <span>{selectedSubProject}</span>
                                <AiOutlineClose 
                                    onClick={
                                        handleCancelSelection && typeof handleCancelSelection === 'function' ? 
                                            () => handleCancelSelection() 
                                        : 
                                        () => {}
                                    } 
                                />
                            </div>
                            {
                                selectedProject && selectedProject.length > 0 &&
                                <p className={styles.project__Indicator}>Project: {selectedProject}</p>
                            }
                        </>
                    }
                </> :
                <>
                    <div className={`${styles.search__Wrapper} ${searchWrapperClassName ? searchWrapperClassName : ''}`}>
                        <AiOutlineSearch />
                        <input 
                            placeholder="Search for subproject"
                            value={inputVal}
                            onChange={({ target }) => setInputVal(target.value)}
                        />
                    </div>
                    <ul className={styles.items__List}>
                        {
                            displayedItems?.length < 1 ?
                            <p>No items found</p>
                            :
                            React.Children.toArray(displayedItems?.map(item => {
                                return item.sub_project_list.map(project => {
                                    return <li onClick={
                                            handleSelectItem && typeof handleSelectItem === 'function' ? 
                                                () => handleSelectItem(project, item.parent_project)
                                            :
                                            () => {}
                                        }
                                    >
                                        {project} - ({item.parent_project})
                                    </li>
                                })
                            }))
                        }
                    </ul>     
                </>
            }
           
        </div>
    </>
}

export default SubprojectSelectWithSearch;
