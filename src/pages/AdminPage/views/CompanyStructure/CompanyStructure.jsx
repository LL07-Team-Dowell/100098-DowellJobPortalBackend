import React, { useEffect, useRef, useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from "./styles.module.css";
import { useJobContext } from "../../../../contexts/Jobs";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { GoRepoForked } from "react-icons/go";
import Select from "react-select";
import TitleItem from "./components/TitleItem/TitleItem";
import { testCompanyData } from "./utils/testData";
import CardTile from "./components/CardTile/CardTile";
import UserIconsInfo from "./components/UsersIconsInfo/UserIconsInfo";
import { toast } from "react-toastify";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import Avatar from "react-avatar";
import { useCompanyStructureContext } from "../../../../contexts/CompanyStructureContext";
import { HiMiniArrowLongRight , HiMiniArrowLongLeft } from "react-icons/hi2";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { updateCompanyStructure } from "../../../../services/adminServices";
import { changeToTitleCase } from "../../../../helpers/helpers";
import ProgressTracker from "../Landingpage/component/progressTracker";
import { labelColors, projectDetailUpdateType, selectValuePreCursor } from "./utils/utils";

const CompanyStructurePage = () => {
    const {
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        projectsLoaded,
        projectsAdded,
        subProjectsAdded,
        subProjectsLoaded,
    } = useJobContext();
    const { currentUser } = useCurrentUserContext();
    const [ copyOfStructureData, setCopyOfStructureData ] = useState(null);
    const [ widthOfProjectConnector, setWidthOfProjectConnector ] = useState('100%');
    const [ onboardedUsers, setOnboardedUsers ] = useState([]);
    const [ searchProjectVal, setSearchProjectVal ] = useState('');
    const [ showSearchResult, setShowSearchResult ] = useState(false);
    const projectWrapperRef = useRef();
    const singleProjectsRefs = useRef([]);
    const [ showSelectedUser, setShowSelectedUser ] = useState(false);
    const [ currentSelectedUser, setCurrentSelectedUser ] = useState(null);
    const [ dataLoading, setDataLoading ] = useState(false);
    const [ selectedProject, setSelectedProject ] = useState('');

    const {
        companyStructure,
        setCompanyStructure,
        companyStructureLoading,
        companyStructureLoaded,
        showConfigurationModal,
        setShowConfigurationModal,
        currentModalPage,
        setCurrentModalPage,
    } = useCompanyStructureContext();

    const addToRefsArray = (elem, arrayToAddTo) => {
        if (elem && !arrayToAddTo.current.includes(elem)) arrayToAddTo.current.push(elem);
    };

    useEffect(() => {
        if (companyStructureLoaded && !copyOfStructureData) setCopyOfStructureData(companyStructure);
    }, [companyStructure, companyStructureLoaded, copyOfStructureData])

    useEffect(() => {
        let projectRefIsRendered = false;

        const checkProjectRefIsRendered = setInterval(() => {

            if (!projectWrapperRef.current || projectRefIsRendered || !projectsLoaded || !copyOfStructureData) return

            setWidthOfProjectConnector(`${projectWrapperRef.current.scrollWidth}px`);
            projectRefIsRendered = true;
        }, 2000)

        return (() => {
            clearInterval(checkProjectRefIsRendered)
        })

    }, [copyOfStructureData, projectsLoaded])

    useEffect(() => {
        if (!applicationsLoaded) return

        setOnboardedUsers(
            applications?.filter(application => application.status === candidateStatuses.ONBOARDING)
        )
    }, [applications, applicationsLoaded])

    useEffect(() => {
        if (!showSearchResult || searchProjectVal.length < 1 || !projectsAdded[0]?.project_list) return

        const foundProjectIndex = projectsAdded[0]?.project_list?.findIndex(item => item === searchProjectVal);
        if (foundProjectIndex === -1) return

        const foundProjectElementRef = singleProjectsRefs.current[foundProjectIndex];
        if (!foundProjectElementRef) return;

        foundProjectElementRef?.scrollIntoView();
        foundProjectElementRef?.classList?.add(`${styles.focused__Project}`);

        setTimeout(() => {
            foundProjectElementRef?.classList?.remove(`${styles.focused__Project}`);
        }, 1000)

    }, [showSearchResult])

    const handleTileClick = (currentUser, userTitle, userTileDesignation, projectSelected, teamMembers) => {
        if (!projectsLoaded || !subProjectsLoaded) return toast.info('Please wait. Projects and subprojects are still loading...');

        setShowSelectedUser(true);
        
        const foundSubprojectsList = subProjectsAdded.find(
            (item) => item.parent_project === projectSelected
          )?.sub_project_list;

        const foundSubprojects = foundSubprojectsList && Array.isArray(foundSubprojectsList) ? foundSubprojectsList.sort((a, b) => a.localeCompare(b)) : [];
        
        setCurrentSelectedUser({
            name: currentUser,
            title: userTitle,
            labelColor: userTileDesignation,
            project: projectSelected,
            subprojects: foundSubprojects,
            members: teamMembers,
        })
    }

    const handleCloseSingleUserModal = () => {
        setCurrentSelectedUser(null);
        setShowSelectedUser(false);
    }

    const handleEditStructureBtnClick = () => {
        setShowConfigurationModal(true);
        setCurrentModalPage(1);
    }

    const handleCloseStructureModal = () => {
        if (dataLoading) return

        setShowConfigurationModal(false);
        setCopyOfStructureData(companyStructure);
        setCurrentModalPage(1);
        setSelectedProject('');
    }

    const handleUpdateProjectLead = (newLead, project, itemValueInCompanyStructure) => {
        const itemValue = newLead?.split(selectValuePreCursor)[0];
        const currentStructureDataCopy = {...copyOfStructureData};

        const addNewProjectLead = (structureData, newProjectLead, projectDetails) => {
            structureData?.project_leads?.push({
                project_lead: newProjectLead,
                projects: [projectDetails],
                is_new_project_lead: true,
            })
        }

        // CHANGING THE PROJECT LEAD FOR A PROJECT
        if (itemValueInCompanyStructure) {
            const foundProjectLeadItem = currentStructureDataCopy?.project_leads?.find(item => item.project_lead_id === itemValueInCompanyStructure?.project_lead_id);
            if (foundProjectLeadItem?.project_lead === itemValue) return;

            const existingProjectDetails = foundProjectLeadItem?.projects?.find(item => item.project === project);
            const updatedPreviousProjectLeadProjects = [...foundProjectLeadItem?.projects]?.filter(item => item.project !== project);
            foundProjectLeadItem.projects = updatedPreviousProjectLeadProjects;

            const isNewProjectLeadInStructure = currentStructureDataCopy?.project_leads?.find(item => item.project_lead === itemValue);
            
            if (isNewProjectLeadInStructure) isNewProjectLeadInStructure?.projects?.push(existingProjectDetails);
            
            if (!isNewProjectLeadInStructure) addNewProjectLead(currentStructureDataCopy, itemValue, existingProjectDetails);

            console.log('updated copy -> ', currentStructureDataCopy);
            setCopyOfStructureData(currentStructureDataCopy);

            return
        }

        // ASSIGNING A PROJECT TO A LEAD FOR THE FIRST TIME 
        const projectLeadItemIsInStructure = currentStructureDataCopy?.project_leads?.find(item => item.project_lead === itemValue);
        const newProjectDetails = {
            project: project,
            team_lead: ''
        };

        if (projectLeadItemIsInStructure) projectLeadItemIsInStructure?.projects?.push(newProjectDetails);
        if (!projectLeadItemIsInStructure) addNewProjectLead(currentStructureDataCopy, itemValue, newProjectDetails);

        console.log('updated copy -> ', currentStructureDataCopy);
        setCopyOfStructureData(currentStructureDataCopy);
    }

    const handleUpdateProjectDetail = (newValue, project, updateType) => {
        console.log(newValue, project, updateType);
    }

    const handleGoForward = async () => {
        switch (currentModalPage) {
            
            // CONFIGURING/UPDATING CEO
            case 1:
                const initialCeoData = {
                    company_name: currentUser?.portfolio_info[0]?.org_name,
                    company_id: currentUser?.portfolio_info[0]?.org_id,
                    data_type: currentUser?.portfolio_info[0]?.data_type,
                }
    
                if (companyStructure?.ceo){
                    if (copyOfStructureData?.ceo?.length < 1) return toast.info('Please enter the ceo name');
                    if (companyStructure?.ceo?.toLocaleLowerCase() === copyOfStructureData?.ceo?.toLocaleLowerCase()) return setCurrentModalPage(currentModalPage + 1);
    
                    setDataLoading(true);
    
                    try {
                        const res = (await updateCompanyStructure('update_ceo', { ...initialCeoData, previous_ceo: companyStructure?.ceo, current_ceo: copyOfStructureData?.ceo })).data;
                        toast.success(changeToTitleCase(res?.message));
                        
                        setCompanyStructure(copyOfStructureData);
                        setDataLoading(false);
                        setCurrentModalPage(currentModalPage + 1);
    
                    } catch (error) {
                        console.log(error?.response ? error?.response?.data : error?.message);
                        setDataLoading(false);
                        toast.error('An error occured while trying to update the ceo. Please try again later')
                    }
    
                    return
                }
    
                if (!copyOfStructureData.ceo || copyOfStructureData?.ceo?.length < 1) return toast.info('Please enter the ceo name');
    
                try {
    
                    setDataLoading(true);
                    const res = (await updateCompanyStructure('add_ceo', { ...initialCeoData, ceo: copyOfStructureData.ceo})).data;
                    toast.success(changeToTitleCase(res?.message));
    
                    const updatedStructure = {
                        ...copyOfStructureData,
                        company_id: initialCeoData.company_id,
                        project_leads: [],
                    }
    
                    setCopyOfStructureData(updatedStructure);
                    setCompanyStructure(updatedStructure);
                    setDataLoading(false);
                    setCurrentModalPage(currentModalPage + 1);
                } catch (error) {
                    console.log(error?.response ? error?.response?.data : error?.message);
                    setDataLoading(false);
                    toast.error('An error occured while trying to configure the ceo. Please try again later');
                }

                break;

            // CONFIGURING/UPDATING PROJECT LEADS
            case 2:
                return setCurrentModalPage(currentModalPage + 1);

                const newProjectLeads = copyOfStructureData?.project_leads?.filter(item => item.is_new_project_lead);
                const updatedProjectLeads = copyOfStructureData?.project_leads?.filter(item => item?.projects?.length !== companyStructure?.project_leads?.find(project => project?.project_lead === item?.project_lead)?.projects?.length);

                try {

                    setDataLoading(true);

                    await Promise.all([
                        ...newProjectLeads.map(item => updateCompanyStructure('add_project_leads', { project_lead: item.project_lead, projects_managed: item.projects.map(item => item.project), company_id: currentUser?.portfolio_info[0]?.org_id})),
                        ...updatedProjectLeads.map(item => updateCompanyStructure('update_project_leads', { project_lead: item.project_lead, projects_managed: item.projects.map(item => item.project), company_id: currentUser?.portfolio_info[0]?.org_id})),
                    ])

                    setCompanyStructure(copyOfStructureData);
                    setDataLoading(false);
                    setCurrentModalPage(currentModalPage + 1);

                } catch (error) {
                    console.log(error?.response ? error?.response?.data : error?.message);
                    setDataLoading(false);
                    toast.error('An error occured while trying to update project leads. Please try again later');
                }
                break;

            default:
                console.log(`Case '${currentModalPage}' not defined`);
                break;
        }
    }

    const handleGoBackward = () => {
        if (dataLoading || currentModalPage === 1) return;

        setCurrentModalPage(currentModalPage - 1);
    }

    return <>
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={'Company Structure'}
            newSidebarDesign={true}
        >
            <div className={styles.wrapper}>
                <div className={styles.top__Nav__Banner}>
                    <div className={styles.nav__Info__Content}>
                        <div className={styles.icon__Wrap}>
                            <GoRepoForked className={styles.icon} />
                        </div>
                        <div>
                            <h3>Company Structure</h3>
                            <p>
                                {
                                    !applicationsLoaded ? 'Calculating...'
                                    :
                                    `${onboardedUsers?.length} Employees`
                                }
                            </p>
                        </div>
                    </div>
                    <UserIconsInfo 
                        items={onboardedUsers}
                        numberOfIcons={3}
                    />
                </div>
                <div className={styles.project__Select}>
                    <div>
                        <p>Project Name</p>
                        <Select 
                            value={{
                                label: searchProjectVal?.length < 1 ? 'Filter by project' : searchProjectVal,
                                value: searchProjectVal,
                            }}
                            options={
                                projectsLoaded &&
                                projectsAdded[0] &&
                                projectsAdded[0]?.project_list
                                ? [
                                ...projectsAdded[0]?.project_list
                                    ?.sort((a, b) => a.localeCompare(b))
                                    ?.map((project) => {
                                        return { label: project, value: project };
                                    }),
                                ]
                                : []
                            }
                            placeholder={'Filter by project'}
                            className={styles.select__Item}
                            onChange={(val) => 
                                {
                                    setSearchProjectVal(val.value);
                                    setShowSearchResult(false);
                                }
                            }
                        />
                    </div>
                    <button 
                        className={styles.result__Btn}
                        disabled={
                            searchProjectVal.length > 0 ? false : true
                        }
                        onClick={
                            () => setShowSearchResult(true)
                        }
                    >
                        <span>Show results</span>
                    </button>
                </div>
                
                {
                    showSearchResult && <>
                        <div className={styles.search__Project__Details__Item}>
                            <h4>Current Project: <span>{searchProjectVal}</span></h4>
                            <p>Project Lead: <span>{copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.project_lead}</span></p>
                            <p>Team Lead: <span>{copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.projects?.find(item => item.project === searchProjectVal)?.team_lead}</span></p>
                            <p>Group Lead: <span>{copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.projects?.find(item => item.project === searchProjectVal)?.group_leads?.join(', ')}</span></p>
                            <p>Members: <span>{copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.projects?.find(item => item.project === searchProjectVal)?.members?.join(', ')}</span></p>
                        </div>
                    </>
                }

                <div className={styles.structure__Display}>
                    {
                        companyStructureLoading ? <LoadingSpinner 
                            width={'2rem'}
                            height={'2rem'}
                            color={labelColors.ceo}
                        /> :
                        !copyOfStructureData || Object.keys(copyOfStructureData || {}).length < 1 ?
                            <button className={`${styles.result__Btn} ${styles.configure__Btn}`} onClick={handleEditStructureBtnClick}>
                                <span>Configure structure</span>
                            </button>
                        :
                        <>
                            <button className={`${styles.result__Btn} ${styles.configure__Btn} ${styles.edit__Btn}`} onClick={handleEditStructureBtnClick}>
                                <span>Edit structure</span>
                            </button>
                            <div className={styles.ceo__Item__Wrap}>
                                <TitleItem 
                                    title={'Company CEO'}
                                    hasTrailingDash={true}
                                />
                                <CardTile 
                                    tileName={copyOfStructureData?.ceo}
                                    tileDesignation={'CEO'}
                                    tileColor={labelColors.ceo}
                                    hasTrailingDash={true}
                                />
                            </div>
                            <div style={{ width:  widthOfProjectConnector }} className={styles.project__Lead__Connector}></div>
                            <div className={styles.project__Listing__Wrap} ref={projectWrapperRef}>
                                {
                                    React.Children.toArray(
                                        projectsAdded[0]?.project_list?.map(projectItem => {
                                            const matchingProjectFromCompanyStructure = copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === projectItem))
                                            const foundTeamleadFromCompanyStructure = matchingProjectFromCompanyStructure?.projects?.find(item => item.project === projectItem)?.team_lead;
                                            const foundGroupleadsFromCompanyStructure = matchingProjectFromCompanyStructure?.projects?.find(item => item.project === projectItem)?.group_leads;
                                            const foundMembersFromCompanyStructure = matchingProjectFromCompanyStructure?.projects?.find(item => item.project === projectItem)?.members;
                                            
                                            return <div 
                                                className={styles.project__Detail__Item}
                                                ref={(elem) => addToRefsArray(elem, singleProjectsRefs)}
                                            >
                                                <div className={styles.project_Lead__item}>
                                                    <TitleItem
                                                        title={projectItem}
                                                        hasLeadingDash={true}
                                                        hasTrailingDash={true}
                                                    />
                                                    <CardTile 
                                                        tileName={
                                                            matchingProjectFromCompanyStructure ?
                                                                applications?.find(
                                                                    application => application.username ===
                                                                        matchingProjectFromCompanyStructure?.project_lead
                                                                ) ?
                                                                    applications?.find(
                                                                        application => application.username ===
                                                                            matchingProjectFromCompanyStructure?.project_lead
                                                                    )?.applicant
                                                                :
                                                                matchingProjectFromCompanyStructure?.project_lead
                                                            :
                                                            'No Project Lead'
                                                        }
                                                        tileDesignation={
                                                            matchingProjectFromCompanyStructure ?
                                                                'Project Lead'
                                                            :
                                                            'No user'
                                                        }
                                                        tileColor={
                                                            matchingProjectFromCompanyStructure ?
                                                                labelColors.projectLead
                                                            : 
                                                            null
                                                        }
                                                        hasTrailingDash={true}
                                                        noUser={matchingProjectFromCompanyStructure ? false : true}
                                                        isClickable={matchingProjectFromCompanyStructure ? true : false}
                                                        handleCardTileClick={
                                                            () => handleTileClick(
                                                                matchingProjectFromCompanyStructure?.project_lead,
                                                                'project lead',
                                                                labelColors.projectLead,
                                                                projectItem,
                                                                foundMembersFromCompanyStructure,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <CardTile 
                                                    tileName={
                                                        foundTeamleadFromCompanyStructure ?
                                                            applications?.find(
                                                                application => application.username ===
                                                                    foundTeamleadFromCompanyStructure
                                                            ) ?
                                                                applications?.find(
                                                                    application => application.username ===
                                                                        foundTeamleadFromCompanyStructure
                                                                )?.applicant
                                                            :
                                                            foundTeamleadFromCompanyStructure
                                                        :
                                                        'No Team Lead'
                                                    
                                                    }
                                                    tileDesignation={'Team Lead'}
                                                    hasTrailingDash={true}
                                                    tileColor={
                                                        foundTeamleadFromCompanyStructure ?
                                                            labelColors.teamlead
                                                        :
                                                        null   
                                                    }
                                                    longDash={true}
                                                    noUser={foundTeamleadFromCompanyStructure ? false : true}
                                                    isClickable={foundTeamleadFromCompanyStructure ? true : false}
                                                    handleCardTileClick={
                                                        () => handleTileClick(
                                                            foundTeamleadFromCompanyStructure,
                                                            'team lead',
                                                            labelColors.teamlead,
                                                            projectItem,
                                                            foundMembersFromCompanyStructure,
                                                        )
                                                    }
                                                />

                                                <div className={styles.dash}></div>
                                                <div className={styles.dash__line}></div>
                                                
                                                <div className={styles.group_leads__Wrap}>
                                                    {
                                                        foundGroupleadsFromCompanyStructure && Array.isArray(foundGroupleadsFromCompanyStructure) ?
                                                            <>
                                                                {
                                                                    React.Children.toArray(foundGroupleadsFromCompanyStructure.map(grouplead => {
                                                                        return <div className={styles.grouplead__Item}>
                                                                            <CardTile 
                                                                                tileName={
                                                                                    applications?.find(
                                                                                        application => application.username ===
                                                                                            grouplead
                                                                                    ) ?
                                                                                        applications?.find(
                                                                                            application => application.username ===
                                                                                                grouplead
                                                                                        )?.applicant
                                                                                    :
                                                                                    grouplead
                                                                                }
                                                                                tileDesignation={'Group Lead'}
                                                                                tileColor={labelColors.groupLead}
                                                                                isClickable={true}
                                                                                handleCardTileClick={
                                                                                    () => handleTileClick(
                                                                                        grouplead,
                                                                                        'group lead',
                                                                                        labelColors.groupLead,
                                                                                        projectItem,
                                                                                        foundMembersFromCompanyStructure,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    }))
                                                                }
                                                            </>
                                                        :
                                                        <div className={styles.grouplead__Item}>
                                                            <CardTile 
                                                                tileName={'No Group Lead'}
                                                                tileDesignation={'No user'}
                                                                noUser={true}
                                                            />
                                                        </div>
                                                    }
                                                </div>

                                                <div className={styles.dash}></div>
                                                <div className={styles.dash__line}></div>

                                                <div className={styles.team__Members__Wrap}>
                                                    {   
                                                        foundMembersFromCompanyStructure && Array.isArray(foundMembersFromCompanyStructure) ?
                                                        React.Children.toArray(foundMembersFromCompanyStructure.map(member => {
                                                            return <div className={styles.member__Item}>
                                                                <CardTile 
                                                                    tileName={
                                                                        applications?.find(
                                                                            application => application.username ===
                                                                            member
                                                                        ) ?
                                                                            applications?.find(
                                                                                application => application.username ===
                                                                                member
                                                                            )?.applicant
                                                                        :
                                                                        member
                                                                    }
                                                                    tileDesignation={'Member'}
                                                                    tileColor={labelColors.member}
                                                                />
                                                            </div>
                                                        }))
                                                        :
                                                        <div className={styles.member__Item}>
                                                            <CardTile 
                                                                tileName={'No member'}
                                                                tileDesignation={'No user'}
                                                                noUser={true}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        })
                                    )
                                }
                            </div>
                            
                        </>
                    }
                </div>
            </div>

            {/* SINGLE USER DETAIL MODAL  */}
            {
                showSelectedUser && <Overlay>
                    <div className={styles.single__User__Detail}>
                        <div 
                            className={styles.close__User__Detail} 
                            onClick={handleCloseSingleUserModal}
                        >
                            <AiOutlineClose fontSize={'1.5rem'} />
                        </div>
                        
                        <div className={styles.top__user__Info}>
                            <Avatar
                                name={
                                    applications?.find(application => application.username === currentSelectedUser?.name)?.applicant ? 
                                        applications?.find(application => application.username === currentSelectedUser?.name)?.applicant
                                    :
                                    currentSelectedUser?.name
                                }
                                round={true}
                                size='8rem'
                            />
                            <div>
                                <h5>
                                    {
                                        applications?.find(application => application.username === currentSelectedUser?.name)?.applicant ? 
                                            applications?.find(application => application.username === currentSelectedUser?.name)?.applicant
                                        :
                                        currentSelectedUser?.name
                                    }
                                </h5>
                                <p className={styles.single__User__label} style={{ backgroundColor: currentSelectedUser?.labelColor}}>{currentSelectedUser?.title}</p>
                            
                            </div>
                        </div>

                        <div className={styles.user__Detail__Info__Wrap}>
                            <div className={styles.user__Detail__Info}>
                                <p>
                                    Details
                                    <div className={styles.highlight}></div>
                                </p>
                            </div>
                            <div className={styles.user__Project__Details}>
                                <p>Project: {currentSelectedUser?.project}</p>
                                <p>Subprojects: {currentSelectedUser?.subprojects?.join(', ')}</p>
                                <p>Team Members: {currentSelectedUser?.members?.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </Overlay>
            }

            {/* COMPANY STRUCTURE CONFIGURATION MODAL */}
            {
                showConfigurationModal && <Overlay>
                    <div className={styles.structure__modal}>
                        <div 
                            className={styles.close__User__Detail} 
                            onClick={handleCloseStructureModal}
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
                                            value={copyOfStructureData?.ceo}
                                            onChange={
                                                ({ target }) => setCopyOfStructureData(
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
                                                            const matchingProjectFromCompanyStructure = copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === project));
                                                            
                                                            return <tr>
                                                                <td>{project}</td>
                                                                <td>
                                                                    <Select 
                                                                        value={
                                                                            {
                                                                                label: matchingProjectFromCompanyStructure?.project_lead ?
                                                                                    applications?.find(application => application.username === matchingProjectFromCompanyStructure?.project_lead)?.applicant
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
                                                                        id={crypto.randomUUID()}
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
                                                        const projectWithProjectLeads = copyOfStructureData?.project_leads?.map(item => item.projects.map(projectItem => projectItem.project))?.flat();
                                                        if (!projectWithProjectLeads.includes(project)) return null;
                                                        return { label: project, value: project };
                                                    }).filter(item => item !== null),
                                                ]
                                                : [{label: '', value: ''}]
                                            }
                                            placeholder={'Select project'}
                                            className={styles.select__Item}
                                            onChange={(val) => setSelectedProject(val.value)}
                                        />
                                    </label>
                                    
                                    {
                                        selectedProject?.length > 0 &&
                                        <>
                                            <label>
                                                <p>
                                                    <span>Select team lead</span>
                                                </p>
                                                {
                                                    
                                                }
                                                <Select 
                                                    value={
                                                        {
                                                            label: copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.find(item => item.project === selectedProject)?.team_lead ?
                                                                applications?.find(item => item?.username === copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.find(item => item?.project === selectedProject)?.team_lead)?.applicant
                                                                :
                                                            'Select teamlead'
                                                            ,
                                                            value: copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.find(item => item.project === selectedProject)?.team_lead
                                                        }
                                                    }
                                                    options={
                                                        onboardedUsers?.map(user => {
                                                            return { label: user?.applicant, value: user?.username }
                                                        })
                                                    }
                                                    onChange={(val) => handleUpdateProjectDetail(val.value, selectedProject, projectDetailUpdateType.teamlead_update)}  
                                                />
                                            </label>

                                            <label>
                                                <p>
                                                    <span>Select group leads</span>
                                                </p>
                                                <Select 
                                                    value={
                                                        copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.find(item => item.project === selectedProject)?.group_leads?.map(item => {
                                                            return {
                                                                label: applications?.find(user => user.username === item)?.applicant,
                                                                value: item,
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        onboardedUsers?.map(user => {
                                                            return { label: user?.applicant, value: user?.username }
                                                        })
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
                                                        copyOfStructureData?.project_leads?.find(item => item?.projects?.find(structure => structure?.project === selectedProject))?.find(item => item.project === selectedProject)?.members?.map(item => {
                                                            return {
                                                                label: applications?.find(user => user.username === item)?.applicant,
                                                                value: item,
                                                            }
                                                        })
                                                    }
                                                    options={
                                                        onboardedUsers?.map(user => {
                                                            return { label: user?.applicant, value: user?.username }
                                                        })
                                                    }
                                                    onChange={(val) => handleUpdateProjectDetail(val.map(item => item.value), selectedProject, projectDetailUpdateType.member_update)}  
                                                    isMulti
                                                />
                                            </label>
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
                                                onClick={handleGoBackward}
                                                disabled={dataLoading ? true : false}
                                            >
                                                <HiMiniArrowLongLeft fontSize={'1.2rem'} />
                                            </button>
                                        }
                                        <button 
                                            className={styles.form__Nav__Btn} 
                                            onClick={handleGoForward}
                                            disabled={dataLoading ? true : false}
                                        >
                                            <HiMiniArrowLongRight fontSize={'1.2rem'} />
                                        </button>
                                    </>
                                }
                            </>
                        </div>
                    </div>
                </Overlay>
            }

        </StaffJobLandingLayout>
    </>
}

export default CompanyStructurePage;