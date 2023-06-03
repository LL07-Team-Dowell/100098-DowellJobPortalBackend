import React from 'react';
import { testingRoles, testingRolesDict } from '../../utils/testingRoles';
import './styles.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useCurrentUserContext } from '../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';


const SwitchViewsModal = ({ handleCloseModal }) => {
    const { currentUser, setCurrentUser } = useCurrentUserContext();

    const handleItemClick = (item) => {
        handleCloseModal();
        
        if (item === testingRoles.groupLeadRole) return toast.info('Still in development');
        if (item === 'default') {
            const copyOfCurrentUser = structuredClone(currentUser);
            delete copyOfCurrentUser.settings_for_profile_info;

            setCurrentUser(copyOfCurrentUser);
            return
        }

        setCurrentUser((prevValue) => { 
            return { 
                ...prevValue, 
                settings_for_profile_info: {
                    profile_info: [
                        {
                            Role: item,
                            profile_title: currentUser?.userinfo?.username,
                        }
                    ],
                    fakeSuperUserInfo: true,
                }
            }
        });
    }

    return <>
        <div className="switch__Views__Modal">
            <div className="switch__View__Close__Icon" onClick={() => handleCloseModal()}>
                <AiOutlineClose />
            </div>
            <ul>
                {
                    React.Children.toArray(Object.keys(testingRoles).map(key => {
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