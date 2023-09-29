import React from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import styles from './styles.module.css';
import { useState } from "react";
import { useEffect } from "react";
import useListenToKeyStrokeInElement from "../../hooks/useListenToKeyStrokeInElement";
import { useRef } from "react";

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
    const inputRef = useRef();
    const listRef = useRef();
    const [ currentListItemIndex, setCurrentListItemIndex ] = useState(0);

    const removeFocusClassFromAllListItems = (listElemRef) => {
        const allListElements = Array.from(listElemRef?.current?.childNodes);

        allListElements.forEach(element => {
            const classesOfElement = Array.from(element?.classList);

            if (classesOfElement.includes(styles.focused)) element?.classList?.remove(styles.focused)
        })
    }

    useEffect(() => {
        setCurrentListItemIndex(0);
        
        removeFocusClassFromAllListItems(listRef);
    }, [])

    useEffect(() => {
        setDisplayedItems(subprojects ? subprojects : [])
    }, [subprojects])

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

    useListenToKeyStrokeInElement(
        inputRef,
        'ArrowDown',
        () => {

            const updatedIndex = currentListItemIndex + 1;
            const [
                previousElementOfList,
                currentElementOfList,
            ] = [
                Array.from(listRef?.current?.childNodes)[currentListItemIndex - 1],
                Array.from(listRef?.current?.childNodes)[currentListItemIndex]
            ]

            if (currentListItemIndex === 0) {
                currentElementOfList?.classList?.add(styles.focused);
            }

            if (currentElementOfList && currentListItemIndex !== 0) {
                currentElementOfList?.classList?.add(styles.focused);
            }
            
            if (previousElementOfList && currentListItemIndex !== 0) {
                previousElementOfList?.classList?.remove(styles.focused);
            }
            
            if (currentListItemIndex > Array.from(listRef?.current?.childNodes).length - 1) return
            
            currentElementOfList?.focus()
            setCurrentListItemIndex(updatedIndex);
        }
    )

    useListenToKeyStrokeInElement(
        inputRef,
        'ArrowUp',
        () => {
            const updatedIndex = currentListItemIndex - 1;
            const [
                previousElementOfList,
                currentElementOfList
            ] = [
                Array.from(listRef?.current?.childNodes)[updatedIndex],
                Array.from(listRef?.current?.childNodes)[currentListItemIndex]
            ]

            if (previousElementOfList) {
                previousElementOfList?.classList?.add(styles.focused);
            }

            if (currentElementOfList) {
                currentElementOfList?.classList?.remove(styles.focused);
            }

            if (currentListItemIndex === 0) return

            previousElementOfList?.focus();
            setCurrentListItemIndex(updatedIndex);
        }
    )

    useListenToKeyStrokeInElement(
        listRef,
        'Enter',
        () => {
            const itemSelected = Array.from(listRef?.current?.childNodes)[currentListItemIndex - 1];

            if (itemSelected) {
                const [
                    itemSubprojectVal,
                    itemProjectVal
                ] = [
                    itemSelected?.querySelector('.subproject'),
                    itemSelected?.querySelector('.project')
                ]

                if (itemSubprojectVal && itemProjectVal) {
                    selectItemFromListing(itemSubprojectVal?.innerText, itemProjectVal?.innerText)
                }
            }
        }
    )

    const selectItemFromListing = (subprojectSelected, projectSelected) => {
        handleSelectItem(subprojectSelected, projectSelected);
        setCurrentListItemIndex(0);
        removeFocusClassFromAllListItems(listRef);
    }

    return <>
        <div className={`${styles.dropdown} ${className ? className : ''}`} tabIndex={-1}>
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
                            ref={inputRef}
                        />
                    </div>
                    <ul className={styles.items__List} ref={listRef} tabIndex={-1}>
                        {
                            displayedItems?.length < 1 ?
                            <p>No items found</p>
                            :
                            React.Children.toArray(displayedItems?.map(item => {
                                return item.sub_project_list.map(project => {
                                    return <li onClick={
                                            handleSelectItem && typeof handleSelectItem === 'function' ? 
                                                () => {
                                                    selectItemFromListing(project, item.parent_project)
                                                }
                                            :
                                            () => {}
                                        }
                                        tabIndex={-1}
                                    >
                                        {project} - ({item.parent_project})
                                        <span className={`${styles.hidden} subproject`}>{project}</span>
                                        <span className={`${styles.hidden} project`}>{item.parent_project}</span>
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
