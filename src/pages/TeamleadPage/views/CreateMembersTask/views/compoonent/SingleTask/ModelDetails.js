import { useMediaQuery } from '@mui/material';
import Avatar from 'react-avatar';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

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

const ModalDetails = ({ taskname, status, memberassign, onClose, description }) => {
      const isSmallScreen = useMediaQuery('(max-width: 767px)');

    console.log(memberassign);
    return (
        <ModalContainer>
            <ModalContent style={{ 
                width: isSmallScreen ? '90%' : '450px',
                maxHeight: '75%',
                overflowY: 'auto', 
            }}>
                <h3 style={{ 
                    // textAlign: 'center', 
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
                <div>
                    <h4>Description</h4>
                    <p style={{ fontSize: '0.8rem', whiteSpace: 'pre-line' }}>{description}</p>
                </div>
                <br />
                <div>
                    <h4>Status</h4>
                    <p style={{ fontSize: '0.8rem' }}>{status ? 'Completed' : 'In Progress'}</p>
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
