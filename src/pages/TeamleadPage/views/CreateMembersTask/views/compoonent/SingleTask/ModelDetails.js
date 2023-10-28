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
    const subTaskArray = Object.keys(subtasks || {}).map(key => [{ name: key, value: Object.values(subtasks)[key] }])
    const [subTasks, setSubTask] = useState(subTaskArray);
    const [edit, setEdit] = useState(false)
    const [checkedSubtask, setCheckedSubtask] = useState([]);
    const isSmallScreen = useMediaQuery('(max-width: 767px)');

    const editSubtaskStatus = (value) => {
        const newData = {
            ...data,
            subtasks: subTasks.map(s => s === value ? s === true : false)
        }
        editTeamTask(taskId, newData)
            .then(() => {
                setCheckedSubtask([...checkedSubtask, subTasks.find(t => t === value)])
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
                    subTaskArray.length > 0 ?
                        <div className='subTasks'>
                            <h4>Subtasks</h4>
                            {
                                subTaskArray.map(t => <div>
                                    <input
                                        type="checkbox"
                                        value={t.name}
                                        key={t.name}
                                        onChange={() => editSubtaskStatus(t.name)}
                                    />
                                    <p>{t.name}</p>
                                </div>)
                            }
                        </div>
                        :
                        null
                }
                <br />
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
