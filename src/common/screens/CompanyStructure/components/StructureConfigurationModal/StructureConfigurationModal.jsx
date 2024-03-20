import { AiOutlineClose } from "react-icons/ai";
import styles from './styles.module.css';
import React, { useEffect, useState } from "react";
import { projectDetailUpdateType, selectValuePreCursor } from "../../utils/utils";
import Select from "react-select";
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from "react-icons/hi2";
import Overlay from "../../../../../components/Overlay";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import { changeToTitleCase } from "../../../../../helpers/helpers";
import ProgressTracker from "../../../../../pages/AdminPage/views/Landingpage/component/progressTracker";

export default function StructureConfigurationModal ({
    companyStructure={},
    currentModalPage=1,
    copyOfExistingStructure,
    updateCopyOfExistingStructure,
    applications=[],
    projectsLoaded=false,
    projectsAdded={},
    dataLoading,
    onboardedUsers,
    selectedProject,
    updateSelectedProject,
    handleGoForward,
    handleGoBackward,
    handleCloseStructureModal,
}) {

    const [ currentProjectItemFromStructure, setCurrentProjectItemFromStructure ] = useState(null);

    useEffect(() => {
        const matchingProjectFromCompanyStructure = companyStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject));
        if (!matchingProjectFromCompanyStructure) return setCurrentProjectItemFromStructure(null);
        setCurrentProjectItemFromStructure(matchingProjectFromCompanyStructure);
    }, [companyStructure, selectedProject])

    const handleUpdateProjectLead = (newLead, project, itemValueInCompanyStructure) => {
        const itemValue = newLead?.split(selectValuePreCursor)[0];
        const currentStructureDataCopy = structuredClone(copyOfExistingStructure);

        const addNewProjectLead = (structureData, newProjectLead, project, projectDetails=null) => {
            structureData?.project_leads?.push({
                project_lead: newProjectLead,
                projects: projectDetails ? [projectDetails] : [],
                projects_managed: [project],
                is_new_project_lead: true,
            })
        }

        // CHANGING THE PROJECT LEAD FOR A PROJECT
        if (itemValueInCompanyStructure) {
            const foundProjectLeadItem = currentStructureDataCopy?.project_leads?.find(item => item.project_lead_id === itemValueInCompanyStructure?.project_lead_id);
            if (foundProjectLeadItem?.project_lead === itemValue) return;

            const existingProjectDetails = foundProjectLeadItem?.projects?.find(item => item.project === project);

            const updatedPreviousProjectLeadProjectsManaged = [...foundProjectLeadItem?.projects_managed]?.filter(item => item !== project);
            foundProjectLeadItem.projects_managed = updatedPreviousProjectLeadProjectsManaged;

            const updatedPreviousProjectLeadProjects = [...foundProjectLeadItem?.projects]?.filter(item => item.project !== project);
            foundProjectLeadItem.projects = updatedPreviousProjectLeadProjects;

            const isNewProjectLeadInStructure = currentStructureDataCopy?.project_leads?.find(item => item.project_lead === itemValue);
            
            if (isNewProjectLeadInStructure) {
                isNewProjectLeadInStructure?.projects_managed?.push(project);
                if (existingProjectDetails) isNewProjectLeadInStructure?.projects?.push(existingProjectDetails);
            }
            
            if (!isNewProjectLeadInStructure) addNewProjectLead(currentStructureDataCopy, itemValue, project, existingProjectDetails);

            console.log('updated copy -> ', currentStructureDataCopy);
            updateCopyOfExistingStructure(currentStructureDataCopy);

            return
        }

        // ASSIGNING A PROJECT TO A LEAD FOR THE FIRST TIME 
        const projectLeadItemIsInStructure = currentStructureDataCopy?.project_leads?.find(item => item.project_lead === itemValue);

        if (projectLeadItemIsInStructure) {
            projectLeadItemIsInStructure?.projects_managed?.push(project);
        }
        if (!projectLeadItemIsInStructure) addNewProjectLead(currentStructureDataCopy, itemValue, project);

        console.log('updated copy -> ', currentStructureDataCopy);
        updateCopyOfExistingStructure(currentStructureDataCopy);
    }

    const handleUpdateProjectDetail = (newValue, project, updateType) => {
        // console.log(newValue, project, updateType);

        const currentStructureDataCopy = structuredClone(copyOfExistingStructure);
        
        const [
            foundProjectLead, 
            foundProjectLeadIndex,
        ] = [
            currentStructureDataCopy?.project_leads?.find(item => item?.projects_managed?.includes(project)),
            currentStructureDataCopy?.project_leads?.findIndex(item => item?.projects_managed?.includes(project)),
        ];
        if (!foundProjectLead || foundProjectLeadIndex === -1) return;

        const copyOfProjectLeadItem = structuredClone(foundProjectLead);

        const projectLeadHasProjectDetailsPrevSaved = copyOfProjectLeadItem?.projects?.find(item => item?.project === project);
        if (!projectLeadHasProjectDetailsPrevSaved) {
            copyOfProjectLeadItem?.projects?.push({
                project: project,
                team_lead: '',
                group_leads: [],
                members: [],
            })
        }
        
        const foundProjectDetailsIndex = copyOfProjectLeadItem?.projects?.findIndex(item => item.project === project);
        if (foundProjectDetailsIndex === -1) return;

        const copyOfProjectDetailsInProjectLeadItem = structuredClone(copyOfProjectLeadItem?.projects[foundProjectDetailsIndex]);

        if (updateType === projectDetailUpdateType.teamlead_update) copyOfProjectDetailsInProjectLeadItem.team_lead = newValue;
        if (updateType === projectDetailUpdateType.grouplead_update) copyOfProjectDetailsInProjectLeadItem.group_leads = newValue;
        if (updateType === projectDetailUpdateType.member_update) copyOfProjectDetailsInProjectLeadItem.members = newValue;

        copyOfProjectLeadItem.projects[foundProjectDetailsIndex] = copyOfProjectDetailsInProjectLeadItem;
        currentStructureDataCopy.project_leads[foundProjectLeadIndex] = copyOfProjectLeadItem;

        console.log('updated structure details -> ', currentStructureDataCopy);
        updateCopyOfExistingStructure(currentStructureDataCopy);
    }


    return <>
        <Overlay>
            <div className={styles.structure__modal}>
                <div 
                    className={styles.close__User__Detail} 
                    onClick={
                        handleCloseStructureModal && typeof handleCloseStructureModal === 'function' ? 
                            () => handleCloseStructureModal()
                        :
                        () => {}
                    }
                >
                    <AiOutlineClose fontSize={'1.2rem'} />
                </div>
                <div className={styles.form__Header}>
                    <h2>
                        {
                            !companyStructure ? 'Configure Company Structure'
                            :
                            'Edit Structure'
                        }
                    </h2>
                    <p>
                        {
                            currentModalPage === 1 ? 'Step One: Configure CEO' : 
                            currentModalPage === 2 ? 'Step Two: Configure project leads' :
                            currentModalPage === 3 ? 'Step Three: Configure teamlead, grouplead and members of projects' :
                            ''
                        }
                    </p>
                </div>
                <div className={`${styles.structure__Form} ${currentModalPage === 3 ? styles.structure__Form_2 : ''}`}>
                    {
                        currentModalPage === 1 ? <>
                            <label>
                                <p>
                                    <span>Name of CEO</span>
                                </p>
                                <input 
                                    type="text"
                                    value={copyOfExistingStructure?.ceo}
                                    onChange={
                                        ({ target }) => updateCopyOfExistingStructure(
                                            (prev) => {
                                                return  {...prev, ceo: target.value}
                                            }
                                        )
                                    }
                                />
                                {
                                    dataLoading && <LoadingSpinner
                                        width={'0.85rem'}
                                        height={'0.85rem'}
                                        className={styles.loader}
                                    />
                                }
                            </label>
                        </> :
                        currentModalPage === 2 ? <>
                            <table 
                                className={styles.project__Lead__Table} 
                                style={{ 
                                    pointerEvents : dataLoading ? 'none' : 'initial',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Project Lead</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        projectsLoaded && projectsAdded[0]?.project_list && Array.isArray(projectsAdded[0]?.project_list) ?
                                            React.Children.toArray(
                                                projectsAdded[0]?.project_list
                                                ?.sort((a, b) => a.localeCompare(b))
                                                ?.map((project, index) => {
                                                    const matchingProjectFromCompanyStructure = copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(project));
                                                    
                                                    return <tr>
                                                        <td>{project}</td>
                                                        <td>
                                                            <Select
                                                                value={
                                                                    {
                                                                        label: matchingProjectFromCompanyStructure?.project_lead ?
                                                                            applications?.find(application => application.username === matchingProjectFromCompanyStructure?.project_lead) ?
                                                                                applications?.find(application => application.username === matchingProjectFromCompanyStructure?.project_lead)?.applicant
                                                                            :
                                                                            matchingProjectFromCompanyStructure?.project_lead
                                                                        :
                                                                            'Select project lead'
                                                                        ,
                                                                        value: matchingProjectFromCompanyStructure?.project_lead + selectValuePreCursor + index
                                                                    }
                                                                }
                                                                options={
                                                                    onboardedUsers?.map(application => {
                                                                        return { 
                                                                            label: changeToTitleCase(application?.applicant),
                                                                            value: application?.username + selectValuePreCursor + index
                                                                        }
                                                                    })
                                                                }
                                                                onChange={(val) => handleUpdateProjectLead(val.value, project, matchingProjectFromCompanyStructure)}
                                                                placeholder={'Select project lead'}
                                                                // id={crypto.randomUUID()}
                                                            />
                                                        </td>
                                                    </tr>
                                                })
                                            )
                                        : <></>
                                    }
                                </tbody>
                            </table>
                        </> : 
                        currentModalPage === 3 ? <>
                            <label>
                                <p>
                                    <span>Select project <span className={styles.min__Detail}>(only projects with assigned project leads will show here)</span></span>
                                </p>
                                <Select 
                                    value={{
                                        label: selectedProject?.length < 1 ? 'Select project' : selectedProject,
                                        value: selectedProject,
                                    }}
                                    options={
                                        projectsLoaded &&
                                        projectsAdded[0] &&
                                        projectsAdded[0]?.project_list
                                        ? [
                                        ...projectsAdded[0]?.project_list
                                            ?.sort((a, b) => a.localeCompare(b))
                                            ?.map((project) => {
                                                const projectWithProjectLeads = copyOfExistingStructure?.project_leads?.map(item => item?.projects_managed.map(projectItem => projectItem))?.flat();
                                                if (projectWithProjectLeads && !projectWithProjectLeads.includes(project)) return null;
                                                return { label: project, value: project };
                                            }).filter(item => item !== null),
                                        ]
                                        : [{label: '', value: ''}]
                                    }
                                    placeholder={'Select project'}
                                    className={styles.select__Item}
                                    onChange={(val) => updateSelectedProject(val.value)}
                                />
                            </label>
                            
                            {
                                selectedProject?.length > 0 &&
                                <>
                                    <label>
                                        <p>
                                            <span>Current project lead</span>
                                        </p>
                                        <Select 
                                            placeholder={
                                                applications?.find(application => application?.username === copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead) ?
                                                    applications?.find(application => application?.username === copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead)?.applicant
                                                :
                                                copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead
                                            }
                                            value={
                                                copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead
                                            }
                                            options={
                                                [
                                                    {
                                                        label: applications?.find(application => application?.username === copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead) ?
                                                            applications?.find(application => application?.username === copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead)?.applicant
                                                        :
                                                        copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead
                                                        ,
                                                        value: copyOfExistingStructure?.project_leads?.find(item => item?.projects_managed?.includes(selectedProject))?.project_lead
                                                    }
                                                ]
                                            }
                                            isDisabled={true}
                                        />
                                    </label>

                                    <label>
                                        <p>
                                            <span>Select team lead</span>
                                        </p>
                                        <Select 
                                            value={
                                                (
                                                    !copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.team_lead ||
                                                    copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.team_lead?.length < 1
                                                ) ?
                                                    []
                                                :
                                                [
                                                    {
                                                        label: applications?.find(item => item?.username === copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.team_lead) ?
                                                            applications?.find(item => item?.username === copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.team_lead)?.applicant
                                                            :
                                                            copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.team_lead
                                                        ,           
                                                        value: copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.team_lead
                                                    }
                                                ]
                                            }
                                            options={
                                                onboardedUsers?.map(user => {
                                                    return { label: user?.applicant, value: user?.username }
                                                })
                                            }
                                            onChange={(val) => {
                                                if (val.length < 1) return handleUpdateProjectDetail('', selectedProject, projectDetailUpdateType.teamlead_update)
                                                handleUpdateProjectDetail(val?.slice(-1)[0]?.value, selectedProject, projectDetailUpdateType.teamlead_update)
                                            }}  
                                            isMulti={true}
                                        />
                                    </label>

                                    <label>
                                        <p>
                                            <span>Select group leads</span>
                                        </p>
                                        <Select 
                                            value={
                                                copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject) ?
                                                    copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.group_leads?.map(item => {
                                                        return {
                                                            label: applications?.find(user => user.username === item) ?
                                                                applications?.find(user => user.username === item)?.applicant
                                                                :
                                                                item
                                                            ,
                                                            value: item,
                                                        }
                                                    })
                                                :
                                                [] 
                                            }
                                            options={
                                                onboardedUsers?.map(user => {
                                                    const teamleadForProject = copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.team_lead;
                                                    if (user?.username === teamleadForProject) return null;
                                                    return { label: user?.applicant, value: user?.username }
                                                }).filter(item => item !== null)
                                            }
                                            onChange={(val) => handleUpdateProjectDetail(val.map(item => item.value), selectedProject, projectDetailUpdateType.grouplead_update)}  
                                            isMulti
                                        />
                                    </label>

                                    <label>
                                        <p>
                                            <span>Select team members</span>
                                        </p>
                                        <Select 
                                            value={
                                                copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject) ?
                                                    copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.members?.map(item => {
                                                        return {
                                                            label: applications?.find(user => user.username === item) ?
                                                                applications?.find(user => user.username === item)?.applicant
                                                                :
                                                                item
                                                            ,
                                                            value: item,
                                                        }
                                                    })
                                                :
                                                []
                                            }
                                            options={
                                                onboardedUsers?.map(user => {

                                                    const leadsForCurrentProject = [
                                                        copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.project_lead,
                                                        copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item.project === selectedProject)?.team_lead,
                                                    ]

                                                    if (leadsForCurrentProject?.includes(user?.username)) return null;

                                                    return { label: user?.applicant, value: user?.username }
                                                }).filter(val => val !== null)
                                            }
                                            onChange={(val) => handleUpdateProjectDetail(val.map(item => item.value), selectedProject, projectDetailUpdateType.member_update)}  
                                            isMulti
                                        />
                                    </label>

                                    {
                                        (
                                            currentProjectItemFromStructure &&
                                            !(
                                                // checking if teamlead is updated
                                                (
                                                    currentProjectItemFromStructure?.projects?.find(item => item?.project === selectedProject)?.team_lead === copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.team_lead
                                                ) 
                                                &&

                                                // checking if groupleads are updated
                                                (
                                                    currentProjectItemFromStructure?.projects?.find(item => item?.project === selectedProject)?.group_leads
                                                    ?.every(
                                                        itemFromOriginalStructure => 
                                                            copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.group_leads?.includes(itemFromOriginalStructure)
                                                    )
                                                    &&
                                                    copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.group_leads
                                                    ?.every(
                                                        itemFromCopyStructure => 
                                                            currentProjectItemFromStructure?.projects?.find(item => item?.project === selectedProject)?.group_leads?.includes(itemFromCopyStructure)
                                                    )
                                                ) 
                                                &&

                                                // checking if members are updated
                                                (
                                                    currentProjectItemFromStructure?.projects?.find(item => item?.project === selectedProject)?.members
                                                    ?.every(
                                                        itemFromOriginalStructure => 
                                                            copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.members?.includes(itemFromOriginalStructure)
                                                    )
                                                    &&
                                                    copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject)?.members
                                                    ?.every(
                                                        itemFromCopyStructure => 
                                                            currentProjectItemFromStructure?.projects?.find(item => item?.project === selectedProject)?.members?.includes(itemFromCopyStructure)
                                                    )
                                                )
                                            )
                                        ) || (!currentProjectItemFromStructure) ?
                                        <button 
                                            className={styles.update__project__Btn} 
                                            onClick={() => {
                                                const foundProjectDetails = copyOfExistingStructure?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.projects?.find(item => item?.project === selectedProject);
                                                if (!foundProjectDetails) return;
                                                
                                                handleGoForward();
                                            }}
                                            disabled={dataLoading ? true : false}
                                        >
                                            {
                                                dataLoading ? 
                                                    <LoadingSpinner
                                                        width={'1.2rem'}
                                                        height={'1.2rem'}
                                                        color={'#fff'}
                                                    /> 
                                                :
                                                <span>
                                                    {
                                                        'Update'
                                                    }
                                                </span>
                                            }
                                        </button> : <></>
                                    }
                                </>
                            }
                        </>
                        :
                        <></>
                    }
                </div>
                <div className={styles.form__Nav__Btns__Wrap}>
                    <>
                        {
                            currentModalPage === 2 && dataLoading ? <div className={styles.save__Progress_Container}>
                                <p className={styles.loader_text}>Saving....</p>
                                <ProgressTracker
                                    durationInSec={120} 
                                    showDivProgressBar={true}
                                    progressClassName={styles.progress}
                                />
                            </div> : <>
                                {
                                    currentModalPage > 1 && <button 
                                        className={styles.form__Nav__Btn} 
                                        onClick={
                                            handleGoBackward && typeof handleGoBackward === 'function' ?
                                                () => handleGoBackward()
                                            :
                                            () => {}
                                        }
                                        disabled={dataLoading ? true : false}
                                    >
                                        <HiMiniArrowLongLeft fontSize={'1.2rem'} />
                                    </button>
                                }
                                {
                                    currentModalPage > 0 && currentModalPage < 3 ?
                                    <button 
                                        className={styles.form__Nav__Btn} 
                                        onClick={
                                            handleGoForward && typeof handleGoForward === 'function' ?
                                                () => handleGoForward()
                                            :
                                            () => {}
                                        }
                                        disabled={dataLoading ? true : false}
                                    >
                                        <HiMiniArrowLongRight fontSize={'1.2rem'} />
                                    </button>
                                    :
                                    <></>
                                }
                            </>
                        }
                    </>
                </div>
            </div>
        </Overlay>
    </>
}