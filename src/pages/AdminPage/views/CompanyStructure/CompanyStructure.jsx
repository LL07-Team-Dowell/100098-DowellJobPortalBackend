import React, { useEffect, useRef, useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from "./styles.module.css";
import { useJobContext } from "../../../../contexts/Jobs";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { GoRepoForked } from "react-icons/go";
import Select from "react-select";
import TitleItem from "./components/TitleItem/TitleItem";
import CardTile from "./components/CardTile/CardTile";
import UserIconsInfo from "./components/UsersIconsInfo/UserIconsInfo";
import { toast } from "react-toastify";
import { useCompanyStructureContext } from "../../../../contexts/CompanyStructureContext";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { updateCompanyStructure } from "../../../../services/adminServices";
import { changeToTitleCase } from "../../../../helpers/helpers";
import { labelColors } from "./utils/utils";
import StructureConfigurationModal from "./components/StructureConfigurationModal/StructureConfigurationModal";
import UserDetailModal from "./components/UserDetailModal/UserDetailModal";

const CompanyStructurePage = () => {
    const {
        applications,
        applicationsLoaded,
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
                showSelectedUser && 
                <UserDetailModal
                    currentSelectedUser={currentSelectedUser}
                    handleCloseSingleUserModal={handleCloseSingleUserModal}
                />
            }

            {/* COMPANY STRUCTURE CONFIGURATION MODAL */}
            {
                showConfigurationModal && 
                <StructureConfigurationModal 
                    copyOfExistingStructure={copyOfStructureData}
                    updateCopyOfExistingStructure={setCopyOfStructureData}
                    dataLoading={dataLoading}
                    onboardedUsers={onboardedUsers}
                    selectedProject={selectedProject}
                    updateSelectedProject={setSelectedProject}
                    handleGoForward={handleGoForward}
                    handleGoBackward={handleGoBackward}
                    handleCloseStructureModal={handleCloseStructureModal}
                />
            }

        </StaffJobLandingLayout>
    </>
}

export default CompanyStructurePage;