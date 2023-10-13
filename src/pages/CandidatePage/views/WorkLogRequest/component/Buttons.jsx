import React from "react";

const Buttons = ({ changeCardsStats }) => {
  return (
    <div className='btns__work_log_request'>
      <button onClick={() => changeCardsStats("pending-approved")}>
        pending approved
      </button>
      <button onClick={() => changeCardsStats("approved")}>approved</button>
      <button onClick={() => changeCardsStats("denied")}>denied</button>
    </div>
  );
};

export default Buttons;
