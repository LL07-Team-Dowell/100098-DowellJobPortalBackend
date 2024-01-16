import React, { useEffect, useRef, useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from "./styles.module.css";
import { useJobContext } from "../../../../contexts/Jobs";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import EmployeeItem from "./components/EmployeeItem/EmployeeItem";
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

const labelColors = {
    ceo: '#00C1B7',
    projectLead: '#FE6A6A',
    teamlead: '#FF9F4E',
    groupLead: '#5AA4FB',
    member: '#FEDD6A',
}


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
        if (!companyStructureLoaded) return
        
        // FOR TESTING
        setCopyOfStructureData(testCompanyData);

        // setCopyOfStructureData(companyStructure);
    }, [companyStructure, companyStructureLoaded])

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
        setShowConfigurationModal(false);
        setCurrentModalPage(1);
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
                            <p>Project Lead: <span>{copyOfStructureData?.projects?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.project_lead}</span></p>
                            <p>Team Lead: <span>{copyOfStructureData?.projects?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.projects?.find(item => item.project === searchProjectVal)?.team_lead}</span></p>
                            <p>Group Lead: <span>{copyOfStructureData?.projects?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.projects?.find(item => item.project === searchProjectVal)?.group_leads?.join(', ')}</span></p>
                            <p>Members: <span>{copyOfStructureData?.projects?.find(item => item?.projects?.find(structure => structure?.project === searchProjectVal))?.projects?.find(item => item.project === searchProjectVal)?.members?.join(', ')}</span></p>
                        </div>
                    </>
                }

                <div className={styles.structure__Display}>
                    {
                        !copyOfStructureData ?
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
                                            const matchingProjectFromCompanyStructure = copyOfStructureData?.projects?.find(item => item?.projects?.find(structure => structure?.project === projectItem))
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
                                                                onboardedUsers?.find(
                                                                    application => application.username ===
                                                                        matchingProjectFromCompanyStructure?.project_lead
                                                                ) ?
                                                                    onboardedUsers?.find(
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
                                                            onboardedUsers?.find(
                                                                application => application.username ===
                                                                    foundTeamleadFromCompanyStructure
                                                            ) ?
                                                                onboardedUsers?.find(
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
                                                                                    onboardedUsers?.find(
                                                                                        application => application.username ===
                                                                                            grouplead
                                                                                    ) ?
                                                                                        onboardedUsers?.find(
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
                                                                        onboardedUsers?.find(
                                                                            application => application.username ===
                                                                            member
                                                                        ) ?
                                                                            onboardedUsers?.find(
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
                                    onboardedUsers?.find(application => application.username === currentSelectedUser?.name)?.applicant ? 
                                        onboardedUsers?.find(application => application.username === currentSelectedUser?.name)?.applicant
                                    :
                                    currentSelectedUser?.name
                                }
                                round={true}
                                size='8rem'
                            />
                            <div>
                                <h5>
                                    {
                                        onboardedUsers?.find(application => application.username === currentSelectedUser?.name)?.applicant ? 
                                            onboardedUsers?.find(application => application.username === currentSelectedUser?.name)?.applicant
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
                            <AiOutlineClose fontSize={'1.5rem'} />
                        </div>
                        <div>
                            <h2>
                                {
                                    !companyStructure ? 'Configure Company Structure'
                                    :
                                    'Edit Structure'
                                }
                            </h2>
                            <p>Step One: Configure CEO</p>
                        </div>
                        <div>

                        </div>
                        <div>
                            
                            <button>
                                <HiMiniArrowLongLeft />
                            </button>
                            <button>
                                <HiMiniArrowLongRight />
                            </button>
                            
                        </div>
                    </div>
                </Overlay>
            }

        </StaffJobLandingLayout>
    </>
}

export default CompanyStructurePage;