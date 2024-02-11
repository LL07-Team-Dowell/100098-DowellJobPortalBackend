import React from "react";
import "./DeleteConfirmation.scss";

const DeleteConfirmation = ({ 
  text, 
  closeModal, 
  deleteFunction, 
  id, 
  itemName, 
}) => {
  return (
    <div className='overlay'>
      <div className='delete_confirmation_container'>
        <p>{text}</p>
        <ul className='delete__Confirmation_Confirm__Info'>
          <li>This will permanently delete this {itemName}</li>
          <li>You will not be able to access this {itemName} again anywhere in the application</li>
        </ul>
        <div className='buttons'>
          <button onClick={deleteFunction} className='delete'>
            Delete
          </button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
