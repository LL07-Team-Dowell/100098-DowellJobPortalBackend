import React, { useState } from "react";

const Buttons = ({ changeCardsStats }) => {
  const [button, setButton] = useState(1);
  // sadsadasd
  return (
    <div className='btns__work_log_request'>
      <button
        className={button === 1 && "active"}
        onClick={() => {
          changeCardsStats("pending-approved");
          setButton(1);
        }}
      >
        Pending approval
      </button>
      <button
        className={button === 2 && "active"}
        onClick={() => {
          changeCardsStats("approved");
          setButton(2);
        }}
      >
        Approved
      </button>
      <button
        className={button === 3 && "active"}
        onClick={() => {
          changeCardsStats("denied");
          setButton(3);
        }}
      >
        Denied
      </button>
    </div>
  );
};

export default Buttons;
