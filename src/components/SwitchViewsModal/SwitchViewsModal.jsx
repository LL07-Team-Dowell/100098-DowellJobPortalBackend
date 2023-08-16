import React from 'react';
import { testingRoles, testingRolesDict } from '../../utils/testingRoles';
import './styles.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useCurrentUserContext } from '../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const SwitchViewsModal = ({ handleCloseModal }) => {
    const { currentUser, setCurrentUser } = useCurrentUserContext();
    const navigate = useNavigate();

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
            fakeSuperUserInfo: true,
        }

        if (item === 'sub_admin') updatedUserDetail.fakeSubAdminRoleSet = true;

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
        <div className="switch__Views__Modal">
            <div className="switch__View__Close__Icon" onClick={() => handleCloseModal()}>
                <AiOutlineClose />
            </div>
            <ul>
                {
                    React.Children.toArray(Object.keys(testingRoles).map(key => {
                        if (!testingRolesDict[key]) return <></>
                        return <li onClick={() => handleItemClick(testingRoles[key])}>
                            {testingRolesDict[key]}
                        </li>
                    }))
                }
                <li onClick={() => handleItemClick('default')}>
                    Default
                </li>
            </ul>
        </div>
    </>
}

export default SwitchViewsModal;