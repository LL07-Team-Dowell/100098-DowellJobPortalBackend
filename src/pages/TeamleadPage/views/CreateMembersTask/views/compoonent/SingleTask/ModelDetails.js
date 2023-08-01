import Avatar from 'react-avatar';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
  width: 400px;
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

const ModalDetails = ({ taskname, status, memberassign, onClose }) => {
    console.log(memberassign);
    return (
        <ModalContainer>
            <ModalContent>
                <h3 style={{ textAlign: 'center' }}>View Team Task Details</h3>

                <div>
                    <h4>Task</h4>
                    <p>{taskname}</p>
                </div>
                <br />
                <div>
                    <h4>Status</h4>
                    <p>{status ? 'Completed' : 'In Progress'}</p>
                </div>
                <br />
                <div>
                    <h4>Member Assigned</h4>

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
