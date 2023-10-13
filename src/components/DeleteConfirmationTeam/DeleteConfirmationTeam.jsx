import React from "react";
import './DeleteConfirmationTeam.scss'
export default function DeleteConfirmationTeam({ close, deleteFunction }) {
  return (
    <div className="overlay">
      <div className="delete_confirmation_container">
        <p>Are you sure you want to delete this team?</p>
        <div className="buttons">
          <button onClick={deleteFunction} className="delete">Delete</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
