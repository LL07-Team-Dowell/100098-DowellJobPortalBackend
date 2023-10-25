import { useMediaQuery } from '@mui/material';
import { AirlineSeatFlat } from '@mui/icons-material';
import { useState } from 'react';
import Avatar from 'react-avatar';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { editTeamTask } from '../../../../../../../services/teamleadServices';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 7px 29px 0 rgba(100, 100, 111, 0.2);
  width: 450px;
  position: relative;
  `;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: black;
`;

const ModalDetails = ({ taskname, status, memberassign, onClose, description, subtasks, taskId, data }) => {
    const [subTasks, setSubTask] = useState(Object.keys(subtasks || {}));
    const isSmallScreen = useMediaQuery('(max-width: 767px)');

    const removeSubTask = (value) => {
        const newData = {
            ...data,
            subtasks: subTasks.map(s => s === value ? true : false)
        }
        editTeamTask(taskId, newData)
            .then(() => {
                setSubTask(subTasks?.filter(t => t !== value));
                toast.success(`${value} marked as done`);
            })
            .catch(err => {
                toast.error(err.message)
            })
    }
    return (
        <ModalContainer>
            <ModalContent style={{ 
                width: isSmallScreen ? '90%' : '450px',
                maxHeight: '75%',
                overflowY: 'auto', 
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Poppins, sans-serif',
                    letterSpacing: '0.03em',
                    color: '#005734'
                }}>
                    View Team Task Details
                </h3>

                <div>
                    <h4>Task</h4>
                    <p style={{ fontSize: '0.8rem' }}>{taskname}</p>
                </div>
                <br />
                {
                    subTasks.length > 0 ?
                        <div className='subTasks'>
                            <h4>subtasks</h4>
                            {
                                subTasks.map(t => <div
                                    style={{
                                        borderRadius: '5px',
                                        border: '1px solid #ececec',
                                        padding: '5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    className='subTask' key={t}>
                                    <div style={{ flex: 1 }}>{t}</div>
                                    <button onClick={() => removeSubTask(t)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'

                                        }}
                                    >Done</button>
                                </div>)
                            }
                        </div>
                        :
                        null
                }
                <div>
                    <h4>Description</h4>
                    <p style={{ fontSize: '0.8rem', whiteSpace: 'pre-line' }}>{description}</p>
                </div>
                <br />
                <div>
                    <h4>Status</h4>
                    <p style={{ fontSize: '0.8rem' }}>{status ? 'Completed' : 'In Progress'}</p>
                </div>
                <div>

                </div>
                <br />
                <div>
                    <h4>{`Member${memberassign?.length > 1 ? 's' : ''} Assigned`}</h4>

                    {memberassign?.map((membur, index) => {
                        // Assuming membur is a string with first and last name separated by a space
                        const nameParts = membur.split(' ');
                        const firstName = nameParts[0];
                        // You can customize the size and style of the avatar using props of the Avatar component
                        return <Avatar key={index} name={firstName} size="40" round />;
                    })}
                </div>
                <CloseButton onClick={onClose}>
                    <FaTimes />
                </CloseButton>
            </ModalContent>
        </ModalContainer>
    );
};

export default ModalDetails;
