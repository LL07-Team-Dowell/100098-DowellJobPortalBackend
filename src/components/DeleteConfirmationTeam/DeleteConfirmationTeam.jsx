import React from "react";
export default function DeleteConfirmationTeam({ close, deleteFunction }) {
  return (
    <div className="overlay">
      <div className="delete_confirmation_container">
        <p>Sure you wanna delete this team?</p>
        <div className="buttons">
          <button onClick={deleteFunction}>Delete</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
