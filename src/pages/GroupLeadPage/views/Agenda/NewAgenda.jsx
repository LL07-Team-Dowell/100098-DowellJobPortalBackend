import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from './styles.module.css';
import React, { useRef, useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { MdModeEditOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useEffect } from "react";
import { IoFilterOutline, IoTimerOutline } from "react-icons/io5";
import { addNewAgenda, getAllCompanyUserSubProject } from "../../../../services/commonServices";
import { BsCalendar2Date, BsPersonAdd } from "react-icons/bs";
import { formatDateForAPI } from "../../../../helpers/helpers";
import Avatar from "react-avatar";
import { AiOutlineClose, AiOutlineCopy, AiOutlineDelete, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { RiTimeLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { IoIosArrowBack } from "react-icons/io";

const NewGroupleadAgenda = () => {
    const { currentUser } = useCurrentUserContext();

    const [ newAgendaDetails, setNewAgendaDetails ] = useState({
        "agenda_title": '',
        "agenda_description": '',
        "project": '',
        "week_start": formatDateForAPI(new Date()),
        "week_end": formatDateForAPI(new Date(new Date().setDate(new Date().getDate() + 7))),
        "company_id": currentUser?.portfolio_info[0]?.org_id,
        "sub_project": '',
        "total_time": 0,
        "lead_name": currentUser.userinfo.username,
        "lead_approval": false,
    })
    const agendaTitleRef = useRef();
    const [ editAgendaTitle, setEditAgendaTitle ] = useState(false);
    const [ projectsAssignedToLead, setProjectsAssignedToLead ] = useState([]);
    const [ allSubprojects, setAllSubprojects ] = useState([]);
    const [ subprojectsForProject, setSubprojectForProject ] = useState([]);
    const [ timelineForAgenda, setTimelineForAgenda ] = useState([]);
    const [ timelinesWithEditPermitted, setTimelineWithEditPermitted ] = useState([]);
    const [ availableMembers, setAvailableMembers ] = useState([]);
    const [ itemUserListingToShow, setItemUserListingToShow ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ searchVal, setSearchVal ] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getAllCompanyUserSubProject(currentUser.portfolio_info[0].org_id, currentUser.portfolio_info[0].data_type).then(res => {
            setAllSubprojects(res.reverse());
        }).catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        const mainProjectForLead = currentUser?.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project;
        const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
            Array.isArray(
                currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
            );
        
        const projectsForLead = userHasOtherProjects ?
            [ mainProjectForLead, ...currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects ]
            :
        [ mainProjectForLead ];

        setProjectsAssignedToLead(projectsForLead);
            

        const listOfUsersFromPortfolio = currentUser?.userportfolio ?
            currentUser?.userportfolio?.filter(member => member.member_type !== 'public')
            :
        currentUser?.selected_product?.userportfolio?.filter(member => member.member_type !== 'public');

        setAvailableMembers(
            [
                ...new Set(
                    listOfUsersFromPortfolio.map(item => {
                        if (Array.isArray(item.username)) return item.username.flat();
                        return item.username
                    }).flat()
                )
            ]
        );

    }, [currentUser])

    useEffect(() => {
        if (newAgendaDetails.project.length < 1) return setSubprojectForProject([]);

        const matchingSubprojectsForProject = allSubprojects.find(
            (item) => item.parent_project === newAgendaDetails.project
          )?.sub_project_list;

        if (!matchingSubprojectsForProject) return setSubprojectForProject([]);
        setSubprojectForProject(matchingSubprojectsForProject)

    }, [newAgendaDetails.project])

    useEffect(() => {
        const totalTime = timelineForAgenda.reduce((a, b) => a + Number(b.hours), 0);
        setNewAgendaDetails((prevDetails) => {
            return {
                ...prevDetails,
                total_time: totalTime,
            }
        })
    }, [timelineForAgenda])


    const handleAgendaDetailUpdate = (keyToUpdate, newVal) => {
        setNewAgendaDetails((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: newVal,
            }
        })
    }

    const handleEditAgendaTitle = () => {
        setEditAgendaTitle(true);
        agendaTitleRef.current.focus();
    }

    const handleAddTimeLine = () => {
        const idForNewTimeLine = crypto.randomUUID();

        setTimelineWithEditPermitted((prev) => {
            return [
                ...prev,
                idForNewTimeLine,
            ]
        })

        setTimelineForAgenda((prevTimeline) => {
            return [
                ...prevTimeline,
                {
                    subtask: '',
                    timeline_start: formatDateForAPI(new Date()),
                    timeline_end: formatDateForAPI(new Date(new Date().setDate(new Date().getDate() + 1))),
                    hours: '0',
                    assignees: [],
                    id: idForNewTimeLine,
                }
            ]
        })
        setItemUserListingToShow(null);
    }

    const handleUpdateSingleSubtaskName = (id, keyToChange, newVal, updateArrayState=false) => {
        const copyOfTimeline = timelineForAgenda.slice();
        const foundItemToEditIndex = copyOfTimeline.findIndex(item => item.id === id);

        if (foundItemToEditIndex !== -1) {
            const newItem = updateArrayState ? 
                {
                    ...copyOfTimeline[foundItemToEditIndex],
                    [keyToChange]: [...copyOfTimeline[foundItemToEditIndex][keyToChange], newVal],
                }
            :  
            {
                ...copyOfTimeline[foundItemToEditIndex],
                [keyToChange]: newVal,
            }
            copyOfTimeline[foundItemToEditIndex] = newItem;
            setTimelineForAgenda(copyOfTimeline)
        }
    }

    const handleRemoveAssignee = (id, user) => {
        const copyOfTimeline = timelineForAgenda.slice();
        const foundItemToEditIndex = copyOfTimeline.findIndex(item => item.id === id);

        if (foundItemToEditIndex !== -1) {
            const newItem = {
                ...copyOfTimeline[foundItemToEditIndex],
                'assignees': copyOfTimeline[foundItemToEditIndex]['assignees'].filter(item => item !== user),
            }
            copyOfTimeline[foundItemToEditIndex] = newItem;
            setTimelineForAgenda(copyOfTimeline)
        }
    }

    const addItemToEditList = (id) => {
        const copyOfTimelinesWithEditPermitted = timelinesWithEditPermitted.slice();
        copyOfTimelinesWithEditPermitted.push(id);
        setTimelineWithEditPermitted(copyOfTimelinesWithEditPermitted)
    }

    const removeItemFromEditList = (id) => {
        const updatedTimelinesWithEditPermitted = timelinesWithEditPermitted.slice().filter(item => item !== id);
        setTimelineWithEditPermitted(updatedTimelinesWithEditPermitted);
        setItemUserListingToShow(null);
    }

    const handleNumberChange = (id, target) => {
        const filteredValue = target.value.replace(/[^0-9.]/g, "");
        handleUpdateSingleSubtaskName(id, target.name,  filteredValue)
    }

    const handleDeleteTimeline = (id) => {
        const updatedTimelines = timelineForAgenda.slice().filter(item => item.id !== id);
        setTimelineForAgenda(updatedTimelines)
    }

    const handleDuplicateTimeline = (id) => {
        const [
            updatedTimelines,
            foundTImeline,
            foundTImelineIndex
        ] = [
            timelineForAgenda.slice(),
            timelineForAgenda.find(item => item.id === id),
            timelineForAgenda.findIndex(item => item.id === id)
        ];

        if (foundTImeline && foundTImelineIndex !== -1) {
            const idForNewTimeLine = crypto.randomUUID();
            const newDuplicatedTimeLine = {
                ...foundTImeline,
                id: idForNewTimeLine,
            }

            updatedTimelines.splice(foundTImelineIndex + 1, 0, newDuplicatedTimeLine)
            setTimelineForAgenda(updatedTimelines);

            setTimelineWithEditPermitted((prev) => {
                return [
                    ...prev,
                    idForNewTimeLine,
                ]
            });
        }
    }

    const ordinal_suffix_of = (i) => {
        const j = i % 10;
        const k = i % 100;

        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    }

    const handleSaveAgenda = async () => {
        if (loading) return

        if (newAgendaDetails.agenda_title.length < 1) return toast.info('Please enter a title for your agenda')
        if (newAgendaDetails.agenda_description.length < 1) return toast.info('Please enter a description for your agenda')
        if (newAgendaDetails.project.length < 1) return toast.info('Please select a project')
        if (newAgendaDetails.sub_project.length < 1) return toast.info('Please select a subproject')
        if (newAgendaDetails.week_start > newAgendaDetails.week_end) return toast.info('The start date of your agenda must be less than its end date')
        if (timelineForAgenda.length < 1) return toast.info('Please add at least one timeline for your agenda')
        
        const foundEmptyTimelineNameIndex = timelineForAgenda.findIndex(timeline => timeline.subtask.length < 1);
        if (foundEmptyTimelineNameIndex !== -1) return toast.info(`Please enter a name for your ${ordinal_suffix_of(foundEmptyTimelineNameIndex + 1)} timeline`)
        
        const foundInvalidTimelineIndex = timelineForAgenda.findIndex(timeline => timeline.timeline_start > timeline.timeline_end)
        if (foundInvalidTimelineIndex !== -1) return toast.info(`The start of your ${ordinal_suffix_of(foundInvalidTimelineIndex + 1)} timeline must be less than its end date`)
        
        const differenceBetweenWeekStartAndEnd = ( new Date(newAgendaDetails.week_end).getTime() - new Date(newAgendaDetails.week_start).getTime() ) / (1000 * 60 * 60 * 24); 
        if (differenceBetweenWeekStartAndEnd !== 7) return toast.info('The difference between the start and end date of your agenda must be exactly 7 days')

        setTimelineWithEditPermitted([]);
        
        newAgendaDetails.timeline = timelineForAgenda.map(item => {
            const copyOfItem = {...item};
            delete copyOfItem.id;

            return copyOfItem
        });

        newAgendaDetails.aggregate_agenda = timelineForAgenda.map(agenda => agenda.subtask).join('. ');
        if (newAgendaDetails.aggregate_agenda.length < 60) return toast.info('Please make sure your timelines add up to at least 60 characters')
        
        newAgendaDetails.total_time = `${newAgendaDetails.total_time}`;
        newAgendaDetails.sub_project = newAgendaDetails.sub_project.replaceAll(' ', '-');

        console.log(newAgendaDetails);
        setLoading(true);

        try {
            const res = (await addNewAgenda(newAgendaDetails)).data;
            console.log('agenda response: ', res);
            setLoading(false);
            toast.success('Successfully added your agenda!')
            navigate('/track-agenda');
        } catch (error) {
            setLoading(false);
            toast.error('Failed to add weekly agenda, please try again later')
        }
    }

    return <>
        <StaffJobLandingLayout
            teamleadView={true}
            isGrouplead={true}
            hideSearchBar={true}
        >
            <div className={styles.wrapper}>
                
                <p className={styles.hairline}>
                    <IoIosArrowBack 
                        cursor={'pointer'}
                        onClick={() => navigate(-1)}
                    />
                    <span 
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(-1)}
                    >
                        Add New
                    </span>
                    <span>
                        /
                    </span>
                    <span className={styles.active__Item}>Weekly Agenda</span>
                </p>
                <div className={styles.custom_hr}></div>
                <div className={styles.top__Agenda__Content}>
                    <div>
                        <div className={styles.agenda__Title__Wrap}>
                            <input 
                                type="text"
                                placeholder="Agenda Name"
                                name="agenda_title"
                                onChange={({ target }) => handleAgendaDetailUpdate(target.name, target.value)}
                                value={newAgendaDetails.agenda_title}
                                className={styles.agenda_title}
                                readOnly={editAgendaTitle ? false : true}
                                ref={agendaTitleRef}
                            />
                            <div
                                data-tooltip-id={'54968496 agenda_title'}
                                data-tooltip-content={!editAgendaTitle ? 'Edit agenda title' : 'Finish editing title'}
                            >
                                {
                                    editAgendaTitle ?
                                    <FaCheck 
                                        onClick={() => setEditAgendaTitle(false)}
                                        cursor={'pointer'}
                                        size={'1.3rem'}
                                        color="#005734"
                                    />
                                    :
                                    <MdModeEditOutline
                                        onClick={handleEditAgendaTitle}
                                        cursor={'pointer'}
                                        size={'1.3rem'}
                                    />
                                }
                                <Tooltip 
                                    id={'54968496 agenda_title'}
                                />
                            </div>
                        </div>
                        <textarea 
                            type="text"
                            placeholder="Add description"
                            name="agenda_description"
                            onChange={({ target }) => handleAgendaDetailUpdate(target.name, target.value)}
                            value={newAgendaDetails.agenda_description}
                            className={styles.agenda_description}
                            rows={1}
                        ></textarea>
                    </div>
                    <button 
                        className={styles.save__Btn}
                        onClick={handleSaveAgenda}
                        disabled={loading ? true : false}
                    >
                        {
                            loading ? 
                                <LoadingSpinner width={'1.3rem'} height={'1.3rem'} color={'#fff'} />
                            :
                            'Save Agenda'
                        }
                    </button>
                </div>
                <div className={styles.agenda__Mid__Content}>
                    <label>
                        <span>Project</span>
                        <div className={styles.select__item}>
                            <IoFilterOutline />
                            <select
                                value={newAgendaDetails.project}
                                onChange={({ target }) => handleAgendaDetailUpdate('project', target.value)}
                                defaultValue={''}
                            >
                                <option value={''} disabled>Select project</option>
                                {
                                    React.Children.toArray(projectsAssignedToLead.map(item => {
                                        return <option value={item}>{item}</option>
                                    }))
                                }
                            </select>
                        </div>
                    </label>
                    <label>
                        <span>Subproject</span>
                        <div className={styles.select__item}>
                            <IoFilterOutline />
                            <select
                                value={newAgendaDetails.sub_project}
                                onChange={({ target }) => handleAgendaDetailUpdate('sub_project', target.value)}
                                defaultValue={''}
                            >
                                <option value={''} disabled>Select subproject</option>
                                {
                                    React.Children.toArray(subprojectsForProject.map(item => {
                                        return <option value={item}>{item}</option>
                                    }))
                                }
                            </select>
                        </div>
                    </label>
                    <label>
                        <span>Start Date - End Date</span>
                        <div className={styles.select__item}>
                            {/* <BsCalendar2Date /> */}
                            <div className={styles.date__Select}>
                                <input
                                    type="date" 
                                    className={styles.date__Input}
                                    value={newAgendaDetails.week_start}
                                    name="week_start"
                                    onChange={( { target }) => handleAgendaDetailUpdate(target.name, target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="date" 
                                    className={styles.date__Input}
                                    value={newAgendaDetails.week_end}
                                    name="week_end"
                                    onChange={( { target }) => handleAgendaDetailUpdate(target.name, target.value)}
                                />
                            </div>
                        </div>
                    </label>
                    <label style={{ pointerEvents: 'none' }}>
                        <span>Hours</span>
                        <div className={styles.select__item}>
                            <IoTimerOutline />
                            <input
                                type="text" 
                                value={newAgendaDetails.total_time}
                                readOnly={true}
                                name="total_time"
                                style={{ maxWidth: '4rem' }}
                            />
                            <span>hrs</span>
                        </div>
                    </label>
                </div>
                <br />
                <div className={styles.custom_hr}></div>
                <h2 className={styles.timeline__Header}>
                    <span>Timeline for Agenda</span>
                    <span className={styles.timeline__Count}>{timelineForAgenda.length}</span>
                </h2>

                <div className={styles.table__Wrap}>
                    <table className={styles.agenda__Table}>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Timeline</td>
                                <td>Hours</td>
                                <td>Assignee</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                React.Children.toArray(timelineForAgenda.map(timeline => {
                                    return <tr>
                                        <td>
                                            {
                                                timelinesWithEditPermitted.includes(timeline.id) ?
                                                <input 
                                                    type="text"
                                                    value={timeline.subtask}
                                                    name="subtask"
                                                    onChange={({ target }) => handleUpdateSingleSubtaskName(timeline.id, target.name,  target.value)}
                                                    placeholder="Enter timeline here"
                                                />
                                                :
                                                <span>
                                                    {timeline.subtask}
                                                </span>
                                            }
                                        </td>
                                        <td>
                                            {
                                                timelinesWithEditPermitted.includes(timeline.id) ? <>
                                                    <input 
                                                        type="date"
                                                        value={timeline.timeline_start}
                                                        name="timeline_start"
                                                        onChange={({ target }) => handleUpdateSingleSubtaskName(timeline.id, target.name,  target.value)}
                                                        placeholder="Start date"
                                                    />
                                                    <span>-</span>
                                                    <input 
                                                        type="date"
                                                        value={timeline.timeline_end}
                                                        name="timeline_end"
                                                        onChange={({ target }) => handleUpdateSingleSubtaskName(timeline.id, target.name,  target.value)}
                                                        placeholder="End date"
                                                    />
                                                </>
                                                :
                                                <span>
                                                    {new Date(timeline.timeline_start).toLocaleString('en-us', { month: 'short' })} {new Date(timeline.timeline_start).getDate()} - {new Date(timeline.timeline_end).toLocaleString('en-us', { month: 'short' })} {new Date(timeline.timeline_end).getDate()}
                                                </span>
                                            }
                                        </td>
                                        <td>
                                            {
                                                timelinesWithEditPermitted.includes(timeline.id) ? <>
                                                    <input
                                                        type="text"
                                                        onChange={({ target }) => handleNumberChange(timeline.id, target)}
                                                        value={timeline.hours}
                                                        name="hours"
                                                    />
                                                </>
                                                :
                                                <span>
                                                    {timeline.hours}
                                                </span>
                                            }
                                        </td>
                                        <td className={styles.flex__Items}>
                                            <div className={`${styles.user__Assigned__Wrap} ${timelinesWithEditPermitted.includes(timeline.id) ? '' : styles.user__Assigned__Wrap__Overflow}`}>
                                                {
                                                    timeline.assignees.length < 1 && !timelinesWithEditPermitted.includes(timeline.id) &&
                                                    <span>No users assigned yet</span>
                                                }

                                                {
                                                    React.Children.toArray(timeline.assignees.map(user => {
                                                        return  <div style={{ position: 'relative' }}>
                                                            <Avatar 
                                                                name={user.slice(0, 1) + ' ' + user.split(' ')[user.split(' ').length - 1]?.slice(0, 1)}
                                                                size='2rem'
                                                                round={true}
                                                                title={user}
                                                            />
                                                            {
                                                                timelinesWithEditPermitted.includes(timeline.id) &&
                                                                <AiOutlineClose 
                                                                    className={styles.remove_user__Icon} 
                                                                    fontSize={'0.8rem'}
                                                                    cursor={'pointer'}
                                                                    onClick={() => handleRemoveAssignee(timeline.id, user)}
                                                                />
                                                            }
                                                            
                                                        </div>
                                                    }))
                                                }
                                                {
                                                    timelinesWithEditPermitted.includes(timeline.id) && <>
                                                        <div
                                                            data-tooltip-id={timeline.id + 'assignee'}
                                                            data-tooltip-content={'Assign users working on this'}
                                                            className={styles.assign__Member__Wrap}
                                                        >
                                                            <BsPersonAdd 
                                                                cursor={'pointer'}
                                                                fontSize={'1.3rem'}
                                                                onClick={() => setItemUserListingToShow(timeline.id)}
                                                            />

                                                            <Tooltip 
                                                                id={timeline.id + 'assignee'}
                                                            />

                                                            {
                                                                itemUserListingToShow && itemUserListingToShow === timeline.id &&
                                                                <div className={styles.select__User}>
                                                                    <h3>Select users</h3>
                                                                    <div className={styles.user__Search__Wrap}>
                                                                        <AiOutlineSearch 
                                                                            fontSize={'1rem'}
                                                                        />
                                                                        <input 
                                                                            type="text"
                                                                            placeholder="Search for user"
                                                                            value={searchVal}
                                                                            onChange={({ target }) => setSearchVal(target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.user__Listing}>
                                                                        {
                                                                            React.Children.toArray(
                                                                                availableMembers
                                                                                .filter((member) => {
                                                                                    if (searchVal.length < 1) return true
                                                                                    return member.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase())
                                                                                })
                                                                                .map(member => {
                                                                                    if (timeline.assignees.includes(member)) return <></>
                                                                                    return <p onClick={() => handleUpdateSingleSubtaskName(timeline.id, 'assignees', member, true)}>
                                                                                        <span>{member}</span>
                                                                                    </p>
                                                                            }))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </td>
                                        <td className={styles.actions__Wrap}>
                                            {
                                                timelinesWithEditPermitted.includes(timeline.id) ?
                                                    <>
                                                        <div 
                                                            data-tooltip-id={timeline.id + 'done'}
                                                            data-tooltip-content={'Finish editing'}
                                                        >
                                                            <FaCheck 
                                                                cursor={'pointer'}
                                                                onClick={() => removeItemFromEditList(timeline.id)}
                                                            />
                                                        </div>
                                                        <Tooltip 
                                                            id={timeline.id + 'done'}
                                                        />
                                                    </>
                                                :
                                                <>
                                                    <div 
                                                        data-tooltip-id={timeline.id + 'edit'}
                                                        data-tooltip-content={'Edit timeline'}
                                                    >
                                                        <MdModeEditOutline 
                                                            cursor={'pointer'}
                                                            onClick={() => addItemToEditList(timeline.id)}
                                                        />
                                                    </div>
                                                    
                                                    <div 
                                                        data-tooltip-id={timeline.id + 'delete'}
                                                        data-tooltip-content={'Delete timeline'}
                                                    >
                                                        <AiOutlineDelete 
                                                            cursor={'pointer'}
                                                            onClick={() => handleDeleteTimeline(timeline.id)}
                                                        />
                                                    </div>
                                                    <div 
                                                        data-tooltip-id={timeline.id + 'copy'}
                                                        data-tooltip-content={'Duplicate timeline'}
                                                    >
                                                        <AiOutlineCopy 
                                                            cursor={'pointer'}
                                                            onClick={() => handleDuplicateTimeline(timeline.id)}
                                                        />
                                                    </div>
                                                    
                                                    <Tooltip 
                                                        id={timeline.id + 'edit'}
                                                    />
                                                    <Tooltip 
                                                        id={timeline.id + 'delete'}
                                                    />
                                                    <Tooltip 
                                                        id={timeline.id + 'copy'}
                                                    />
                                                </>
                                            }
                                        </td>
                                    </tr>
                                }))
                            }
                        </tbody>
                    </table>

                    <button
                        className={styles.add__Agenda__Btn}
                        onClick={handleAddTimeLine}
                    >
                        <AiOutlinePlus />
                        <span>Add timeline</span>
                    </button>
                </div>
                
                <button 
                    className={styles.save__Btn}
                    onClick={handleSaveAgenda}
                    disabled={loading ? true : false}
                >
                    {
                        loading ? 
                            <LoadingSpinner width={'1.3rem'} height={'1.3rem'} color={'#fff'} />
                        :
                        'Save Agenda'
                    }
                </button>
            </div>
        </StaffJobLandingLayout>
    </>
}

export default NewGroupleadAgenda;