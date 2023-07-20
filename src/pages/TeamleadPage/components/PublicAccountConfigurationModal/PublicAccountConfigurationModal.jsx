import { AiOutlineClose } from 'react-icons/ai';
import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import { mutablePublicAccountStateNames } from '../../../HrPage/views/JobScreen/HrJobScreen';
import  { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const PublicAccountConfigurationModal = ({ 
    handleCloseModal, 
    handleBtnClick, 
    btnDisabled,  
    details,
    handeDetailChange,
}) => {

    const { userRolesFromLogin, userRolesLoaded } = useCurrentUserContext();
    const [ orgRoles, setOrgRoles ] = useState([]);

    useEffect(() => {

        const rolesToSet = userRolesFromLogin?.map(role => {
            return {
                option: role.role_name,
                value: role.role_name,
            }
        });
        setOrgRoles(rolesToSet);

    }, [])

    const handleIdChange = (inputName, valueEntered) => {
        const filteredValue = valueEntered.replace(/\D/g, "");
        handeDetailChange(inputName, filteredValue);
    };

    return <>
        <div className={styles.overlay}>
            <div className={styles.modal__Container}>
                <div className={styles.modal__CLose__Container}>
                    <AiOutlineClose
                        className={styles.modal__CLose__Icon} 
                        onClick={
                            handleCloseModal && typeof handleCloseModal === 'function' ?
                            () => handleCloseModal()
                            :
                            () => {}
                        }
                    />
                </div>
                <div>
                    <h2>Configure details for public user</h2>
                    <p className={styles.subtitle__Info}>
                        {
                            "One last step to go, configure mail and account details for public user"
                        }
                    </p>
                </div>

                <div className={styles.form__Wrapper}>
                    <label>
                        <span>Subject of email</span>
                        <input 
                            name={mutablePublicAccountStateNames.subject}
                            value={details[`${mutablePublicAccountStateNames.subject}`]}
                            onChange={({ target }) => handeDetailChange(target.name, target.value)}
                            placeholder='Subject of mail'
                        />
                    </label>

                    <label>
                        <span>Portfolio name to be assigned to user</span>
                        <input 
                            name={mutablePublicAccountStateNames.portfolio_name}
                            value={details[`${mutablePublicAccountStateNames.portfolio_name}`]}
                            onChange={({ target }) => handeDetailChange(target.name, target.value)}
                            placeholder='Portfolio xyz'
                        />
                    </label>

                    <label>
                        <span>Unique id for portfolio</span>
                        <input 
                            name={mutablePublicAccountStateNames.unique_id}
                            value={details[`${mutablePublicAccountStateNames.unique_id}`]}
                            onChange={({ target }) => handleIdChange(target.name, target.value)}
                            placeholder='123'
                        />
                    </label>

                    <div className={styles.select__Wrapper}>
                        <span>Member type to be assigned to user</span>
                        <select
                            value={details[`${mutablePublicAccountStateNames.member_type}`]}
                            onChange={({ target }) => handeDetailChange(mutablePublicAccountStateNames.member_type, target.value)}
                        >
                            <option value={''} disabled selected>{'Select member type'}</option>
                            {
                                React.Children.toArray(memberTypeOptions.map(val => {
                                    return <option value={val.value}>{val.option}</option>
                                }))
                            }
                        </select>
                    </div>

                    <div className={styles.select__Wrapper}>
                        <span>Role to be assigned to user</span>
                        {
                            !userRolesLoaded ?
                            <LoadingSpinner width={'2rem'} height={'2rem'} /> :
                            <select
                                value={details[`${mutablePublicAccountStateNames.role}`]}
                                onChange={({ target }) => handeDetailChange(mutablePublicAccountStateNames.role, target.value)}
                            >
                                <option value={''} disabled selected>{'Select role'}</option>
                                {
                                    React.Children.toArray(orgRoles?.map(val => {
                                        return <option value={val?.value}>{val?.option}</option>
                                    }))
                                }
                            </select>
                        }
                        
                    </div>

                    <button 
                        className={styles.Btn}
                        onClick={() => handleBtnClick()}
                        disabled={btnDisabled}
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    </>
}

const memberTypeOptions = [
    {
        option: 'Owner',
        value: 'owner',
    },
    {
        option: 'Team Member',
        value: 'team_member',
    },
    
    {
        option: 'User',
        value: 'user',
    },
]

const roleOptions = [
    {
        option: 'CandidateView',
        value: 'CandidateView',
    },
    {
        option: 'CandidateView',
        value: 'CandidateView',
    },
]
export default PublicAccountConfigurationModal;