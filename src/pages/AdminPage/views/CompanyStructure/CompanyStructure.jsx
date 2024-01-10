import React, { useEffect, useRef, useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from "./styles.module.css";
import { getApplicationForAdmin } from "../../../../services/adminServices";
import { useJobContext } from "../../../../contexts/Jobs";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import EmployeeItem from "./components/EmployeeItem/EmployeeItem";
import { GoRepoForked } from "react-icons/go";
import Select from "react-select";
import TitleItem from "./components/TitleItem/TitleItem";
import { testCompanyData } from "./utils/testData";
import CardTile from "./components/CardTile/CardTile";



const CompanyStructurePage = () => {
    const {
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        projectsLoaded,
        projectsAdded,
    } = useJobContext();
    const { currentUser } = useCurrentUserContext();
    const [ copyOfStructureData, setCopyOfStructureData ] = useState(null);
    const [ widthOfProjectConnector, setWidthOfProjectConnector ] = useState('100%');
    const [ onboardedUsers, setOnboardedUsers ] = useState([]);
    const [ searchProjectVal, setSearchProjectVal ] = useState('');
    const [ showSearchResult, setShowSearchResult ] = useState(false);
    const projectWrapperRef = useRef();
    const singleProjectsRefs = useRef([]);


    const addToRefsArray = (elem, arrayToAddTo) => {
        if (elem && !arrayToAddTo.current.includes(elem)) arrayToAddTo.current.push(elem);
    };


    useEffect(() => {
        // FOR TESTING
        setCopyOfStructureData(testCompanyData);

        if (!applicationsLoaded) {

            getApplicationForAdmin(currentUser?.portfolio_info[0]?.org_id).then(res => {
                const applicationsFetched = res?.data?.response?.data?.filter(
                    (item) => currentUser?.portfolio_info[0]?.data_type === item.data_type
                )?.reverse()

                setApplications(applicationsFetched);
                setApplicationsLoaded(true);

            }).catch(err => {
                console.log('Failed to get applications for admin');
                setApplicationsLoaded(true);
            })
        }

    }, [])

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
        setOnboardedUsers(
            applications?.filter(application => application.status === candidateStatuses.ONBOARDING)
        )
    }, [applications])

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
                    <div className={styles.nav__Users__Content}>
                        <>
                            {
                                React.Children.toArray(
                                    onboardedUsers?.slice(0, 3)?.map(application => {
                                        return <EmployeeItem 
                                            item={application} 
                                            isImageItem={true}
                                        />
                                    })
                                )
                            }
                        </>
                        {
                            onboardedUsers?.slice(3)?.length > 0 ?
                                <EmployeeItem 
                                    item={`+${onboardedUsers?.slice(3)?.length}`}
                                />
                            :
                            <></>
                        }
                    </div>
                </div>
                <div className={styles.project__Select}>
                    <div>
                        <p>Project Name</p>
                        <Select 
                            value={{
                                label: searchProjectVal,
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
                <div className={styles.structure__Display}>
                    {
                        !copyOfStructureData ?
                            <button className={`${styles.result__Btn} ${styles.configure__Btn}`}>
                                <span>Configure structure</span>
                            </button>
                        :
                        <>
                            <div className={styles.ceo__Item__Wrap}>
                                <TitleItem 
                                    title={'Company CEO'}
                                    hasTrailingDash={true}
                                />
                                <CardTile 
                                    tileName={copyOfStructureData?.ceo}
                                    tileDesignation={'CEO'}
                                    tileColor={'#00C1B7'}
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
                                                                '#FE6A6A'
                                                            : 
                                                            null
                                                        }
                                                        hasTrailingDash={true}
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
                                                            '#FF9F4E'
                                                        :
                                                        null   
                                                    }
                                                />
                                                
                                                {/* <div className={styles.group_leads__Wrap}>
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
                                                                                tileColor={'#5AA4FB'}
                                                                                hasLeadingDash={true}
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
                                                            />
                                                        </div>
                                                    }
                                                </div> */}
                                            </div>
                                        })
                                    )
                                }
                            </div>
                            
                        </>
                    }
                </div>
            </div>
        </StaffJobLandingLayout>
    </>
}

export default CompanyStructurePage;