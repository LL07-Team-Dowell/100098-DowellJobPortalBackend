import React from 'react';
import { testingRoles, testingRolesDict } from '../../utils/testingRoles';
import './styles.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useCurrentUserContext } from '../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { rolesDict } from '../../pages/AdminPage/views/Settings/AdminSettings';
import { useMediaQuery } from '@mui/material';


const SwitchViewsModal = ({ 
    handleCloseModal, 
    restrictedRoles, 
    otherPermittedRoles, 
    otherProjects, 
    assignedProject, 
    defaultRole, 
    newSidebarDesign,
}) => {
    const { currentUser, setCurrentUser } = useCurrentUserContext();
    const navigate = useNavigate();
    const isLargeScreen = useMediaQuery("(min-width: 992px)");

    const handleItemClick = (item) => {
        handleCloseModal();

        // if (item === testingRoles.groupLeadRole) return toast.info('Still in development');

        navigate("/");

        if (item === 'default') {
            const copyOfCurrentUser = structuredClone(currentUser);
            delete copyOfCurrentUser.settings_for_profile_info;
            delete copyOfCurrentUser.fakeSubAdminRoleSet

            if (
                currentUser.settings_for_profile_info &&
                currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1].Role === testingRoles.superAdminRole
            ) {
                copyOfCurrentUser.settings_for_profile_info = {
                    profile_info: [
                        {
                            Role: testingRoles.superAdminRole,
                            profile_title: currentUser?.portfolio_info[0]?.portfolio_name,
                        }
                    ],
                }
                copyOfCurrentUser.isSuperAdmin = true;
            }

            setCurrentUser(copyOfCurrentUser);
            sessionStorage.setItem('user', JSON.stringify(copyOfCurrentUser));
            return
        }

        const updatedUserDetail = structuredClone(currentUser);
        delete updatedUserDetail.fakeSubAdminRoleSet;
        updatedUserDetail.settings_for_profile_info = {
            profile_info: [
                {
                    Role: item,
                    profile_title: currentUser?.userinfo?.username,
                }
            ],
        }
        if (!restrictedRoles) updatedUserDetail.settings_for_profile_info.fakeSuperUserInfo = true;
        if (restrictedRoles) {
            updatedUserDetail.settings_for_profile_info.profile_info[0].project = assignedProject;
            updatedUserDetail.settings_for_profile_info.profile_info[0].other_roles = defaultRole === item ?
                otherPermittedRoles
                :
            [defaultRole, ...otherPermittedRoles.filter(role => role !== item)];
            updatedUserDetail.settings_for_profile_info.profile_info[0].additional_projects = otherProjects;
        }

        if (item === 'sub_admin' && !restrictedRoles) updatedUserDetail.fakeSubAdminRoleSet = true;

        if (
            currentUser.settings_for_profile_info &&
            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1].Role === testingRoles.superAdminRole
        ) {
            updatedUserDetail.isSuperAdmin = true;
        }

        setCurrentUser(updatedUserDetail);
        sessionStorage.setItem('user', JSON.stringify(updatedUserDetail));
    }

    return <>
        <div className={`switch__Views__Modal ${newSidebarDesign ? 'new__Side' : ''}`}>
            {
                !isLargeScreen && <div className="switch__View__Close__Icon" onClick={() => handleCloseModal()}>
                    <AiOutlineClose />
                </div>
            }
            <ul>
                {
                    restrictedRoles ?
                    React.Children.toArray(otherPermittedRoles.filter(role => role !== defaultRole).map(role => {
                        if (!rolesDict[role]) return <></>
                        return <li onClick={() => handleItemClick(role)}>
                            {rolesDict[role]}
                        </li>
                    })) :
                    React.Children.toArray(Object.keys(testingRoles).map(key => {
                        if (!testingRolesDict[key]) return <></>
                        return <li onClick={() => handleItemClick(testingRoles[key])}>
                            {testingRolesDict[key]}
                        </li>
                    }))
                }
                {
                    restrictedRoles ? <li onClick={() => handleItemClick(defaultRole)}>
                        {rolesDict[defaultRole]}
                    </li>
                    :
                    <li onClick={() => handleItemClick('default')}>
                        Default
                    </li>
                }
            </ul>
        </div>
    </>
}

export default SwitchViewsModal;