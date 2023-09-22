import React from "react";
import "./DeleteConfirmation.scss";
const DeleteConfirmation = ({ text, closeModal, deleteFunction, id }) => {
  console.log(id);
  return (
    <div className='overlay'>
      <div className='delete_confirmation_container'>
        <p>{text}</p>
        <div className='buttons'>
          <button onClick={() => deleteFunction(id)} className='delete'>
            Delete
          </button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
